import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GroupDonatorFormService, GroupDonatorFormGroup } from './group-donator-form.service';
import { IGroupDonator } from '../group-donator.model';
import { GroupDonatorService } from '../service/group-donator.service';
import { IDonatorPage } from 'app/entities/donator-page/donator-page.model';
import { DonatorPageService } from 'app/entities/donator-page/service/donator-page.service';
import { ICharityEvent } from 'app/entities/charity-event/charity-event.model';
import { CharityEventService } from 'app/entities/charity-event/service/charity-event.service';

@Component({
  selector: 'jhi-group-donator-update',
  templateUrl: './group-donator-update.component.html',
})
export class GroupDonatorUpdateComponent implements OnInit {
  isSaving = false;
  groupDonator: IGroupDonator | null = null;

  donatorPagesCollection: IDonatorPage[] = [];
  charityEventsSharedCollection: ICharityEvent[] = [];

  editForm: GroupDonatorFormGroup = this.groupDonatorFormService.createGroupDonatorFormGroup();

  constructor(
    protected groupDonatorService: GroupDonatorService,
    protected groupDonatorFormService: GroupDonatorFormService,
    protected donatorPageService: DonatorPageService,
    protected charityEventService: CharityEventService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareDonatorPage = (o1: IDonatorPage | null, o2: IDonatorPage | null): boolean => this.donatorPageService.compareDonatorPage(o1, o2);

  compareCharityEvent = (o1: ICharityEvent | null, o2: ICharityEvent | null): boolean =>
    this.charityEventService.compareCharityEvent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groupDonator }) => {
      this.groupDonator = groupDonator;
      if (groupDonator) {
        this.updateForm(groupDonator);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const groupDonator = this.groupDonatorFormService.getGroupDonator(this.editForm);
    if (groupDonator.id !== null) {
      this.subscribeToSaveResponse(this.groupDonatorService.update(groupDonator));
    } else {
      this.subscribeToSaveResponse(this.groupDonatorService.create(groupDonator));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGroupDonator>>): void {
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

  protected updateForm(groupDonator: IGroupDonator): void {
    this.groupDonator = groupDonator;
    this.groupDonatorFormService.resetForm(this.editForm, groupDonator);

    this.donatorPagesCollection = this.donatorPageService.addDonatorPageToCollectionIfMissing<IDonatorPage>(
      this.donatorPagesCollection,
      groupDonator.donatorPage
    );
    this.charityEventsSharedCollection = this.charityEventService.addCharityEventToCollectionIfMissing<ICharityEvent>(
      this.charityEventsSharedCollection,
      groupDonator.charityEvent
    );
  }

  protected loadRelationshipsOptions(): void {
    this.donatorPageService
      .query({ filter: 'groupdonator-is-null' })
      .pipe(map((res: HttpResponse<IDonatorPage[]>) => res.body ?? []))
      .pipe(
        map((donatorPages: IDonatorPage[]) =>
          this.donatorPageService.addDonatorPageToCollectionIfMissing<IDonatorPage>(donatorPages, this.groupDonator?.donatorPage)
        )
      )
      .subscribe((donatorPages: IDonatorPage[]) => (this.donatorPagesCollection = donatorPages));

    this.charityEventService
      .query()
      .pipe(map((res: HttpResponse<ICharityEvent[]>) => res.body ?? []))
      .pipe(
        map((charityEvents: ICharityEvent[]) =>
          this.charityEventService.addCharityEventToCollectionIfMissing<ICharityEvent>(charityEvents, this.groupDonator?.charityEvent)
        )
      )
      .subscribe((charityEvents: ICharityEvent[]) => (this.charityEventsSharedCollection = charityEvents));
  }
}
