import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharityHubUser } from '../charity-hub-user.model';
import { CharityHubUserService } from '../service/charity-hub-user.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './charity-hub-user-delete-dialog.component.html',
})
export class CharityHubUserDeleteDialogComponent {
  charityHubUser?: ICharityHubUser;

  constructor(protected charityHubUserService: CharityHubUserService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.charityHubUserService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
