import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFundraisingIdea } from '../fundraising-idea.model';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, FundraisingIdeaService } from '../service/fundraising-idea.service';
import { FundraisingIdeaDeleteDialogComponent } from '../delete/fundraising-idea-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { SortService } from 'app/shared/sort/sort.service';

@Component({
  selector: 'jhi-fundraising-idea',
  templateUrl: './fundraising-idea.component.html',
  styleUrls: ['./fundraising-idea.component.scss'],
})
export class FundraisingIdeaComponent implements OnInit {
  fundraisingIdeas?: IFundraisingIdea[];
  isLoading = false;

  predicate = 'id';
  ascending = true;
  showSearchResults: boolean = false;

  constructor(
    protected fundraisingIdeaService: FundraisingIdeaService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected sortService: SortService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal
  ) {}

  trackId = (_index: number, item: IFundraisingIdea): number => this.fundraisingIdeaService.getFundraisingIdeaIdentifier(item);

  ngOnInit(): void {
    this.load();
  }

  randomIdea?: IFundraisingIdea;
  showPopup = false;
  getRandomIdea() {
    this.fundraisingIdeaService.getRandomIdea().subscribe((idea: IFundraisingIdea) => {
      this.randomIdea = idea;
      this.showPopup = true;
    });
  }

  hideRandomPopup() {
    this.showPopup = false;
  }

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const popup = document.querySelector('.popup-overlay') as HTMLElement;
    if (this.showPopup && popup && !popup.contains(target)) {
      this.hideRandomPopup();
    }
  }
  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  isFormOpen: boolean = false;
  formData = {
    budget: '',
    location: '',
    volunteers: 0,
    attendants: 0,
  };

  openForm() {
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
  }

  idea: IFundraisingIdea = {
    id: 0, // Assuming ID should be initialized to some default value
    ideaName: null,
    ideaDescription: null,
    numberOfVolunteers: null,
    location: null,
    expectedCost: null,
    expectedAttendance: null,
    charityAdmin: null,
  };
  protected readonly onsubmit = onsubmit;
  searchResults: IFundraisingIdea[] = [];
  onSubmit() {
    this.fundraisingIdeaService.searchIdeas(this.idea).subscribe(
      response => {
        if (response === null || response.length === 0) {
          console.log('No result found');
          this.isFormOpen = false;
          this.fundraisingIdeas = [];
        } else {
          console.log('Found ', response.length);
          this.fundraisingIdeas = response;
          this.isFormOpen = false;
        }
      },
      error => {
        console.error('Error while searching for ideas:', error);
      }
    );
  }

  delete(fundraisingIdea: IFundraisingIdea): void {
    const modalRef = this.modalService.open(FundraisingIdeaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.fundraisingIdea = fundraisingIdea;
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
    this.fundraisingIdeas = this.refineData(dataFromBody);
  }

  protected refineData(data: IFundraisingIdea[]): IFundraisingIdea[] {
    return data.sort(this.sortService.startSort(this.predicate, this.ascending ? 1 : -1));
  }

  protected fillComponentAttributesFromResponseBody(data: IFundraisingIdea[] | null): IFundraisingIdea[] {
    return data ?? [];
  }

  protected queryBackend(predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const queryObject = {
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.fundraisingIdeaService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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
