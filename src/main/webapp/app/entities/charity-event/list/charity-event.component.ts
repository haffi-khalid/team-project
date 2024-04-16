import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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
import dayjs from 'dayjs/esm';
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

  charityNameSelector: string = '';

  selectedDateTime: string = '';
  selectedFilter: string = 'dateTime';
  ////pop up for event-box
  //  selectedEvent property to store the selected event
  selectedEvent: ICharityEvent | null = null;

  dateSelector: dayjs.Dayjs | undefined;

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

  // Modify showEventDetails method to set isOpen to true
  showEventDetails(event: ICharityEvent): void {
    this.selectedEvent = event;
    this.isModalOpen = true;
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
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check if the modal is open and handle keyboard events accordingly
    if (this.selectedEvent && this.isModalOpen) {
      switch (event.key) {
        case 'ArrowLeft':
          this.navigateModal('left');
          break;
        case 'ArrowRight':
          this.navigateModal('right');
          break;
        case 'ArrowUp':
          this.navigateModal('up');
          break;
        case 'ArrowDown':
          this.navigateModal('down');
          break;
        case 'Enter':
          this.closeModal();
          break;
      }
    }
  }
  // Add isOpen property to track modal open state
  isModalOpen = false;

  // Add closeModal method to close the modal
  closeModal(): void {
    this.selectedEvent = null;
    this.isModalOpen = false;
  }

  navigateModal(direction: 'left' | 'right' | 'up' | 'down'): void {
    // Implement logic to navigate within the modal based on the direction
    // For example, you can focus on different elements within the modal or change content
    // This method will depend on the specific layout and structure of your modal content
    if (!this.selectedEvent || !this.filteredEvents) {
      return; // Return if no event is selected or if filteredEvents is undefined
    }

    const eventIndex = this.filteredEvents.findIndex(event => event === this.selectedEvent);
    let newIndex = eventIndex;

    switch (direction) {
      case 'left':
        newIndex = (eventIndex - 1 + this.filteredEvents.length) % this.filteredEvents.length;
        break;
      case 'right':
        newIndex = (eventIndex + 1) % this.filteredEvents.length;
        break;
      case 'up':
        // Handle up navigation if needed
        break;
      case 'down':
        // Handle down navigation if needed
        break;
    }

    if (newIndex !== eventIndex) {
      this.selectedEvent = this.filteredEvents[newIndex];
    }
  }

  // applyFilters() {
  //   // Make sure there are events to filter
  //   if (!this.charityEvents) {
  //     this.filteredEvents = [];
  //     return;
  //   }
  //
  //   // If dateSelector has a value, filter the events; otherwise, reset the filter
  //   if (this.dateSelector) {
  //     // Assuming eventTimeDate is a Day.js object and dateSelector is a compatible format
  //     // Convert dateSelector to a Day.js object if it's a string
  //     const selectedDate = dayjs(this.dateSelector);
  //
  //     // Filter based on the same date
  //     this.filteredEvents = this.charityEvents.filter(event =>
  //       event.eventTimeDate?.isSame(selectedDate, 'day')
  //     );
  //   } else {
  //     // If no date is selected, don't apply any date filters
  //     this.filteredEvents = [...this.charityEvents];
  //   }
  // }

  applyFilters(): void {
    if (!this.charityEvents.length) {
      this.filteredEvents = [];
      return;
    }

    switch (this.selectedFilter) {
      case 'startDate':
        // Ensure dateSelector is not null or undefined before calling toDate()
        if (this.dateSelector) {
          const filterDate = this.dateSelector.toDate();
          filterDate.setHours(0, 0, 0, 0); // Normalize the date to start of day for comparison
          this.filteredEvents = this.charityEvents.filter(event => {
            if (event.eventTimeDate) {
              const eventDate = new Date(event.eventTimeDate.toDate());
              eventDate.setHours(0, 0, 0, 0);
              return eventDate.getTime() === filterDate.getTime();
            }
            return false; // If event.eventTimeDate is undefined or null, filter out this event
          });
        }
        break;

      case 'charityName':
        // Ensures that both charityName and charityNameSelector are treated safely.
        if (this.charityNameSelector) {
          // Ensure charityNameSelector is not null or undefined
          this.filteredEvents = this.charityEvents.filter(event =>
            event.charityProfile?.charityName?.toLowerCase().includes(this.charityNameSelector.toLowerCase())
          );
        }

        break;

      default:
        this.filteredEvents = [...this.charityEvents];
    }
  }
}

// import { Component, OnInit } from '@angular/core';
// import { HttpResponse } from '@angular/common/http';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import dayjs from 'dayjs';
//
// import { ICharityEvent } from '../charity-event.model';
// import { CharityEventService } from '../service/charity-event.service';
// import { CharityEventDeleteDialogComponent } from '../delete/charity-event-delete-dialog.component';
//
// @Component({
//   selector: 'jhi-charity-event',
//   templateUrl: './charity-event.component.html',
//   styleUrls: ['./charity-event.component.css']
// })
// export class CharityEventComponent implements OnInit {
//   charityEvents: ICharityEvent[] = [];
//   filteredEvents?: ICharityEvent[];
//   isLoading = false;
//   selectedFilter: string = '';
//   dateSelector: dayjs.Dayjs | undefined;
//   charityNameSelector: string = '';
//
//   constructor(
//     private charityEventService: CharityEventService,
//     private modalService: NgbModal
//   ) {}
//
//   ngOnInit(): void {
//     this.loadCharityEvents();
//   }
//
//   loadCharityEvents(): void {
//     this.isLoading = true;
//     this.charityEventService.query().subscribe((response: HttpResponse<ICharityEvent[]>) => {
//       this.charityEvents = response.body ?? [];
//       this.filteredEvents = [...this.charityEvents];
//       this.isLoading = false;
//     }, error => {
//       console.error('Error loading charity events:', error);
//       this.isLoading = false;
//     });
//   }
//
//
//
//
//
//   showEventDetails(event: ICharityEvent): void {
//     const modalRef = this.modalService.open(CharityEventDeleteDialogComponent, {
//       size: 'lg',
//       backdrop: 'static'
//     });
//     modalRef.componentInstance.event = event; // Pass 'event' directly to the modal's instance
//   }
//
//
//   deleteEvent(event: ICharityEvent): void {
//     const modalRef = this.modalService.open(CharityEventDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
//     modalRef.componentInstance.charityEvent = event;
//     modalRef.result.then((result) => {
//       if (result === 'deleted') {
//         this.loadCharityEvents();
//       }
//     });
//   }
// }
