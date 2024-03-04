import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICharityProfile, NewCharityProfile } from '../charity-profile.model';

export type PartialUpdateCharityProfile = Partial<ICharityProfile> & Pick<ICharityProfile, 'id'>;

export type EntityResponseType = HttpResponse<ICharityProfile>;
export type EntityArrayResponseType = HttpResponse<ICharityProfile[]>;

@Injectable({ providedIn: 'root' })
export class CharityProfileService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/charity-profiles');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(charityProfile: NewCharityProfile): Observable<EntityResponseType> {
    return this.http.post<ICharityProfile>(this.resourceUrl, charityProfile, { observe: 'response' });
  }

  update(charityProfile: ICharityProfile): Observable<EntityResponseType> {
    return this.http.put<ICharityProfile>(`${this.resourceUrl}/${this.getCharityProfileIdentifier(charityProfile)}`, charityProfile, {
      observe: 'response',
    });
  }

  partialUpdate(charityProfile: PartialUpdateCharityProfile): Observable<EntityResponseType> {
    return this.http.patch<ICharityProfile>(`${this.resourceUrl}/${this.getCharityProfileIdentifier(charityProfile)}`, charityProfile, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICharityProfile>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICharityProfile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCharityProfileIdentifier(charityProfile: Pick<ICharityProfile, 'id'>): number {
    return charityProfile.id;
  }

  compareCharityProfile(o1: Pick<ICharityProfile, 'id'> | null, o2: Pick<ICharityProfile, 'id'> | null): boolean {
    return o1 && o2 ? this.getCharityProfileIdentifier(o1) === this.getCharityProfileIdentifier(o2) : o1 === o2;
  }

  addCharityProfileToCollectionIfMissing<Type extends Pick<ICharityProfile, 'id'>>(
    charityProfileCollection: Type[],
    ...charityProfilesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const charityProfiles: Type[] = charityProfilesToCheck.filter(isPresent);
    if (charityProfiles.length > 0) {
      const charityProfileCollectionIdentifiers = charityProfileCollection.map(
        charityProfileItem => this.getCharityProfileIdentifier(charityProfileItem)!
      );
      const charityProfilesToAdd = charityProfiles.filter(charityProfileItem => {
        const charityProfileIdentifier = this.getCharityProfileIdentifier(charityProfileItem);
        if (charityProfileCollectionIdentifiers.includes(charityProfileIdentifier)) {
          return false;
        }
        charityProfileCollectionIdentifiers.push(charityProfileIdentifier);
        return true;
      });
      return [...charityProfilesToAdd, ...charityProfileCollection];
    }
    return charityProfileCollection;
  }
}
