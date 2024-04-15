import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../core/auth/account.service';
import { IVacancies } from '../entities/vacancies/vacancies.model';
import { CharityHubUserService } from '../entities/charity-hub-user/service/charity-hub-user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ICharityHubUser } from '../entities/charity-hub-user/charity-hub-user.model';
import { IUser } from '../entities/user/user.model';
import { UserService } from '../entities/user/user.service';
import { EntityArrayResponseType, EntityResponseType, VacanciesService } from '../entities/vacancies/service/vacancies.service';
import { VolunteerApplicationsService } from '../entities/volunteer-applications/service/volunteer-applications.service';
import { IVolunteerApplications } from '../entities/volunteer-applications/volunteer-applications.model';
import { DataUtils } from '../core/util/data-util.service';
import { NgbProgressbarConfig, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-login-pop-up-check',
  templateUrl: './login-pop-up-check.component.html',
  styleUrls: ['./login-pop-up-check.component.scss'],
})
export class LoginPopUpCheckComponent implements OnInit {
  vacancies?: IVacancies;
  toggled?: boolean;
  tracker?: boolean;
  trackerWithLogin?: boolean;
  charityHubUser?: ICharityHubUser;
  user?: IUser | null;
  userVacancies?: IVacancies[] | null;
  recommendedVacancies?: IVacancies[] | null;
  noOfVacanciesApplied: number = 0;
  hourTracker = 0;
  volunteerApplications: IVolunteerApplications[] = [];

  constructor(
    protected activeModal: NgbActiveModal,
    protected config: NgbProgressbarModule,
    protected accountService: AccountService,
    private router: Router,
    protected dataUtils: DataUtils,
    protected charityHubUserService: CharityHubUserService,
    protected volunteerApplicationService: VolunteerApplicationsService,
    protected userService: UserService,
    private route: ActivatedRoute,
    protected vacanciesService: VacanciesService
  ) {}
  trackId = (_index: number, item: IVacancies): number => this.vacanciesService.getVacanciesIdentifier(item);
  trackIdApp = (_index: number, item: IVolunteerApplications): number =>
    this.volunteerApplicationService.gestVolunteerApplicationsIdentifier(item);

  ngOnInit(): void {
    if (this.accountService.isAuthenticated() && this.trackerWithLogin) {
      this.charityHubUserService.findUser().subscribe(userLog => {
        this.user = userLog.body;
        if (this.charityHubUser) {
          this.vacanciesService.findVacanciesByCharityHubUser(this.charityHubUser?.id).subscribe(res => {
            this.onResponseSuccess(res);
            this.volunteerTrackerUpdate();
            this.recommendation();
          });
        }
      });
    }
  }
  recommendation() {
    if (this.charityHubUser?.id) {
      this.vacanciesService.findVacanciesRec(this.charityHubUser?.id).subscribe(res => this.onResponseSuccess2(res));
    }
  }

  volunteerTrackerUpdate() {
    let vacancyDuration;
    if (this.userVacancies) {
      this.userVacancies.forEach(vacancy => {
        vacancyDuration = vacancy.vacancyDuration; // @ts-ignore
        this.hourTracker = this.hourTracker + vacancyDuration;
        this.noOfVacanciesApplied = this.noOfVacanciesApplied + 1;
        if (this.charityHubUser) {
          this.volunteerApplicationService.findByHubUser(this.charityHubUser.id, vacancy.id).subscribe(res => {
            this.volunteerApplicationService.find(res).subscribe(result => {
              if (result.body) {
                this.volunteerApplications.push(result.body);
              }
            });
          });
        }
      });
    }
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.userVacancies = this.fillComponentAttributesFromResponseBody(response.body);
  }
  protected onResponseSuccess2(response: EntityArrayResponseType): void {
    this.recommendedVacancies = this.fillComponentAttributesFromResponseBody(response.body);
  }
  protected fillComponentAttributesFromResponseBody(data: IVacancies[] | null): IVacancies[] {
    return data ?? [];
  }
  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  cancel(): void {
    this.activeModal.dismiss();
  }
  login() {
    this.router.navigate(['/login']);
    this.activeModal.dismiss();
  }

  apply(vacancy: IVacancies | undefined) {
    // this.route.params.subscribe(object=>this.vacancies=object['vacancy'])
    this.router.navigate(['/volunteer-applications/new/vacancy', vacancy?.id]);
    this.activeModal.dismiss();
  }
  previousState(): void {
    this.activeModal.dismiss();
    window.history.back();
  }
}
