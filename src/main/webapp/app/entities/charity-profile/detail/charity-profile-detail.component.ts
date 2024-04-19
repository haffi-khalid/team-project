import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICharityProfile } from '../charity-profile.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { CharityProfileService } from '../service/charity-profile.service';
import { EntityArrayResponseType, VolunteerApplicationsService } from '../../volunteer-applications/service/volunteer-applications.service';
import { IVolunteerApplications } from '../../volunteer-applications/volunteer-applications.model';
import { SortService } from '../../../shared/sort/sort.service';

@Component({
  selector: 'jhi-charity-profile-detail',
  templateUrl: './charity-profile-detail.component.html',
})
export class CharityProfileDetailComponent implements OnInit {
  charityProfile: ICharityProfile | null = null;
  charityAdminId: number | null = null;
  volunteerApplications?: IVolunteerApplications[] | null;
  predicate = 'id';
  ascending = true;
  constructor(
    protected dataUtils: DataUtils,
    protected sortService: SortService,
    protected activatedRoute: ActivatedRoute,
    protected volunteerApplicationService: VolunteerApplicationsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ charityProfile }) => {
      this.charityProfile = charityProfile;
    });
    this.volunteerApplicationCollect();
  }
  volunteerApplicationCollect() {
    if (this.charityProfile?.id) {
      console.log(this.volunteerApplicationService.getVolunteerApplicationsByCharityAdmin(this.charityProfile.id));
      this.volunteerApplicationService.getVolunteerApplicationsByCharityAdmin(this.charityProfile.id).subscribe(res => {
        this.onResponseSuccess(res);
      });
    }
  }

  protected fillComponentAttributesFromResponseBody(data: IVolunteerApplications[] | null): IVolunteerApplications[] {
    return data ?? [];
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    console.log('Hello');
    this.volunteerApplications = this.fillComponentAttributesFromResponseBody(response.body);
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
