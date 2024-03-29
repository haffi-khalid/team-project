import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { UserPageFormService, UserPageFormGroup } from './user-page-form.service';
import { IUserPage } from '../user-page.model';
import { UserPageService } from '../service/user-page.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-user-page-update',
  templateUrl: './user-page-update.component.html',
})
export class UserPageUpdateComponent implements OnInit {
  isSaving = false;
  userPage: IUserPage | null = null;

  editForm: UserPageFormGroup = this.userPageFormService.createUserPageFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected userPageService: UserPageService,
    protected userPageFormService: UserPageFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userPage }) => {
      this.userPage = userPage;
      if (userPage) {
        this.updateForm(userPage);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userPage = this.userPageFormService.getUserPage(this.editForm);
    if (userPage.id !== null) {
      this.subscribeToSaveResponse(this.userPageService.update(userPage));
    } else {
      this.subscribeToSaveResponse(this.userPageService.create(userPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserPage>>): void {
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

  protected updateForm(userPage: IUserPage): void {
    this.userPage = userPage;
    this.userPageFormService.resetForm(this.editForm, userPage);
  }
}
