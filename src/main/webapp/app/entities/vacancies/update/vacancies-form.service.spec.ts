import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vacancies.test-samples';

import { VacanciesFormService } from './vacancies-form.service';

describe('Vacancies Form Service', () => {
  let service: VacanciesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VacanciesFormService);
  });

  describe('Service methods', () => {
    describe('createVacanciesFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVacanciesFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vacancyTitle: expect.any(Object),
            vacancyDescription: expect.any(Object),
            vacancyStartDate: expect.any(Object),
            vacancyLogo: expect.any(Object),
            vacancyDuration: expect.any(Object),
            vacancyLocation: expect.any(Object),
            charityAdmin: expect.any(Object),
          })
        );
      });

      it('passing IVacancies should create a new form with FormGroup', () => {
        const formGroup = service.createVacanciesFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            vacancyTitle: expect.any(Object),
            vacancyDescription: expect.any(Object),
            vacancyStartDate: expect.any(Object),
            vacancyLogo: expect.any(Object),
            vacancyDuration: expect.any(Object),
            vacancyLocation: expect.any(Object),
            charityAdmin: expect.any(Object),
          })
        );
      });
    });

    describe('getVacancies', () => {
      it('should return NewVacancies for default Vacancies initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVacanciesFormGroup(sampleWithNewData);

        const vacancies = service.getVacancies(formGroup) as any;

        expect(vacancies).toMatchObject(sampleWithNewData);
      });

      it('should return NewVacancies for empty Vacancies initial value', () => {
        const formGroup = service.createVacanciesFormGroup();

        const vacancies = service.getVacancies(formGroup) as any;

        expect(vacancies).toMatchObject({});
      });

      it('should return IVacancies', () => {
        const formGroup = service.createVacanciesFormGroup(sampleWithRequiredData);

        const vacancies = service.getVacancies(formGroup) as any;

        expect(vacancies).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVacancies should not enable id FormControl', () => {
        const formGroup = service.createVacanciesFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVacancies should disable id FormControl', () => {
        const formGroup = service.createVacanciesFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
