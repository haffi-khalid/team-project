import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IApprovedVolunteers } from '../approved-volunteers.model';
import { ApprovedVolunteersService } from '../service/approved-volunteers.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './approved-volunteers-delete-dialog.component.html',
})
export class ApprovedVolunteersDeleteDialogComponent {
  approvedVolunteers?: IApprovedVolunteers;

  constructor(protected approvedVolunteersService: ApprovedVolunteersService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.approvedVolunteersService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
