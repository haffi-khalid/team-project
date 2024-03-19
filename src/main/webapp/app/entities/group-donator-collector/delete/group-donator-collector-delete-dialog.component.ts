import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGroupDonatorCollector } from '../group-donator-collector.model';
import { GroupDonatorCollectorService } from '../service/group-donator-collector.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './group-donator-collector-delete-dialog.component.html',
})
export class GroupDonatorCollectorDeleteDialogComponent {
  groupDonatorCollector?: IGroupDonatorCollector;

  constructor(protected groupDonatorCollectorService: GroupDonatorCollectorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.groupDonatorCollectorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
