import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { DonatorPageFormService, DonatorPageFormGroup } from './donator-page-form.service';
import { IDonatorPage } from '../donator-page.model';
import { DonatorPageService } from '../service/donator-page.service';
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';

@Component({
  selector: 'jhi-donator-page-update',
  templateUrl: './donator-page-update.component.html',
  styleUrls: ['./donator-page-update.component.css'],
})
export class DonatorPageUpdateComponent implements OnInit {
  isSaving = false;
  donatorPage: IDonatorPage | null = null;

  charityProfilesSharedCollection: ICharityProfile[] = [];

  editForm: DonatorPageFormGroup = this.donatorPageFormService.createDonatorPageFormGroup();

  constructor(
    protected donatorPageService: DonatorPageService,
    protected donatorPageFormService: DonatorPageFormService,
    protected charityProfileService: CharityProfileService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCharityProfile = (o1: ICharityProfile | null, o2: ICharityProfile | null): boolean =>
    this.charityProfileService.compareCharityProfile(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ donatorPage }) => {
      this.donatorPage = donatorPage;
      if (donatorPage) {
        this.updateForm(donatorPage);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const donatorPage = this.donatorPageFormService.getDonatorPage(this.editForm);
    if (donatorPage.id !== null) {
      this.subscribeToSaveResponse(this.donatorPageService.update(donatorPage));
    } else {
      this.subscribeToSaveResponse(this.donatorPageService.create(donatorPage));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDonatorPage>>): void {
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

  protected updateForm(donatorPage: IDonatorPage): void {
    this.donatorPage = donatorPage;
    this.donatorPageFormService.resetForm(this.editForm, donatorPage);

    this.charityProfilesSharedCollection = this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
      this.charityProfilesSharedCollection,
      donatorPage.charityProfile
    );
  }

  protected loadRelationshipsOptions(): void {
    this.charityProfileService
      .query()
      .pipe(map((res: HttpResponse<ICharityProfile[]>) => res.body ?? []))
      .pipe(
        map((charityProfiles: ICharityProfile[]) =>
          this.charityProfileService.addCharityProfileToCollectionIfMissing<ICharityProfile>(
            charityProfiles,
            this.donatorPage?.charityProfile
          )
        )
      )
      .subscribe((charityProfiles: ICharityProfile[]) => (this.charityProfilesSharedCollection = charityProfiles));
  }
}
