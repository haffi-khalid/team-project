import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGroupDonator, NewGroupDonator } from '../group-donator.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGroupDonator for edit and NewGroupDonatorFormGroupInput for create.
 */
type GroupDonatorFormGroupInput = IGroupDonator | PartialWithRequiredKeyOf<NewGroupDonator>;

type GroupDonatorFormDefaults = Pick<NewGroupDonator, 'id'>;

type GroupDonatorFormGroupContent = {
  id: FormControl<IGroupDonator['id'] | NewGroupDonator['id']>;
  groupname: FormControl<IGroupDonator['groupname']>;
  totalCollectedAmount: FormControl<IGroupDonator['totalCollectedAmount']>;
  donatorPage: FormControl<IGroupDonator['donatorPage']>;
  charityEvent: FormControl<IGroupDonator['charityEvent']>;
};

export type GroupDonatorFormGroup = FormGroup<GroupDonatorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GroupDonatorFormService {
  createGroupDonatorFormGroup(groupDonator: GroupDonatorFormGroupInput = { id: null }): GroupDonatorFormGroup {
    const groupDonatorRawValue = {
      ...this.getFormDefaults(),
      ...groupDonator,
    };
    return new FormGroup<GroupDonatorFormGroupContent>({
      id: new FormControl(
        { value: groupDonatorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      groupname: new FormControl(groupDonatorRawValue.groupname),
      totalCollectedAmount: new FormControl(groupDonatorRawValue.totalCollectedAmount),
      donatorPage: new FormControl(groupDonatorRawValue.donatorPage),
      charityEvent: new FormControl(groupDonatorRawValue.charityEvent),
    });
  }

  getGroupDonator(form: GroupDonatorFormGroup): IGroupDonator | NewGroupDonator {
    return form.getRawValue() as IGroupDonator | NewGroupDonator;
  }

  resetForm(form: GroupDonatorFormGroup, groupDonator: GroupDonatorFormGroupInput): void {
    const groupDonatorRawValue = { ...this.getFormDefaults(), ...groupDonator };
    form.reset(
      {
        ...groupDonatorRawValue,
        id: { value: groupDonatorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GroupDonatorFormDefaults {
    return {
      id: null,
    };
  }
}
