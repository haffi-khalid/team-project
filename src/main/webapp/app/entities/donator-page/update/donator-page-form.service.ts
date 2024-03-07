import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IDonatorPage, NewDonatorPage } from '../donator-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDonatorPage for edit and NewDonatorPageFormGroupInput for create.
 */
type DonatorPageFormGroupInput = IDonatorPage | PartialWithRequiredKeyOf<NewDonatorPage>;

type DonatorPageFormDefaults = Pick<NewDonatorPage, 'id' | 'anonymous' | 'groupDonation'>;

type DonatorPageFormGroupContent = {
  id: FormControl<IDonatorPage['id'] | NewDonatorPage['id']>;
  name: FormControl<IDonatorPage['name']>;
  anonymous: FormControl<IDonatorPage['anonymous']>;
  amount: FormControl<IDonatorPage['amount']>;
  groupDonation: FormControl<IDonatorPage['groupDonation']>;
  charityProfile: FormControl<IDonatorPage['charityProfile']>;
};

export type DonatorPageFormGroup = FormGroup<DonatorPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DonatorPageFormService {
  createDonatorPageFormGroup(donatorPage: DonatorPageFormGroupInput = { id: null }): DonatorPageFormGroup {
    const donatorPageRawValue = {
      ...this.getFormDefaults(),
      ...donatorPage,
    };
    return new FormGroup<DonatorPageFormGroupContent>({
      id: new FormControl(
        { value: donatorPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(donatorPageRawValue.name),
      anonymous: new FormControl(donatorPageRawValue.anonymous),
      amount: new FormControl(donatorPageRawValue.amount),
      groupDonation: new FormControl(donatorPageRawValue.groupDonation),
      charityProfile: new FormControl(donatorPageRawValue.charityProfile),
    });
  }

  getDonatorPage(form: DonatorPageFormGroup): IDonatorPage | NewDonatorPage {
    return form.getRawValue() as IDonatorPage | NewDonatorPage;
  }

  resetForm(form: DonatorPageFormGroup, donatorPage: DonatorPageFormGroupInput): void {
    const donatorPageRawValue = { ...this.getFormDefaults(), ...donatorPage };
    form.reset(
      {
        ...donatorPageRawValue,
        id: { value: donatorPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DonatorPageFormDefaults {
    return {
      id: null,
      anonymous: false,
      groupDonation: false,
    };
  }
}
