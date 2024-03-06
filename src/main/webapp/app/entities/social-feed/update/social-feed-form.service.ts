import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISocialFeed, NewSocialFeed } from '../social-feed.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISocialFeed for edit and NewSocialFeedFormGroupInput for create.
 */
type SocialFeedFormGroupInput = ISocialFeed | PartialWithRequiredKeyOf<NewSocialFeed>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends ISocialFeed | NewSocialFeed> = Omit<T, 'lastUpdated'> & {
  lastUpdated?: string | null;
};

type SocialFeedFormRawValue = FormValueOf<ISocialFeed>;

type NewSocialFeedFormRawValue = FormValueOf<NewSocialFeed>;

type SocialFeedFormDefaults = Pick<NewSocialFeed, 'id' | 'lastUpdated'>;

type SocialFeedFormGroupContent = {
  id: FormControl<SocialFeedFormRawValue['id'] | NewSocialFeed['id']>;
  lastUpdated: FormControl<SocialFeedFormRawValue['lastUpdated']>;
};

export type SocialFeedFormGroup = FormGroup<SocialFeedFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SocialFeedFormService {
  createSocialFeedFormGroup(socialFeed: SocialFeedFormGroupInput = { id: null }): SocialFeedFormGroup {
    const socialFeedRawValue = this.convertSocialFeedToSocialFeedRawValue({
      ...this.getFormDefaults(),
      ...socialFeed,
    });
    return new FormGroup<SocialFeedFormGroupContent>({
      id: new FormControl(
        { value: socialFeedRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      lastUpdated: new FormControl(socialFeedRawValue.lastUpdated),
    });
  }

  getSocialFeed(form: SocialFeedFormGroup): ISocialFeed | NewSocialFeed {
    return this.convertSocialFeedRawValueToSocialFeed(form.getRawValue() as SocialFeedFormRawValue | NewSocialFeedFormRawValue);
  }

  resetForm(form: SocialFeedFormGroup, socialFeed: SocialFeedFormGroupInput): void {
    const socialFeedRawValue = this.convertSocialFeedToSocialFeedRawValue({ ...this.getFormDefaults(), ...socialFeed });
    form.reset(
      {
        ...socialFeedRawValue,
        id: { value: socialFeedRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SocialFeedFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      lastUpdated: currentTime,
    };
  }

  private convertSocialFeedRawValueToSocialFeed(
    rawSocialFeed: SocialFeedFormRawValue | NewSocialFeedFormRawValue
  ): ISocialFeed | NewSocialFeed {
    return {
      ...rawSocialFeed,
      lastUpdated: dayjs(rawSocialFeed.lastUpdated, DATE_TIME_FORMAT),
    };
  }

  private convertSocialFeedToSocialFeedRawValue(
    socialFeed: ISocialFeed | (Partial<NewSocialFeed> & SocialFeedFormDefaults)
  ): SocialFeedFormRawValue | PartialWithRequiredKeyOf<NewSocialFeedFormRawValue> {
    return {
      ...socialFeed,
      lastUpdated: socialFeed.lastUpdated ? socialFeed.lastUpdated.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
