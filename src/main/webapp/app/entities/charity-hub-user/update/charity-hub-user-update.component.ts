import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CharityHubUserFormService, CharityHubUserFormGroup } from './charity-hub-user-form.service';
import { ICharityHubUser } from '../charity-hub-user.model';
import { CharityHubUserService } from '../service/charity-hub-user.service';
import { IUserPage } from 'app/entities/user-page/user-page.model';
import { UserPageService } from 'app/entities/user-page/service/user-page.service';
import { IAuthentication } from 'app/entities/authentication/authentication.model';
import { AuthenticationService } from 'app/entities/authentication/service/authentication.service';

@Component({
  selector: 'jhi-charity-hub-user-update',
  templateUrl: './charity-hub-user-update.component.html',
})
export class CharityHubUserUpdateComponent implements OnInit {
  isSaving = false;
  charityHubUser: ICharityHubUser | null = null;

  userPagesCollection: IUserPage[] = [];
  authenticationsCollection: IAuthentication[] = [];

  editForm: CharityHubUserFormGroup = this.charityHubUserFormService.createCharityHubUserFormGroup();

  constructor(
    protected charityHubUserService: CharityHubUserService,
    protected charityHubUserFormService: CharityHubUserFormService,
    protected userPageService: UserPageService,
    protected authenticationService: AuthenticationService,
    protected activatedRoute: ActivatedRoute
  ) {}

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
