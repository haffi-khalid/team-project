import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AuthenticationComponent } from './list/authentication.component';
import { AuthenticationDetailComponent } from './detail/authentication-detail.component';
import { AuthenticationUpdateComponent } from './update/authentication-update.component';
import { AuthenticationDeleteDialogComponent } from './delete/authentication-delete-dialog.component';
import { AuthenticationRoutingModule } from './route/authentication-routing.module';

@NgModule({
  imports: [SharedModule, AuthenticationRoutingModule],
  declarations: [
    AuthenticationComponent,
    AuthenticationDetailComponent,
    AuthenticationUpdateComponent,
    AuthenticationDeleteDialogComponent,
  ],
})
export class AuthenticationModule {}
