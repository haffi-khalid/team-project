import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVolunteerApplications, NewVolunteerApplications } from '../volunteer-applications.model';

export type PartialUpdateVolunteerApplications = Partial<IVolunteerApplications> & Pick<IVolunteerApplications, 'id'>;

type RestOf<T extends IVolunteerApplications | NewVolunteerApplications> = Omit<T, 'timeStamp'> & {
  timeStamp?: string | null;
};

export type RestVolunteerApplications = RestOf<IVolunteerApplications>;

export type NewRestVolunteerApplications = RestOf<NewVolunteerApplications>;

export type PartialUpdateRestVolunteerApplications = RestOf<PartialUpdateVolunteerApplications>;

export type EntityResponseType = HttpResponse<IVolunteerApplications>;
export type EntityArrayResponseType = HttpResponse<IVolunteerApplications[]>;

@Injectable({ providedIn: 'root' })
export class VolunteerApplicationsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/volunteer-applications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(volunteerApplications: NewVolunteerApplications): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(volunteerApplications);
    return this.http
      .post<RestVolunteerApplications>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(volunteerApplications: IVolunteerApplications): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(volunteerApplications);
    return this.http
      .put<RestVolunteerApplications>(`${this.resourceUrl}/${this.getVolunteerApplicationsIdentifier(volunteerApplications)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(volunteerApplications: PartialUpdateVolunteerApplications): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(volunteerApplications);
    return this.http
      .patch<RestVolunteerApplications>(`${this.resourceUrl}/${this.getVolunteerApplicationsIdentifier(volunteerApplications)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVolunteerApplications>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVolunteerApplications[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVolunteerApplicationsIdentifier(volunteerApplications: Pick<IVolunteerApplications, 'id'>): number {
    return volunteerApplications.id;
  }

  compareVolunteerApplications(o1: Pick<IVolunteerApplications, 'id'> | null, o2: Pick<IVolunteerApplications, 'id'> | null): boolean {
    return o1 && o2 ? this.getVolunteerApplicationsIdentifier(o1) === this.getVolunteerApplicationsIdentifier(o2) : o1 === o2;
  }

  addVolunteerApplicationsToCollectionIfMissing<Type extends Pick<IVolunteerApplications, 'id'>>(
    volunteerApplicationsCollection: Type[],
    ...volunteerApplicationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const volunteerApplications: Type[] = volunteerApplicationsToCheck.filter(isPresent);
    if (volunteerApplications.length > 0) {
      const volunteerApplicationsCollectionIdentifiers = volunteerApplicationsCollection.map(
        volunteerApplicationsItem => this.getVolunteerApplicationsIdentifier(volunteerApplicationsItem)!
      );
      const volunteerApplicationsToAdd = volunteerApplications.filter(volunteerApplicationsItem => {
        const volunteerApplicationsIdentifier = this.getVolunteerApplicationsIdentifier(volunteerApplicationsItem);
        if (volunteerApplicationsCollectionIdentifiers.includes(volunteerApplicationsIdentifier)) {
          return false;
        }
        volunteerApplicationsCollectionIdentifiers.push(volunteerApplicationsIdentifier);
        return true;
      });
      return [...volunteerApplicationsToAdd, ...volunteerApplicationsCollection];
    }
    return volunteerApplicationsCollection;
  }

  protected convertDateFromClient<T extends IVolunteerApplications | NewVolunteerApplications | PartialUpdateVolunteerApplications>(
    volunteerApplications: T
  ): RestOf<T> {
    return {
      ...volunteerApplications,
      timeStamp: volunteerApplications.timeStamp?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVolunteerApplications: RestVolunteerApplications): IVolunteerApplications {
    return {
      ...restVolunteerApplications,
      timeStamp: restVolunteerApplications.timeStamp ? dayjs(restVolunteerApplications.timeStamp) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVolunteerApplications>): HttpResponse<IVolunteerApplications> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVolunteerApplications[]>): HttpResponse<IVolunteerApplications[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
