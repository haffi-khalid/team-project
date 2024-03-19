import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharityEvent } from '../charity-event.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, CharityEventService } from '../service/charity-event.service';
import { CharityEventDeleteDialogComponent } from '../delete/charity-event-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';

//
import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
//

@Component({
  selector: 'jhi-charity-event',
  templateUrl: './charity-event.component.html',
  styleUrls: ['./charity-event.component.css'],
})
export class CharityEventComponent implements OnInit {
  searchQuery: string = '';
  filteredEvents?: ICharityEvent[];

  charityEvents: ICharityEvent[] = [];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  selectedDateTime: string = '';
  selectedFilter: string = 'dateTime';
  ////pop up for event-box
  //  selectedEvent property to store the selected event
  selectedEvent: ICharityEvent | null = null;

  //

  ///
  @ViewChild('eventDetailsModal') eventDetailsModal: any;

  ///

  constructor(
    protected charityEventService: CharityEventService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  //// using hasEventImage and getEventImage to show the image in model pop of charity events.

  hasEventImage(selectedEvent: ICharityEvent | null): boolean {
    return !!selectedEvent && !!selectedEvent.imagesContentType && !!selectedEvent.images;
  }

  // Method to construct the image source URL for the selected event
  getEventImage(selectedEvent: ICharityEvent): string {
    return `data:${selectedEvent.imagesContentType};base64,${selectedEvent.images}`;
  }
  ///////////

  trackId = (_index: number, item: ICharityEvent): number => this.charityEventService.getCharityEventIdentifier(item);

  ngOnInit(): void {
    this.load();
    ////
    this.charityEvents = [];

    // this.filteredEvents = this.charityEvents;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(charityEvent: ICharityEvent): void {
    const modalRef = this.modalService.open(CharityEventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.charityEvent = charityEvent;
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
        this.filteredEvents = this.charityEvents;
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
    this.charityEvents = this.refineData(dataFromBody);
  }

  protected refineData(data: ICharityEvent[]): ICharityEvent[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: ICharityEvent[] | null): ICharityEvent[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      eagerload: true,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.charityEventService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  ///

  performSearch(): void {
    if (this.charityEvents) {
      // Check if charityEvents is not null or undefined
      // Filter charityEvents based on the search query
      this.filteredEvents = this.charityEvents.filter(
        (event: ICharityEvent) => event && event.eventName && event.eventName.toLowerCase().includes(this.searchQuery.toLowerCase())
      );

      // If a charity profile is selected, further filter events by that profile
    }
  }

  filterEventsByDateTime(): void {
    if (!this.selectedDateTime) {
      // Handle case when no date and time is selected
      return;
    }

    const selectedDate = new Date(this.selectedDateTime).toISOString();

    // Filter events based on selected date and time
    this.filteredEvents = this.charityEvents.filter(event => event.eventTimeDate?.toISOString().includes(selectedDate));
  }

  // showEventDetails(event: ICharityEvent): void {
  //   this.selectedEvent = event; // Store the selected event
  //   this.modalService.open('eventDetailsModal', { size: 'lg' }); // Open the modal
  // }

  showEventDetails(event: ICharityEvent): void {
    this.selectedEvent = event; // Store the selected event
    if (this.eventDetailsModal) {
      this.modalService.open(this.eventDetailsModal, { size: 'lg' }); // Open the modal
    } else {
      console.error('Event details modal not found.');
    }

    // filterByCharityProfile(charityProfile: CharityProfile | null): void {
    //   if (charityProfile) {
    //     this.filteredEvents = this.charityEvents.filter(event =>
    //       event.charityProfile && event.charityProfile.id === charityProfile.id
    //     );
    //   } else {
    //     // If no charity profile is selected, show all events
    //     this.filteredEvents = this.charityEvents;
    //   }
    // }
  }
}
