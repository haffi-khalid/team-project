import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICharityProfile } from '../charity-profile.model';
import { CharityProfileService } from '../service/charity-profile.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './charity-profile-delete-dialog.component.html',
})
export class CharityProfileDeleteDialogComponent {
  charityProfile?: ICharityProfile;

  constructor(protected charityProfileService: CharityProfileService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.charityProfileService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
