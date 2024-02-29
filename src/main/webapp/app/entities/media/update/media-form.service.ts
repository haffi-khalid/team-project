import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMedia, NewMedia } from '../media.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMedia for edit and NewMediaFormGroupInput for create.
 */
type MediaFormGroupInput = IMedia | PartialWithRequiredKeyOf<NewMedia>;

type MediaFormDefaults = Pick<NewMedia, 'id'>;

type MediaFormGroupContent = {
  id: FormControl<IMedia['id'] | NewMedia['id']>;
  type: FormControl<IMedia['type']>;
  url: FormControl<IMedia['url']>;
  post: FormControl<IMedia['post']>;
};

export type MediaFormGroup = FormGroup<MediaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MediaFormService {
  createMediaFormGroup(media: MediaFormGroupInput = { id: null }): MediaFormGroup {
    const mediaRawValue = {
      ...this.getFormDefaults(),
      ...media,
    };
    return new FormGroup<MediaFormGroupContent>({
      id: new FormControl(
        { value: mediaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      type: new FormControl(mediaRawValue.type),
      url: new FormControl(mediaRawValue.url),
      post: new FormControl(mediaRawValue.post),
    });
  }

  getMedia(form: MediaFormGroup): IMedia | NewMedia {
    return form.getRawValue() as IMedia | NewMedia;
  }

  resetForm(form: MediaFormGroup, media: MediaFormGroupInput): void {
    const mediaRawValue = { ...this.getFormDefaults(), ...media };
    form.reset(
      {
        ...mediaRawValue,
        id: { value: mediaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MediaFormDefaults {
    return {
      id: null,
    };
  }
}
