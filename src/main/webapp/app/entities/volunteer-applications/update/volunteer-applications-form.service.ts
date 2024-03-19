import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVolunteerApplications, NewVolunteerApplications } from '../volunteer-applications.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVolunteerApplications for edit and NewVolunteerApplicationsFormGroupInput for create.
 */
type VolunteerApplicationsFormGroupInput = IVolunteerApplications | PartialWithRequiredKeyOf<NewVolunteerApplications>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVolunteerApplications | NewVolunteerApplications> = Omit<T, 'timeStamp'> & {
  timeStamp?: string | null;
};

type VolunteerApplicationsFormRawValue = FormValueOf<IVolunteerApplications>;

type NewVolunteerApplicationsFormRawValue = FormValueOf<NewVolunteerApplications>;

type VolunteerApplicationsFormDefaults = Pick<NewVolunteerApplications, 'id' | 'timeStamp'>;

type VolunteerApplicationsFormGroupContent = {
  id: FormControl<VolunteerApplicationsFormRawValue['id'] | NewVolunteerApplications['id']>;
  timeStamp: FormControl<VolunteerApplicationsFormRawValue['timeStamp']>;
  volunteerStatus: FormControl<VolunteerApplicationsFormRawValue['volunteerStatus']>;
  charityAdmin: FormControl<VolunteerApplicationsFormRawValue['charityAdmin']>;
  charityHubUser: FormControl<VolunteerApplicationsFormRawValue['charityHubUser']>;
  vacancies: FormControl<VolunteerApplicationsFormRawValue['vacancies']>;
};

export type VolunteerApplicationsFormGroup = FormGroup<VolunteerApplicationsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VolunteerApplicationsFormService {
  createVolunteerApplicationsFormGroup(
    volunteerApplications: VolunteerApplicationsFormGroupInput = { id: null }
  ): VolunteerApplicationsFormGroup {
    const volunteerApplicationsRawValue = this.convertVolunteerApplicationsToVolunteerApplicationsRawValue({
      ...this.getFormDefaults(),
      ...volunteerApplications,
    });
    return new FormGroup<VolunteerApplicationsFormGroupContent>({
      id: new FormControl(
        { value: volunteerApplicationsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      timeStamp: new FormControl(volunteerApplicationsRawValue.timeStamp),
      volunteerStatus: new FormControl(volunteerApplicationsRawValue.volunteerStatus),
      charityAdmin: new FormControl(volunteerApplicationsRawValue.charityAdmin),
      charityHubUser: new FormControl(volunteerApplicationsRawValue.charityHubUser),
      vacancies: new FormControl(volunteerApplicationsRawValue.vacancies),
    });
  }

  getVolunteerApplications(form: VolunteerApplicationsFormGroup): IVolunteerApplications | NewVolunteerApplications {
    return this.convertVolunteerApplicationsRawValueToVolunteerApplications(
      form.getRawValue() as VolunteerApplicationsFormRawValue | NewVolunteerApplicationsFormRawValue
    );
  }

  resetForm(form: VolunteerApplicationsFormGroup, volunteerApplications: VolunteerApplicationsFormGroupInput): void {
    const volunteerApplicationsRawValue = this.convertVolunteerApplicationsToVolunteerApplicationsRawValue({
      ...this.getFormDefaults(),
      ...volunteerApplications,
    });
    form.reset(
      {
        ...volunteerApplicationsRawValue,
        id: { value: volunteerApplicationsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VolunteerApplicationsFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timeStamp: currentTime,
    };
  }

  private convertVolunteerApplicationsRawValueToVolunteerApplications(
    rawVolunteerApplications: VolunteerApplicationsFormRawValue | NewVolunteerApplicationsFormRawValue
  ): IVolunteerApplications | NewVolunteerApplications {
    return {
      ...rawVolunteerApplications,
      timeStamp: dayjs(rawVolunteerApplications.timeStamp, DATE_TIME_FORMAT),
    };
  }

  private convertVolunteerApplicationsToVolunteerApplicationsRawValue(
    volunteerApplications: IVolunteerApplications | (Partial<NewVolunteerApplications> & VolunteerApplicationsFormDefaults)
  ): VolunteerApplicationsFormRawValue | PartialWithRequiredKeyOf<NewVolunteerApplicationsFormRawValue> {
    return {
      ...volunteerApplications,
      timeStamp: volunteerApplications.timeStamp ? volunteerApplications.timeStamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
