import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharityEvent, NewCharityEvent } from '../charity-event.model';

export type PartialUpdateCharityEvent = Partial<ICharityEvent> & Pick<ICharityEvent, 'id'>;

type RestOf<T extends ICharityEvent | NewCharityEvent> = Omit<T, 'eventTimeDate'> & {
  eventTimeDate?: string | null;
};

export type RestCharityEvent = RestOf<ICharityEvent>;

export type NewRestCharityEvent = RestOf<NewCharityEvent>;

export type PartialUpdateRestCharityEvent = RestOf<PartialUpdateCharityEvent>;

export type EntityResponseType = HttpResponse<ICharityEvent>;
export type EntityArrayResponseType = HttpResponse<ICharityEvent[]>;

@Injectable({ providedIn: 'root' })
export class CharityEventService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charity-events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charityEvent: NewCharityEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(charityEvent);
    return this.http
      .post<RestCharityEvent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(charityEvent: ICharityEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(charityEvent);
    return this.http
      .put<RestCharityEvent>(`${this.resourceUrl}/${this.getCharityEventIdentifier(charityEvent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(charityEvent: PartialUpdateCharityEvent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(charityEvent);
    return this.http
      .patch<RestCharityEvent>(`${this.resourceUrl}/${this.getCharityEventIdentifier(charityEvent)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCharityEvent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCharityEvent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCharityEventIdentifier(charityEvent: Pick<ICharityEvent, 'id'>): number {
    return charityEvent.id;
  }

  compareCharityEvent(o1: Pick<ICharityEvent, 'id'> | null, o2: Pick<ICharityEvent, 'id'> | null): boolean {
    return o1 && o2 ? this.getCharityEventIdentifier(o1) === this.getCharityEventIdentifier(o2) : o1 === o2;
  }

  addCharityEventToCollectionIfMissing<Type extends Pick<ICharityEvent, 'id'>>(
    charityEventCollection: Type[],
    ...charityEventsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charityEvents: Type[] = charityEventsToCheck.filter(isPresent);
    if (charityEvents.length > 0) {
      const charityEventCollectionIdentifiers = charityEventCollection.map(
        charityEventItem => this.getCharityEventIdentifier(charityEventItem)!
      );
      const charityEventsToAdd = charityEvents.filter(charityEventItem => {
        const charityEventIdentifier = this.getCharityEventIdentifier(charityEventItem);
        if (charityEventCollectionIdentifiers.includes(charityEventIdentifier)) {
          return false;
        }
        charityEventCollectionIdentifiers.push(charityEventIdentifier);
        return true;
      });
      return [...charityEventsToAdd, ...charityEventCollection];
    }
    return charityEventCollection;
  }

  protected convertDateFromClient<T extends ICharityEvent | NewCharityEvent | PartialUpdateCharityEvent>(charityEvent: T): RestOf<T> {
    return {
      ...charityEvent,
      eventTimeDate: charityEvent.eventTimeDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restCharityEvent: RestCharityEvent): ICharityEvent {
    return {
      ...restCharityEvent,
      eventTimeDate: restCharityEvent.eventTimeDate ? dayjs(restCharityEvent.eventTimeDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCharityEvent>): HttpResponse<ICharityEvent> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCharityEvent[]>): HttpResponse<ICharityEvent[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
