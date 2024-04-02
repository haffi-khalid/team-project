import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, forkJoin, Observable, Subscription, switchMap, tap } from 'rxjs';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVacancies } from '../vacancies.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, EntityResponseType, VacanciesService } from '../service/vacancies.service';
import { VacanciesDeleteDialogComponent } from '../delete/vacancies-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { AccountService } from '../../../core/auth/account.service';
import { LoginPopUpCheckComponent } from '../../../login-pop-up-check/login-pop-up-check.component';
import dayjs from 'dayjs/esm';
import { VolunteerApplicationsComponent } from '../../volunteer-applications/list/volunteer-applications.component';
import { HttpResponse } from '@angular/common/http';
import { ICharityHubUser } from '../../charity-hub-user/charity-hub-user.model';
import { CharityHubUserService } from '../../charity-hub-user/service/charity-hub-user.service';
import { VolunteerApplicationsService } from '../../volunteer-applications/service/volunteer-applications.service';

@Component({
  selector: 'jhi-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss'],
})
export class VacanciesComponent implements OnInit {
  vacancies?: IVacancies[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  charityNames: Observable<string[]>;
  filteredCharityNames: string[] = [];
  searchText: string = '';
  filteredCharityId: number[] = [];
  remote: boolean = false;
  person: boolean = false;
  charityHubUser?: ICharityHubUser | null;
  filteredVacancies: IVacancies[] | undefined;
  dateSelector: dayjs.Dayjs | undefined;
  toggled = false;
  volunteerApplicationId: number = -1;

  constructor(
    protected vacanciesService: VacanciesService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected charityHubUserService: CharityHubUserService,
    protected volunteerApplicationService: VolunteerApplicationsService,
    protected accountService: AccountService
  ) {
    this.charityNames = this.vacanciesService.getAllCharityNames();
  }

  trackId = (_index: number, item: IVacancies): number => this.vacanciesService.getVacanciesIdentifier(item);

  ngOnInit(): void {
    this.load();
  }
  applyFilters() {
    this.filteredVacancies = this.vacancies;
    if (this.vacancies != null) {
      if (this.remote && this.person && this.dateSelector) {
        this.filteredVacancies = this.vacancies.filter(
          home =>
            (home.vacancyLocation?.includes('REMOTE') || home.vacancyLocation?.includes('INPERSON')) &&
            home.vacancyStartDate?.isSame(this.dateSelector)
        );
      }
      if (this.person && !this.remote && this.dateSelector) {
        this.filteredVacancies = this.vacancies.filter(
          home => home.vacancyLocation?.includes('INPERSON') && home.vacancyStartDate?.isSame(this.dateSelector)
        );
      }
      if (this.person && !this.remote && !this.dateSelector) {
        this.filteredVacancies = this.vacancies.filter(home => home.vacancyLocation?.includes('INPERSON'));
      }
      if (this.remote && !this.person && !this.dateSelector) {
        this.filteredVacancies = this.vacancies.filter(home => home.vacancyLocation?.includes('REMOTE'));
      }
      if (this.remote && !this.person && this.dateSelector) {
        this.filteredVacancies = this.vacancies.filter(
          home => home.vacancyLocation?.includes('REMOTE') && home.vacancyStartDate?.isSame(this.dateSelector)
        );
      }
      if (!this.remote && !this.person && !this.dateSelector) {
        this.filteredVacancies = undefined;
      }
      if (!this.remote && !this.person && this.dateSelector) {
        this.filteredVacancies = this.vacancies.filter(home => home.vacancyStartDate?.isSame(this.dateSelector));
      }
    }
  }
  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }
  filterResults(search: string) {
    if (this.searchText.trim() === '') {
      this.filteredCharityId = [];
      this.filteredCharityNames = [];
    } else {
      this.charityNames.subscribe(charityNames => {
        this.filteredCharityNames = charityNames.filter(charityName => charityName.toLowerCase().includes(search.toLowerCase()));
        const forLoop = this.filteredCharityNames.map(name => this.vacanciesService.getCharityId(name));
        forkJoin(forLoop).subscribe(charityIds => {
          this.filteredCharityId = charityIds;
        });
      });
    }
  }

  cleanFilterVariables(text: string) {
    if (text == '') {
      this.filteredCharityNames = [];
      this.filteredCharityId = [];
    }
  }
  openLoginCheckDialog(vacancies: IVacancies) {
    if (!this.accountService.isAuthenticated()) {
      const modalRef = this.modalService.open(LoginPopUpCheckComponent, { size: 'xl' });
      modalRef.componentInstance.vacancies = vacancies;
    } else {
      this.charityHubUserService.findByUser().subscribe((res: HttpResponse<ICharityHubUser>) => {
        this.charityHubUser = res.body;
        this.checkUserApplications(vacancies);
      });
    }
  }

  checkUserApplications(vacancies: IVacancies) {
    if (this.charityHubUser?.id) {
      this.volunteerApplicationService.findByHubUser(this.charityHubUser?.id, vacancies.id).subscribe(applicationId => {
        this.volunteerApplicationId = applicationId;
        this.alertBox(vacancies);
      });
    }
  }
  alertBox(vacancies: IVacancies) {
    if (this.volunteerApplicationId > 0) {
      alert('You have already applied to the ' + vacancies.vacancyTitle + ' Vacancy. Please apply to another one!');
    } else {
      this.router.navigate(['/volunteer-applications/new/vacancy', vacancies?.id]);
    }
  }

  openVolunteerTrackerDialog() {
    this.modalService.open(VolunteerApplicationsComponent, { size: 'xl' });
    // modalRef.componentInstance.vacancies = vacancies;
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(vacancies: IVacancies): void {
    const modalRef = this.modalService.open(VacanciesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vacancies = vacancies;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.vacancies = this.refineData(dataFromBody);
  }

  protected refineData(data: IVacancies[]): IVacancies[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IVacancies[] | null): IVacancies[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.vacanciesService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
