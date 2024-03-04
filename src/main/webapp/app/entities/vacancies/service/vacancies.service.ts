import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVacancies, NewVacancies } from '../vacancies.model';

export type PartialUpdateVacancies = Partial<IVacancies> & Pick<IVacancies, 'id'>;

type RestOf<T extends IVacancies | NewVacancies> = Omit<T, 'vacancyStartDate'> & {
  vacancyStartDate?: string | null;
};

export type RestVacancies = RestOf<IVacancies>;

export type NewRestVacancies = RestOf<NewVacancies>;

export type PartialUpdateRestVacancies = RestOf<PartialUpdateVacancies>;

export type EntityResponseType = HttpResponse<IVacancies>;
export type EntityArrayResponseType = HttpResponse<IVacancies[]>;

@Injectable({ providedIn: 'root' })
export class VacanciesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vacancies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vacancies: NewVacancies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacancies);
    return this.http
      .post<RestVacancies>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vacancies: IVacancies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacancies);
    return this.http
      .put<RestVacancies>(`${this.resourceUrl}/${this.getVacanciesIdentifier(vacancies)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vacancies: PartialUpdateVacancies): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacancies);
    return this.http
      .patch<RestVacancies>(`${this.resourceUrl}/${this.getVacanciesIdentifier(vacancies)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVacancies>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVacancies[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVacanciesIdentifier(vacancies: Pick<IVacancies, 'id'>): number {
    return vacancies.id;
  }

  compareVacancies(o1: Pick<IVacancies, 'id'> | null, o2: Pick<IVacancies, 'id'> | null): boolean {
    return o1 && o2 ? this.getVacanciesIdentifier(o1) === this.getVacanciesIdentifier(o2) : o1 === o2;
  }

  addVacanciesToCollectionIfMissing<Type extends Pick<IVacancies, 'id'>>(
    vacanciesCollection: Type[],
    ...vacanciesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vacancies: Type[] = vacanciesToCheck.filter(isPresent);
    if (vacancies.length > 0) {
      const vacanciesCollectionIdentifiers = vacanciesCollection.map(vacanciesItem => this.getVacanciesIdentifier(vacanciesItem)!);
      const vacanciesToAdd = vacancies.filter(vacanciesItem => {
        const vacanciesIdentifier = this.getVacanciesIdentifier(vacanciesItem);
        if (vacanciesCollectionIdentifiers.includes(vacanciesIdentifier)) {
          return false;
        }
        vacanciesCollectionIdentifiers.push(vacanciesIdentifier);
        return true;
      });
      return [...vacanciesToAdd, ...vacanciesCollection];
    }
    return vacanciesCollection;
  }

  protected convertDateFromClient<T extends IVacancies | NewVacancies | PartialUpdateVacancies>(vacancies: T): RestOf<T> {
    return {
      ...vacancies,
      vacancyStartDate: vacancies.vacancyStartDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restVacancies: RestVacancies): IVacancies {
    return {
      ...restVacancies,
      vacancyStartDate: restVacancies.vacancyStartDate ? dayjs(restVacancies.vacancyStartDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVacancies>): HttpResponse<IVacancies> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVacancies[]>): HttpResponse<IVacancies[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
