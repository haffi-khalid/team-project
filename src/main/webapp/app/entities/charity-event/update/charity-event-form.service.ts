import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ICharityEvent, NewCharityEvent } from '../charity-event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICharityEvent for edit and NewCharityEventFormGroupInput for create.
 */
type CharityEventFormGroupInput = ICharityEvent | PartialWithRequiredKeyOf<NewCharityEvent>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ICharityEvent | NewCharityEvent> = Omit<T, 'eventTimeDate'> & {
  eventTimeDate?: string | null;
};

type CharityEventFormRawValue = FormValueOf<ICharityEvent>;

type NewCharityEventFormRawValue = FormValueOf<NewCharityEvent>;

type CharityEventFormDefaults = Pick<NewCharityEvent, 'id' | 'eventTimeDate'>;

type CharityEventFormGroupContent = {
  id: FormControl<CharityEventFormRawValue['id'] | NewCharityEvent['id']>;
  eventName: FormControl<CharityEventFormRawValue['eventName']>;
  eventTimeDate: FormControl<CharityEventFormRawValue['eventTimeDate']>;
  description: FormControl<CharityEventFormRawValue['description']>;
  images: FormControl<CharityEventFormRawValue['images']>;
  imagesContentType: FormControl<CharityEventFormRawValue['imagesContentType']>;
  duration: FormControl<CharityEventFormRawValue['duration']>;
  location: FormControl<CharityEventFormRawValue['location']>;
  charityType: FormControl<CharityEventFormRawValue['charityType']>;
  charityProfile: FormControl<CharityEventFormRawValue['charityProfile']>;
};

export type CharityEventFormGroup = FormGroup<CharityEventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CharityEventFormService {
  createCharityEventFormGroup(charityEvent: CharityEventFormGroupInput = { id: null }): CharityEventFormGroup {
    const charityEventRawValue = this.convertCharityEventToCharityEventRawValue({
      ...this.getFormDefaults(),
      ...charityEvent,
    });
    return new FormGroup<CharityEventFormGroupContent>({
      id: new FormControl(
        { value: charityEventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      eventName: new FormControl(charityEventRawValue.eventName),
      eventTimeDate: new FormControl(charityEventRawValue.eventTimeDate),
      description: new FormControl(charityEventRawValue.description),
      images: new FormControl(charityEventRawValue.images),
      imagesContentType: new FormControl(charityEventRawValue.imagesContentType),
      duration: new FormControl(charityEventRawValue.duration),
      location: new FormControl(charityEventRawValue.location, {
        validators: [Validators.required],
      }),
      charityType: new FormControl(charityEventRawValue.charityType, {
        validators: [Validators.required],
      }),
      charityProfile: new FormControl(charityEventRawValue.charityProfile),
    });
  }

  getCharityEvent(form: CharityEventFormGroup): ICharityEvent | NewCharityEvent {
    return this.convertCharityEventRawValueToCharityEvent(form.getRawValue() as CharityEventFormRawValue | NewCharityEventFormRawValue);
  }

  resetForm(form: CharityEventFormGroup, charityEvent: CharityEventFormGroupInput): void {
    const charityEventRawValue = this.convertCharityEventToCharityEventRawValue({ ...this.getFormDefaults(), ...charityEvent });
    form.reset(
      {
        ...charityEventRawValue,
        id: { value: charityEventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CharityEventFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      eventTimeDate: currentTime,
    };
  }

  private convertCharityEventRawValueToCharityEvent(
    rawCharityEvent: CharityEventFormRawValue | NewCharityEventFormRawValue
  ): ICharityEvent | NewCharityEvent {
    return {
      ...rawCharityEvent,
      eventTimeDate: dayjs(rawCharityEvent.eventTimeDate, DATE_TIME_FORMAT),
    };
  }

  private convertCharityEventToCharityEventRawValue(
    charityEvent: ICharityEvent | (Partial<NewCharityEvent> & CharityEventFormDefaults)
  ): CharityEventFormRawValue | PartialWithRequiredKeyOf<NewCharityEventFormRawValue> {
    return {
      ...charityEvent,
      eventTimeDate: charityEvent.eventTimeDate ? charityEvent.eventTimeDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
