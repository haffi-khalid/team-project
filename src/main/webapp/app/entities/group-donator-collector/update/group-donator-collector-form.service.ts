import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGroupDonatorCollector, NewGroupDonatorCollector } from '../group-donator-collector.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGroupDonatorCollector for edit and NewGroupDonatorCollectorFormGroupInput for create.
 */
type GroupDonatorCollectorFormGroupInput = IGroupDonatorCollector | PartialWithRequiredKeyOf<NewGroupDonatorCollector>;

type GroupDonatorCollectorFormDefaults = Pick<NewGroupDonatorCollector, 'id'>;

type GroupDonatorCollectorFormGroupContent = {
  id: FormControl<IGroupDonatorCollector['id'] | NewGroupDonatorCollector['id']>;
  donatorName: FormControl<IGroupDonatorCollector['donatorName']>;
  donationAmount: FormControl<IGroupDonatorCollector['donationAmount']>;
  groupDonator: FormControl<IGroupDonatorCollector['groupDonator']>;
};

export type GroupDonatorCollectorFormGroup = FormGroup<GroupDonatorCollectorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GroupDonatorCollectorFormService {
  createGroupDonatorCollectorFormGroup(
    groupDonatorCollector: GroupDonatorCollectorFormGroupInput = { id: null }
  ): GroupDonatorCollectorFormGroup {
    const groupDonatorCollectorRawValue = {
      ...this.getFormDefaults(),
      ...groupDonatorCollector,
    };
    return new FormGroup<GroupDonatorCollectorFormGroupContent>({
      id: new FormControl(
        { value: groupDonatorCollectorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      donatorName: new FormControl(groupDonatorCollectorRawValue.donatorName),
      donationAmount: new FormControl(groupDonatorCollectorRawValue.donationAmount),
      groupDonator: new FormControl(groupDonatorCollectorRawValue.groupDonator),
    });
  }

  getGroupDonatorCollector(form: GroupDonatorCollectorFormGroup): IGroupDonatorCollector | NewGroupDonatorCollector {
    return form.getRawValue() as IGroupDonatorCollector | NewGroupDonatorCollector;
  }

  resetForm(form: GroupDonatorCollectorFormGroup, groupDonatorCollector: GroupDonatorCollectorFormGroupInput): void {
    const groupDonatorCollectorRawValue = { ...this.getFormDefaults(), ...groupDonatorCollector };
    form.reset(
      {
        ...groupDonatorCollectorRawValue,
        id: { value: groupDonatorCollectorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GroupDonatorCollectorFormDefaults {
    return {
      id: null,
    };
  }
}
