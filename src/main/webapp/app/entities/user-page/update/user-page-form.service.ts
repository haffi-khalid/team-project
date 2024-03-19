import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserPage, NewUserPage } from '../user-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserPage for edit and NewUserPageFormGroupInput for create.
 */
type UserPageFormGroupInput = IUserPage | PartialWithRequiredKeyOf<NewUserPage>;

type UserPageFormDefaults = Pick<NewUserPage, 'id'>;

type UserPageFormGroupContent = {
  id: FormControl<IUserPage['id'] | NewUserPage['id']>;
  profilePicture: FormControl<IUserPage['profilePicture']>;
  profilePictureContentType: FormControl<IUserPage['profilePictureContentType']>;
  name: FormControl<IUserPage['name']>;
  userBio: FormControl<IUserPage['userBio']>;
  volunteerHours: FormControl<IUserPage['volunteerHours']>;
  reviewComment: FormControl<IUserPage['reviewComment']>;
  course: FormControl<IUserPage['course']>;
  skills: FormControl<IUserPage['skills']>;
  user: FormControl<IUserPage['user']>;
};

export type UserPageFormGroup = FormGroup<UserPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserPageFormService {
  createUserPageFormGroup(userPage: UserPageFormGroupInput = { id: null }): UserPageFormGroup {
    const userPageRawValue = {
      ...this.getFormDefaults(),
      ...userPage,
    };
    return new FormGroup<UserPageFormGroupContent>({
      id: new FormControl(
        { value: userPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      profilePicture: new FormControl(userPageRawValue.profilePicture),
      profilePictureContentType: new FormControl(userPageRawValue.profilePictureContentType),
      name: new FormControl(userPageRawValue.name),
      userBio: new FormControl(userPageRawValue.userBio),
      volunteerHours: new FormControl(userPageRawValue.volunteerHours),
      reviewComment: new FormControl(userPageRawValue.reviewComment),
      course: new FormControl(userPageRawValue.course),
      skills: new FormControl(userPageRawValue.skills),
      user: new FormControl(userPageRawValue.user),
    });
  }

  getUserPage(form: UserPageFormGroup): IUserPage | NewUserPage {
    return form.getRawValue() as IUserPage | NewUserPage;
  }

  resetForm(form: UserPageFormGroup, userPage: UserPageFormGroupInput): void {
    const userPageRawValue = { ...this.getFormDefaults(), ...userPage };
    form.reset(
      {
        ...userPageRawValue,
        id: { value: userPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserPageFormDefaults {
    return {
      id: null,
    };
  }
}
