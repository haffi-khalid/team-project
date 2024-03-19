import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICharityAdmin, NewCharityAdmin } from '../charity-admin.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICharityAdmin for edit and NewCharityAdminFormGroupInput for create.
 */
type CharityAdminFormGroupInput = ICharityAdmin | PartialWithRequiredKeyOf<NewCharityAdmin>;

type CharityAdminFormDefaults = Pick<NewCharityAdmin, 'id' | 'isCharityAdmin'>;

type CharityAdminFormGroupContent = {
  id: FormControl<ICharityAdmin['id'] | NewCharityAdmin['id']>;
  isCharityAdmin: FormControl<ICharityAdmin['isCharityAdmin']>;
};

export type CharityAdminFormGroup = FormGroup<CharityAdminFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CharityAdminFormService {
  createCharityAdminFormGroup(charityAdmin: CharityAdminFormGroupInput = { id: null }): CharityAdminFormGroup {
    const charityAdminRawValue = {
      ...this.getFormDefaults(),
      ...charityAdmin,
    };
    return new FormGroup<CharityAdminFormGroupContent>({
      id: new FormControl(
        { value: charityAdminRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      isCharityAdmin: new FormControl(charityAdminRawValue.isCharityAdmin),
    });
  }

  getCharityAdmin(form: CharityAdminFormGroup): ICharityAdmin | NewCharityAdmin {
    return form.getRawValue() as ICharityAdmin | NewCharityAdmin;
  }

  resetForm(form: CharityAdminFormGroup, charityAdmin: CharityAdminFormGroupInput): void {
    const charityAdminRawValue = { ...this.getFormDefaults(), ...charityAdmin };
    form.reset(
      {
        ...charityAdminRawValue,
        id: { value: charityAdminRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CharityAdminFormDefaults {
    return {
      id: null,
      isCharityAdmin: false,
    };
  }
}
