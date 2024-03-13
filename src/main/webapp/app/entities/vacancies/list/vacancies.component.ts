import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, Subscription, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVacancies } from '../vacancies.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, EntityResponseType, VacanciesService } from '../service/vacancies.service';
import { VacanciesDeleteDialogComponent } from '../delete/vacancies-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';
import { AccountService } from '../../../core/auth/account.service';

@Component({
  selector: 'jhi-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.scss'],
})
export class VacanciesComponent implements OnInit {
  vacancies?: IVacancies[];
  isLoading = false;
  vacancies2?: IVacancies[];

  predicate = 'id';
  ascending = true;
  charityNames: Observable<string[]>;
  filteredCharityNames: string[] = [];
  charityNameSub: Subscription = new Subscription();
  searchText: string = '';
  filteredCharityId: number[] = [];
  toggled: boolean = false;

  constructor(
    protected vacanciesService: VacanciesService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected accountService: AccountService
  ) {
    this.charityNames = this.vacanciesService.getAllCharityNames();
  }

  trackId = (_index: number, item: IVacancies): number => this.vacanciesService.getVacanciesIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }
  filterResults(text: string) {
    this.toggled = !this.toggled;
    if (this.searchText.trim() === '') {
      this.filteredCharityId = [];
      this.filteredCharityNames = [];
    } else {
      this.charityNameSub = this.charityNames.subscribe(
        names => (this.filteredCharityNames = names.filter(name => name.toLowerCase().includes(text.toLowerCase())))
      );
      for (let i = 0; i < this.filteredCharityNames.length; i++) {
        this.vacanciesService.getCharityId(this.filteredCharityNames[i]).subscribe(id => (this.filteredCharityId[i] = id));
      }
    }
    /*this.vacanciesService.getCharityVacancies(this.filteredCharityId[0]).subscribe(vacancy=>this.onResponseSuccess2(vacancy))**/
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
  protected onResponseSuccess2(response: EntityArrayResponseType): void {
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.vacancies2 = this.refineData(dataFromBody);
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
