import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IApprovedVolunteers, NewApprovedVolunteers } from '../approved-volunteers.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApprovedVolunteers for edit and NewApprovedVolunteersFormGroupInput for create.
 */
type ApprovedVolunteersFormGroupInput = IApprovedVolunteers | PartialWithRequiredKeyOf<NewApprovedVolunteers>;

type ApprovedVolunteersFormDefaults = Pick<NewApprovedVolunteers, 'id' | 'volunteerStatus'>;

type ApprovedVolunteersFormGroupContent = {
  id: FormControl<IApprovedVolunteers['id'] | NewApprovedVolunteers['id']>;
  volunteerStatus: FormControl<IApprovedVolunteers['volunteerStatus']>;
  volunteerHoursCompletedInCharity: FormControl<IApprovedVolunteers['volunteerHoursCompletedInCharity']>;
  currentEventVolunteeringIn: FormControl<IApprovedVolunteers['currentEventVolunteeringIn']>;
  volunteerApplications: FormControl<IApprovedVolunteers['volunteerApplications']>;
  userPage: FormControl<IApprovedVolunteers['userPage']>;
  charityProfile: FormControl<IApprovedVolunteers['charityProfile']>;
};

export type ApprovedVolunteersFormGroup = FormGroup<ApprovedVolunteersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApprovedVolunteersFormService {
  createApprovedVolunteersFormGroup(approvedVolunteers: ApprovedVolunteersFormGroupInput = { id: null }): ApprovedVolunteersFormGroup {
    const approvedVolunteersRawValue = {
      ...this.getFormDefaults(),
      ...approvedVolunteers,
    };
    return new FormGroup<ApprovedVolunteersFormGroupContent>({
      id: new FormControl(
        { value: approvedVolunteersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      volunteerStatus: new FormControl(approvedVolunteersRawValue.volunteerStatus),
      volunteerHoursCompletedInCharity: new FormControl(approvedVolunteersRawValue.volunteerHoursCompletedInCharity),
      currentEventVolunteeringIn: new FormControl(approvedVolunteersRawValue.currentEventVolunteeringIn),
      volunteerApplications: new FormControl(approvedVolunteersRawValue.volunteerApplications),
      userPage: new FormControl(approvedVolunteersRawValue.userPage),
      charityProfile: new FormControl(approvedVolunteersRawValue.charityProfile),
    });
  }

  getApprovedVolunteers(form: ApprovedVolunteersFormGroup): IApprovedVolunteers | NewApprovedVolunteers {
    return form.getRawValue() as IApprovedVolunteers | NewApprovedVolunteers;
  }

  resetForm(form: ApprovedVolunteersFormGroup, approvedVolunteers: ApprovedVolunteersFormGroupInput): void {
    const approvedVolunteersRawValue = { ...this.getFormDefaults(), ...approvedVolunteers };
    form.reset(
      {
        ...approvedVolunteersRawValue,
        id: { value: approvedVolunteersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ApprovedVolunteersFormDefaults {
    return {
      id: null,
      volunteerStatus: false,
    };
  }
}
