import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDonatorPage } from '../donator-page.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, DonatorPageService } from '../service/donator-page.service';
import { DonatorPageDeleteDialogComponent } from '../delete/donator-page-delete-dialog.component';
import { SortService } from 'app/shared/sort/sort.service';

import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import { CharityProfileService } from 'app/entities/charity-profile/service/charity-profile.service';
import { map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

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

  getCharityName(charityProfileId: number | undefined | undefined): string {
    // Define a list of charity names
    const charities: string[] = ['UNICEF', 'Amnesty International', 'Action Against Homeless', 'Beat UOB', 'Make a Smile'];
    // Randomly select a charity name from the list
    const randomIndex = Math.floor(Math.random() * charities.length);

    const charityProfile = this.charityProfilesSharedCollection.find(profile => profile.id === charityProfileId);
    // @ts-ignore
    return charityProfile ? charityProfile.charityName : charities[randomIndex];
  }

  // getCharityName(charityProfileId: number | undefined): string {
  //   if (charityProfileId === undefined) {
  //     return 'Unknown Charity';
  //   }
  //
  //   const charityProfile = this.charityProfilesSharedCollection.find(profile => profile.id === charityProfileId);
  //
  //   @ts-ignore
  //   return charityProfile ? charityProfile.charityName : 'Unknown Charity';
  // }

  delete(donatorPage: IDonatorPage): void {
    const modalRef = this.modalService.open(DonatorPageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.donatorPage = donatorPage;
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
