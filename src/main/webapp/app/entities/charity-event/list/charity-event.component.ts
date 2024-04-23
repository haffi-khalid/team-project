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

import { ICharityProfile } from 'app/entities/charity-profile/charity-profile.model';
import dayjs from 'dayjs/esm';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';

//

@Component({
  selector: 'jhi-charity-event',
  templateUrl: './charity-event.component.html',
  styleUrls: ['./charity-event.component.css'],
})
export class CharityEventComponent implements OnInit {
  uniqueCharityProfiles: ICharityProfile[] = [];

  searchTerm: string = '';

  displayedLogos = new Set<number>();
  activeCharityProfileId: number | null = null;
  filteredEvents?: ICharityEvent[];

  charityEvents: ICharityEvent[] = [];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  charityNameSelector: string = '';

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
    this.charityEventService.query().subscribe((response: HttpResponse<ICharityEvent[]>) => {
      this.charityEvents = response.body ?? [];
      this.filteredEvents = [...this.charityEvents];
      this.updateUniqueCharityProfiles();
    });
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

  // Updated function to handle filtering by both charity name and event name
  searchEvents(term: string): void {
    if (!term) {
      // If no search term is provided, reset the filter
      this.filteredEvents = [...this.charityEvents];
    } else {
      // Local filter for event names
      const filteredByEventName = this.charityEvents.filter(event => event.eventName?.toLowerCase().includes(term.toLowerCase()));

      // API call for charity profile names
      this.charityEventService.findByCharityName(term).subscribe({
        next: (res: HttpResponse<ICharityEvent[]>) => {
          const filteredByCharityName = res.body ?? [];
          // Combine the two filters, avoiding duplicates
          this.filteredEvents = [...filteredByEventName, ...filteredByCharityName].filter(
            (event, index, self) => index === self.findIndex(e => e.id === event.id)
          );
        },
        error: (res: HttpErrorResponse) => {
          console.error('There was an error retrieving the filtered events:', res.message);
        },
      });
    }
  }

  @HostListener('click', ['$event'])
  handleClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.modal')) {
      // Assuming modal is the class of your modal
      console.log('Clicked outside modal');
      event.stopPropagation();
    }
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
    console.log('Propagation stopped for:', event.target);
  }

  // filter by logo

  filterEventsByCharity(event: MouseEvent, charityProfileId: number): void {
    event.stopPropagation();
    this.activeCharityProfileId = charityProfileId;
    this.filteredEvents = this.charityEvents.filter(charityEvent => charityEvent.charityProfile?.id === charityProfileId);
  }

  // Method to check if logo is already displayed

  onCharityLogoClick(event: MouseEvent, charityProfileId?: number): void {
    if (charityProfileId != null) {
      this.filterEventsByCharity(event, charityProfileId);
    }
  }

  updateUniqueCharityProfiles(): void {
    const charityProfilesMap = new Map<number, ICharityProfile>();
    this.charityEvents.forEach(event => {
      if (event.charityProfile && !charityProfilesMap.has(event.charityProfile.id)) {
        charityProfilesMap.set(event.charityProfile.id, event.charityProfile);
      }
    });
    this.uniqueCharityProfiles = Array.from(charityProfilesMap.values());
  }
}
