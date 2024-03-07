import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ApprovedVolunteersComponent } from './list/approved-volunteers.component';
import { ApprovedVolunteersDetailComponent } from './detail/approved-volunteers-detail.component';
import { ApprovedVolunteersUpdateComponent } from './update/approved-volunteers-update.component';
import { ApprovedVolunteersDeleteDialogComponent } from './delete/approved-volunteers-delete-dialog.component';
import { ApprovedVolunteersRoutingModule } from './route/approved-volunteers-routing.module';

@NgModule({
  imports: [SharedModule, ApprovedVolunteersRoutingModule],
  declarations: [
    ApprovedVolunteersComponent,
    ApprovedVolunteersDetailComponent,
    ApprovedVolunteersUpdateComponent,
    ApprovedVolunteersDeleteDialogComponent,
  ],
})
export class ApprovedVolunteersModule {}
