import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVacancies, NewVacancies } from '../vacancies.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVacancies for edit and NewVacanciesFormGroupInput for create.
 */
type VacanciesFormGroupInput = IVacancies | PartialWithRequiredKeyOf<NewVacancies>;

type VacanciesFormDefaults = Pick<NewVacancies, 'id'>;

type VacanciesFormGroupContent = {
  id: FormControl<IVacancies['id'] | NewVacancies['id']>;
  vacancyTitle: FormControl<IVacancies['vacancyTitle']>;
  vacancyDescription: FormControl<IVacancies['vacancyDescription']>;
  vacancyStartDate: FormControl<IVacancies['vacancyStartDate']>;
  vacancyLogo: FormControl<IVacancies['vacancyLogo']>;
  vacancyLogoContentType: FormControl<IVacancies['vacancyLogoContentType']>;
  vacancyDuration: FormControl<IVacancies['vacancyDuration']>;
  vacancyLocation: FormControl<IVacancies['vacancyLocation']>;
  charityProfile: FormControl<IVacancies['charityProfile']>;
};

export type VacanciesFormGroup = FormGroup<VacanciesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VacanciesFormService {
  createVacanciesFormGroup(vacancies: VacanciesFormGroupInput = { id: null }): VacanciesFormGroup {
    const vacanciesRawValue = {
      ...this.getFormDefaults(),
      ...vacancies,
    };
    return new FormGroup<VacanciesFormGroupContent>({
      id: new FormControl(
        { value: vacanciesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      vacancyTitle: new FormControl(vacanciesRawValue.vacancyTitle),
      vacancyDescription: new FormControl(vacanciesRawValue.vacancyDescription),
      vacancyStartDate: new FormControl(vacanciesRawValue.vacancyStartDate),
      vacancyLogo: new FormControl(vacanciesRawValue.vacancyLogo),
      vacancyLogoContentType: new FormControl(vacanciesRawValue.vacancyLogoContentType),
      vacancyDuration: new FormControl(vacanciesRawValue.vacancyDuration),
      vacancyLocation: new FormControl(vacanciesRawValue.vacancyLocation),
      charityProfile: new FormControl(vacanciesRawValue.charityProfile),
    });
  }

  getVacancies(form: VacanciesFormGroup): IVacancies | NewVacancies {
    return form.getRawValue() as IVacancies | NewVacancies;
  }

  resetForm(form: VacanciesFormGroup, vacancies: VacanciesFormGroupInput): void {
    const vacanciesRawValue = { ...this.getFormDefaults(), ...vacancies };
    form.reset(
      {
        ...vacanciesRawValue,
        id: { value: vacanciesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VacanciesFormDefaults {
    return {
      id: null,
    };
  }
}
