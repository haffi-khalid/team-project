import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GroupDonatorCollectorComponent } from './list/group-donator-collector.component';
import { GroupDonatorCollectorDetailComponent } from './detail/group-donator-collector-detail.component';
import { GroupDonatorCollectorUpdateComponent } from './update/group-donator-collector-update.component';
import { GroupDonatorCollectorDeleteDialogComponent } from './delete/group-donator-collector-delete-dialog.component';
import { GroupDonatorCollectorRoutingModule } from './route/group-donator-collector-routing.module';

@NgModule({
  imports: [SharedModule, GroupDonatorCollectorRoutingModule],
  declarations: [
    GroupDonatorCollectorComponent,
    GroupDonatorCollectorDetailComponent,
    GroupDonatorCollectorUpdateComponent,
    GroupDonatorCollectorDeleteDialogComponent,
  ],
})
export class GroupDonatorCollectorModule {}
