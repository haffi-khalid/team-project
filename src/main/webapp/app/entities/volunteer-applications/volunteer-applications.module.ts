import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VolunteerApplicationsComponent } from './list/volunteer-applications.component';
import { VolunteerApplicationsDetailComponent } from './detail/volunteer-applications-detail.component';
import { VolunteerApplicationsUpdateComponent } from './update/volunteer-applications-update.component';
import { VolunteerApplicationsDeleteDialogComponent } from './delete/volunteer-applications-delete-dialog.component';
import { VolunteerApplicationsRoutingModule } from './route/volunteer-applications-routing.module';

@NgModule({
  imports: [SharedModule, VolunteerApplicationsRoutingModule],
  declarations: [
    VolunteerApplicationsComponent,
    VolunteerApplicationsDetailComponent,
    VolunteerApplicationsUpdateComponent,
    VolunteerApplicationsDeleteDialogComponent,
  ],
})
export class VolunteerApplicationsModule {}
