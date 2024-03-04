import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GroupDonatorComponent } from './list/group-donator.component';
import { GroupDonatorDetailComponent } from './detail/group-donator-detail.component';
import { GroupDonatorUpdateComponent } from './update/group-donator-update.component';
import { GroupDonatorDeleteDialogComponent } from './delete/group-donator-delete-dialog.component';
import { GroupDonatorRoutingModule } from './route/group-donator-routing.module';

@NgModule({
  imports: [SharedModule, GroupDonatorRoutingModule],
  declarations: [GroupDonatorComponent, GroupDonatorDetailComponent, GroupDonatorUpdateComponent, GroupDonatorDeleteDialogComponent],
})
export class GroupDonatorModule {}
