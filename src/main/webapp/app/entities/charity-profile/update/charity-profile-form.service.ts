import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICharityProfile, NewCharityProfile } from '../charity-profile.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICharityProfile for edit and NewCharityProfileFormGroupInput for create.
 */
type CharityProfileFormGroupInput = ICharityProfile | PartialWithRequiredKeyOf<NewCharityProfile>;

type CharityProfileFormDefaults = Pick<NewCharityProfile, 'id'>;

type CharityProfileFormGroupContent = {
  id: FormControl<ICharityProfile['id'] | NewCharityProfile['id']>;
  charityName: FormControl<ICharityProfile['charityName']>;
  purpose: FormControl<ICharityProfile['purpose']>;
  aim: FormControl<ICharityProfile['aim']>;
  emailAddress: FormControl<ICharityProfile['emailAddress']>;
  logo: FormControl<ICharityProfile['logo']>;
  logoContentType: FormControl<ICharityProfile['logoContentType']>;
  pictures: FormControl<ICharityProfile['pictures']>;
  picturesContentType: FormControl<ICharityProfile['picturesContentType']>;
  recentActivityPhotos: FormControl<ICharityProfile['recentActivityPhotos']>;
  numberOfVolunteers: FormControl<ICharityProfile['numberOfVolunteers']>;
  numberOfDonators: FormControl<ICharityProfile['numberOfDonators']>;
  socialFeed: FormControl<ICharityProfile['socialFeed']>;
};

export type CharityProfileFormGroup = FormGroup<CharityProfileFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CharityProfileFormService {
  createCharityProfileFormGroup(charityProfile: CharityProfileFormGroupInput = { id: null }): CharityProfileFormGroup {
    const charityProfileRawValue = {
      ...this.getFormDefaults(),
      ...charityProfile,
    };
    return new FormGroup<CharityProfileFormGroupContent>({
      id: new FormControl(
        { value: charityProfileRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      charityName: new FormControl(charityProfileRawValue.charityName),
      purpose: new FormControl(charityProfileRawValue.purpose),
      aim: new FormControl(charityProfileRawValue.aim),
      emailAddress: new FormControl(charityProfileRawValue.emailAddress),
      logo: new FormControl(charityProfileRawValue.logo),
      logoContentType: new FormControl(charityProfileRawValue.logoContentType),
      pictures: new FormControl(charityProfileRawValue.pictures),
      picturesContentType: new FormControl(charityProfileRawValue.picturesContentType),
      recentActivityPhotos: new FormControl(charityProfileRawValue.recentActivityPhotos),
      numberOfVolunteers: new FormControl(charityProfileRawValue.numberOfVolunteers),
      numberOfDonators: new FormControl(charityProfileRawValue.numberOfDonators),
      socialFeed: new FormControl(charityProfileRawValue.socialFeed),
    });
  }

  getCharityProfile(form: CharityProfileFormGroup): ICharityProfile | NewCharityProfile {
    return form.getRawValue() as ICharityProfile | NewCharityProfile;
  }

  resetForm(form: CharityProfileFormGroup, charityProfile: CharityProfileFormGroupInput): void {
    const charityProfileRawValue = { ...this.getFormDefaults(), ...charityProfile };
    form.reset(
      {
        ...charityProfileRawValue,
        id: { value: charityProfileRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CharityProfileFormDefaults {
    return {
      id: null,
    };
  }
}
