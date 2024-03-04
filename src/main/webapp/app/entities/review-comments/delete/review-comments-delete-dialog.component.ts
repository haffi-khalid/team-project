import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IReviewComments } from '../review-comments.model';
import { ReviewCommentsService } from '../service/review-comments.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './review-comments-delete-dialog.component.html',
})
export class ReviewCommentsDeleteDialogComponent {
  reviewComments?: IReviewComments;

  constructor(protected reviewCommentsService: ReviewCommentsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.reviewCommentsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
