import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFundraisingIdea, NewFundraisingIdea } from '../fundraising-idea.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFundraisingIdea for edit and NewFundraisingIdeaFormGroupInput for create.
 */
type FundraisingIdeaFormGroupInput = IFundraisingIdea | PartialWithRequiredKeyOf<NewFundraisingIdea>;

type FundraisingIdeaFormDefaults = Pick<NewFundraisingIdea, 'id'>;

type FundraisingIdeaFormGroupContent = {
  id: FormControl<IFundraisingIdea['id'] | NewFundraisingIdea['id']>;
  ideaName: FormControl<IFundraisingIdea['ideaName']>;
  ideaDescription: FormControl<IFundraisingIdea['ideaDescription']>;
  numberOfVolunteers: FormControl<IFundraisingIdea['numberOfVolunteers']>;
  location: FormControl<IFundraisingIdea['location']>;
  expectedCost: FormControl<IFundraisingIdea['expectedCost']>;
  expectedAttendance: FormControl<IFundraisingIdea['expectedAttendance']>;
  charityAdmin: FormControl<IFundraisingIdea['charityAdmin']>;
};

export type FundraisingIdeaFormGroup = FormGroup<FundraisingIdeaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FundraisingIdeaFormService {
  createFundraisingIdeaFormGroup(fundraisingIdea: FundraisingIdeaFormGroupInput = { id: null }): FundraisingIdeaFormGroup {
    const fundraisingIdeaRawValue = {
      ...this.getFormDefaults(),
      ...fundraisingIdea,
    };
    return new FormGroup<FundraisingIdeaFormGroupContent>({
      id: new FormControl(
        { value: fundraisingIdeaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      ideaName: new FormControl(fundraisingIdeaRawValue.ideaName),
      ideaDescription: new FormControl(fundraisingIdeaRawValue.ideaDescription),
      numberOfVolunteers: new FormControl(fundraisingIdeaRawValue.numberOfVolunteers),
      location: new FormControl(fundraisingIdeaRawValue.location),
      expectedCost: new FormControl(fundraisingIdeaRawValue.expectedCost),
      expectedAttendance: new FormControl(fundraisingIdeaRawValue.expectedAttendance),
      charityAdmin: new FormControl(fundraisingIdeaRawValue.charityAdmin),
    });
  }

  getFundraisingIdea(form: FundraisingIdeaFormGroup): IFundraisingIdea | NewFundraisingIdea {
    return form.getRawValue() as IFundraisingIdea | NewFundraisingIdea;
  }

  resetForm(form: FundraisingIdeaFormGroup, fundraisingIdea: FundraisingIdeaFormGroupInput): void {
    const fundraisingIdeaRawValue = { ...this.getFormDefaults(), ...fundraisingIdea };
    form.reset(
      {
        ...fundraisingIdeaRawValue,
        id: { value: fundraisingIdeaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FundraisingIdeaFormDefaults {
    return {
      id: null,
    };
  }
}
