import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICharityHubUser, NewCharityHubUser } from '../charity-hub-user.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICharityHubUser for edit and NewCharityHubUserFormGroupInput for create.
 */
type CharityHubUserFormGroupInput = ICharityHubUser | PartialWithRequiredKeyOf<NewCharityHubUser>;

type CharityHubUserFormDefaults = Pick<NewCharityHubUser, 'id'>;

type CharityHubUserFormGroupContent = {
  id: FormControl<ICharityHubUser['id'] | NewCharityHubUser['id']>;
  username: FormControl<ICharityHubUser['username']>;
  email: FormControl<ICharityHubUser['email']>;
};

export type CharityHubUserFormGroup = FormGroup<CharityHubUserFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CharityHubUserFormService {
  createCharityHubUserFormGroup(charityHubUser: CharityHubUserFormGroupInput = { id: null }): CharityHubUserFormGroup {
    const charityHubUserRawValue = {
      ...this.getFormDefaults(),
      ...charityHubUser,
    };
    return new FormGroup<CharityHubUserFormGroupContent>({
      id: new FormControl(
        { value: charityHubUserRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(charityHubUserRawValue.username),
      email: new FormControl(charityHubUserRawValue.email),
    });
  }

  getCharityHubUser(form: CharityHubUserFormGroup): ICharityHubUser | NewCharityHubUser {
    return form.getRawValue() as ICharityHubUser | NewCharityHubUser;
  }

  resetForm(form: CharityHubUserFormGroup, charityHubUser: CharityHubUserFormGroupInput): void {
    const charityHubUserRawValue = { ...this.getFormDefaults(), ...charityHubUser };
    form.reset(
      {
        ...charityHubUserRawValue,
        id: { value: charityHubUserRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CharityHubUserFormDefaults {
    return {
      id: null,
    };
  }
}
