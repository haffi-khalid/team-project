import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharityAdmin } from '../charity-admin.model';
import { CharityAdminService } from '../service/charity-admin.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './charity-admin-delete-dialog.component.html',
})
export class CharityAdminDeleteDialogComponent {
  charityAdmin?: ICharityAdmin;

  constructor(protected charityAdminService: CharityAdminService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.charityAdminService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
