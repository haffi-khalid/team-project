import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISocialFeed } from '../social-feed.model';
import { SocialFeedService } from '../service/social-feed.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './social-feed-delete-dialog.component.html',
})
export class SocialFeedDeleteDialogComponent {
  socialFeed?: ISocialFeed;

  constructor(protected socialFeedService: SocialFeedService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.socialFeedService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
