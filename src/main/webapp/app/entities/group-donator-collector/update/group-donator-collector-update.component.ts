import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GroupDonatorCollectorFormService, GroupDonatorCollectorFormGroup } from './group-donator-collector-form.service';
import { IGroupDonatorCollector } from '../group-donator-collector.model';
import { GroupDonatorCollectorService } from '../service/group-donator-collector.service';
import { IGroupDonator } from 'app/entities/group-donator/group-donator.model';
import { GroupDonatorService } from 'app/entities/group-donator/service/group-donator.service';

@Component({
  selector: 'jhi-group-donator-collector-update',
  templateUrl: './group-donator-collector-update.component.html',
})
export class GroupDonatorCollectorUpdateComponent implements OnInit {
  isSaving = false;
  groupDonatorCollector: IGroupDonatorCollector | null = null;

  groupDonatorsCollection: IGroupDonator[] = [];

  editForm: GroupDonatorCollectorFormGroup = this.groupDonatorCollectorFormService.createGroupDonatorCollectorFormGroup();

  constructor(
    protected groupDonatorCollectorService: GroupDonatorCollectorService,
    protected groupDonatorCollectorFormService: GroupDonatorCollectorFormService,
    protected groupDonatorService: GroupDonatorService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareGroupDonator = (o1: IGroupDonator | null, o2: IGroupDonator | null): boolean =>
    this.groupDonatorService.compareGroupDonator(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groupDonatorCollector }) => {
      this.groupDonatorCollector = groupDonatorCollector;
      if (groupDonatorCollector) {
        this.updateForm(groupDonatorCollector);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const groupDonatorCollector = this.groupDonatorCollectorFormService.getGroupDonatorCollector(this.editForm);
    if (groupDonatorCollector.id !== null) {
      this.subscribeToSaveResponse(this.groupDonatorCollectorService.update(groupDonatorCollector));
    } else {
      this.subscribeToSaveResponse(this.groupDonatorCollectorService.create(groupDonatorCollector));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGroupDonatorCollector>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(groupDonatorCollector: IGroupDonatorCollector): void {
    this.groupDonatorCollector = groupDonatorCollector;
    this.groupDonatorCollectorFormService.resetForm(this.editForm, groupDonatorCollector);

    this.groupDonatorsCollection = this.groupDonatorService.addGroupDonatorToCollectionIfMissing<IGroupDonator>(
      this.groupDonatorsCollection,
      groupDonatorCollector.groupDonator
    );
  }

  protected loadRelationshipsOptions(): void {
    this.groupDonatorService
      .query({ filter: 'groupdonatorcollector-is-null' })
      .pipe(map((res: HttpResponse<IGroupDonator[]>) => res.body ?? []))
      .pipe(
        map((groupDonators: IGroupDonator[]) =>
          this.groupDonatorService.addGroupDonatorToCollectionIfMissing<IGroupDonator>(
            groupDonators,
            this.groupDonatorCollector?.groupDonator
          )
        )
      )
      .subscribe((groupDonators: IGroupDonator[]) => (this.groupDonatorsCollection = groupDonators));
  }
}
