import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CharityHubUserFormService, CharityHubUserFormGroup } from './charity-hub-user-form.service';
import { ICharityHubUser } from '../charity-hub-user.model';
import { CharityHubUserService } from '../service/charity-hub-user.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { EventManager } from 'app/core/util/event-manager.service';
import { IAuthentication } from 'app/entities/authentication/authentication.model';
import { AuthenticationService } from 'app/entities/authentication/service/authentication.service';
import { DataUtils, FileLoadError } from '../../../core/util/data-util.service';
import { EventWithContent } from '../../../core/util/event-manager.service';
import { AlertError } from '../../../shared/alert/alert-error.model';

@Component({
  selector: 'jhi-charity-hub-user-update',
  templateUrl: './charity-hub-user-update.component.html',
  styleUrls: ['../detail/charity-hub-user-detail.component.css'],
})
export class CharityHubUserUpdateComponent implements OnInit {
  isSaving = false;
  charityHubUser: ICharityHubUser | null = null;

  usersSharedCollection: IUser[] = [];
  userPagesCollection: IUserPage[] = [];
  authenticationsCollection: IAuthentication[] = [];

  editForm: CharityHubUserFormGroup = this.charityHubUserFormService.createCharityHubUserFormGroup();

  constructor(
    protected hubUserManager: EventManager,
    protected dataUtils: DataUtils,
    protected charityHubUserService: CharityHubUserService,
    protected charityHubUserFormService: CharityHubUserFormService,
    protected userService: UserService,
    protected userPageService: UserPageService,
    protected authenticationService: AuthenticationService,
    protected activatedRoute: ActivatedRoute,
    protected elementRef: ElementRef
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  compareUserPage = (o1: IUserPage | null, o2: IUserPage | null): boolean => this.userPageService.compareUserPage(o1, o2);

  compareAuthentication = (o1: IAuthentication | null, o2: IAuthentication | null): boolean =>
    this.authenticationService.compareAuthentication(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityHubUser }) => {
      this.charityHubUser = charityHubUser;
      if (charityHubUser) {
        this.updateForm(charityHubUser);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
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
        this.hubUserManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  save(): void {
    this.isSaving = true;
    const charityHubUser = this.charityHubUserFormService.getCharityHubUser(this.editForm);
    if (charityHubUser.id !== null) {
      this.subscribeToSaveResponse(this.charityHubUserService.update(charityHubUser));
    } else {
      this.subscribeToSaveResponse(this.charityHubUserService.create(charityHubUser));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICharityHubUser>>): void {
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

  protected updateForm(charityHubUser: ICharityHubUser): void {
    this.charityHubUser = charityHubUser;
    this.charityHubUserFormService.resetForm(this.editForm, charityHubUser);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, charityHubUser.user);
    this.userPagesCollection = this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(
      this.userPagesCollection,
      charityHubUser.userPage
    );
    this.authenticationsCollection = this.authenticationService.addAuthenticationToCollectionIfMissing<IAuthentication>(
      this.authenticationsCollection,
      charityHubUser.authentication
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.charityHubUser?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.userPageService
      .query({ filter: 'charityhubuser-is-null' })
      .pipe(map((res: HttpResponse<IUserPage[]>) => res.body ?? []))
      .pipe(
        map((userPages: IUserPage[]) =>
          this.userPageService.addUserPageToCollectionIfMissing<IUserPage>(userPages, this.charityHubUser?.userPage)
        )
      )
      .subscribe((userPages: IUserPage[]) => (this.userPagesCollection = userPages));

    this.authenticationService
      .query({ filter: 'charityhubuser-is-null' })
      .pipe(map((res: HttpResponse<IAuthentication[]>) => res.body ?? []))
      .pipe(
        map((authentications: IAuthentication[]) =>
          this.authenticationService.addAuthenticationToCollectionIfMissing<IAuthentication>(
            authentications,
            this.charityHubUser?.authentication
          )
        )
      )
      .subscribe((authentications: IAuthentication[]) => (this.authenticationsCollection = authentications));
  }
}
