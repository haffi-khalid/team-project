import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGroupDonator } from '../group-donator.model';
import { GroupDonatorService } from '../service/group-donator.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './group-donator-delete-dialog.component.html',
})
export class GroupDonatorDeleteDialogComponent {
  groupDonator?: IGroupDonator;

  constructor(protected groupDonatorService: GroupDonatorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.groupDonatorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
