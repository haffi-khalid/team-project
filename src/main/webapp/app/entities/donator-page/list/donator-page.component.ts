import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, catchError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { IDonatorPage } from '../donator-page.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, DonatorPageService } from '../service/donator-page.service';
import { DonatorPageDeleteDialogComponent } from '../delete/donator-page-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'jhi-donator-page',
  templateUrl: './donator-page.component.html',
  styleUrls: ['./donator-page.component.css'],
})
export class DonatorPageComponent implements OnInit {
  donatorPages?: IDonatorPage[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  topDonatorPages?: IDonatorPage[];
  charityProfilesSharedCollection: ICharityProfile[] = [];

  constructor(
    protected donatorPageService: DonatorPageService,
    protected activatedRoute: ActivatedRoute,
    protected charityProfileService: CharityProfileService,
    public router: Router,
    protected sortService: SortService,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IDonatorPage): number => this.donatorPageService.getDonatorPageIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  getNumberOfDonatorsForUnicef(): number | undefined {
    // @ts-ignore
    const unicefDonatorPage = this.donatorPages.find(donatorPage => donatorPage.charityProfile?.charityName == 'Unicef');
    // @ts-ignore
    return unicefDonatorPage?.charityProfile?.numberOfDonators;
  }

  getNumberOfDonatorsForAmnestyInternational(): number | undefined {
    // @ts-ignore
    const amnestyInternationalDonatorPage = this.donatorPages.find(
      donatorPage => donatorPage.charityProfile?.charityName == 'Amnesty International'
    );
    // @ts-ignore
    return amnestyInternationalDonatorPage?.charityProfile?.numberOfDonators;
  }

  getNumberOfDonatorsForActionAgainstHomeless(): number | undefined {
    // @ts-ignore
    const actionAgainstHomelessDonatorPage = this.donatorPages.find(
      donatorPage => donatorPage.charityProfile?.charityName == 'Action Against Homeless'
    );
    // @ts-ignore
    return actionAgainstHomelessDonatorPage?.charityProfile?.numberOfDonators;
  }

  getNumberOfDonatorsForBeatUOB(): number | undefined {
    // @ts-ignore
    const beatUOBDonatorPage = this.donatorPages.find(donatorPage => donatorPage.charityProfile?.charityName == 'Beat UOB');
    // @ts-ignore
    return beatUOBDonatorPage?.charityProfile?.numberOfDonators;
  }

  getNumberOfDonatorsForMakeaSmile(): number | undefined {
    // @ts-ignore
    const makeaSmileDonatorPage = this.donatorPages.find(donatorPage => donatorPage.charityProfile?.charityName == 'Make a Smile');
    // @ts-ignore
    return makeaSmileDonatorPage?.charityProfile?.numberOfDonators;
  }

  getCharityName(charityProfileId: number | undefined): Observable<string> {
    if (charityProfileId === undefined) {
      return of('Unknown Charity');
    }

    return this.charityProfileService.find(charityProfileId).pipe(
      map((res: HttpResponse<ICharityProfile>) => {
        console.log('Response body:', res.body); // Log the response body
        const charityProfile = res.body;
        if (charityProfile && charityProfile.charityName) {
          return charityProfile.charityName;
        } else {
          console.warn('Charity name not found in response body:', res.body); // Log a warning if charity name is not found
          return 'Unknown Charity';
        }
      }),

      catchError(() => of('Unknown Charity'))
    );
  }

  delete(donatorPage: IDonatorPage): void {
    const modalRef = this.modalService.open(DonatorPageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.donatorPage = donatorPage;
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
    this.donatorPages = this.refineData(dataFromBody);
    this.topDonatorPages = this.donatorPages.slice(0, 7);
  }

  protected refineData(data: IDonatorPage[]): IDonatorPage[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? -1 : 1));
  }

  protected fillComponentAttributesFromResponseBody(data: IDonatorPage[] | null): IDonatorPage[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.donatorPageService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
