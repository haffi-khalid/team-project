import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICharity, NewCharity } from '../charity.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICharity for edit and NewCharityFormGroupInput for create.
 */
type CharityFormGroupInput = ICharity | PartialWithRequiredKeyOf<NewCharity>;

type CharityFormDefaults = Pick<NewCharity, 'id'>;

type CharityFormGroupContent = {
  id: FormControl<ICharity['id'] | NewCharity['id']>;
  name: FormControl<ICharity['name']>;
};

export type CharityFormGroup = FormGroup<CharityFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CharityFormService {
  createCharityFormGroup(charity: CharityFormGroupInput = { id: null }): CharityFormGroup {
    const charityRawValue = {
      ...this.getFormDefaults(),
      ...charity,
    };
    return new FormGroup<CharityFormGroupContent>({
      id: new FormControl(
        { value: charityRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(charityRawValue.name),
    });
  }

  getCharity(form: CharityFormGroup): ICharity | NewCharity {
    return form.getRawValue() as ICharity | NewCharity;
  }

  resetForm(form: CharityFormGroup, charity: CharityFormGroupInput): void {
    const charityRawValue = { ...this.getFormDefaults(), ...charity };
    form.reset(
      {
        ...charityRawValue,
        id: { value: charityRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CharityFormDefaults {
    return {
      id: null,
    };
  }
}
