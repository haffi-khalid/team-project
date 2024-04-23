import { ReviewCommentsService } from '../service/review-comments.service';
import { IReviewComments, NewReviewComments } from '../review-comments.model';
import { Component, OnInit, HostListener, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styleUrls: ['./review-comments.component.scss'],
})
export class ReviewCommentsComponent implements OnInit {
  @Input() charityProfileId!: any;
  comments: IReviewComments[] = [];
  newComment: string = '';
  newReply: { [key: number]: string } = {};
  showReply: { [key: number]: boolean } = {};
  editCommentId: number | null = null;
  editCommentContent: { [key: number]: string } = {};
  currentFocus: HTMLElement | null = null;
  navigatingActions: boolean = false; // New property to track if the user is navigating the comment actions

  constructor(private reviewCommentsService: ReviewCommentsService, private el: ElementRef) {}

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments(): void {
    this.reviewCommentsService.query().subscribe((allComments: IReviewComments[]) => {
      this.comments = allComments.filter(comment => comment.charityProfile?.id === this.charityProfileId);
      this.comments.forEach(comment => {
        this.showReply[comment.id] = false;
      });
    });
  }
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    let focusableComments: NodeListOf<HTMLElement> = document.querySelectorAll('.comment-entry:not(.reply-entry)');
    let focusableButtons: NodeListOf<HTMLElement>;
    let index: number;

    // ... other logic

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      // Navigating through comments
      index = this.getIndexOfFocusedElement(focusableComments);
      if (index !== -1) {
        if (event.key === 'ArrowDown') {
          index = (index + 1) % focusableComments.length;
        } else if (event.key === 'ArrowUp') {
          index = (index - 1 + focusableComments.length) % focusableComments.length;
        }
        focusableComments[index].focus();
        event.preventDefault();
      }
    } else if (event.key === 'Enter' && document.activeElement?.classList.contains('comment-entry')) {
      this.navigatingActions = !this.navigatingActions; // Toggle action navigation mode
      if (this.navigatingActions) {
        // Focus the first action button of the focused comment
        focusableButtons = document.activeElement.querySelectorAll('button');
        (focusableButtons[0] as HTMLElement).focus();
        event.preventDefault();
      }
    } else if (this.navigatingActions && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      // Navigating through action buttons of a comment
      focusableButtons = (document.activeElement?.closest('.comment-actions') as HTMLElement).querySelectorAll('button');
      this.handleActionNavigation(event, Array.from(focusableButtons)); // Convert NodeList to array
    } else if (this.navigatingActions && event.key === 'Escape') {
      this.navigatingActions = false; // Exit action navigation mode
      // Return focus to the parent comment entry
      (document.activeElement?.closest('.comment-entry') as HTMLElement)?.focus();
    }
  }

  private getIndexOfFocusedElement(elements: NodeListOf<HTMLElement>): number {
    return Array.from(elements).findIndex(element => element === document.activeElement);
  }

  private handleActionNavigation(event: KeyboardEvent, elements: HTMLElement[]): void {
    let index = elements.findIndex(el => el === document.activeElement);
    if (index !== -1) {
      if (event.key === 'ArrowRight') {
        index = (index + 1) % elements.length;
      } else if (event.key === 'ArrowLeft') {
        index = (index - 1 + elements.length) % elements.length;
      }
      elements[index].focus();
      event.preventDefault();
    }
  }
  addComment(): void {
    if (!this.newComment.trim()) return;

    const newComment: NewReviewComments = {
      id: null,
      content: this.newComment,
      parentID: null,
      charityProfile: this.charityProfileId ? { id: this.charityProfileId } : null,
      // Add other required properties, set to their default values
    };

    this.reviewCommentsService.create(newComment).subscribe((comment: IReviewComments) => {
      this.comments.push(comment);
      this.newComment = ''; // Clear the new comment text field
    });
  }

  addReply(parentCommentId: number, replyContent: string): void {
    if (!replyContent.trim()) return;

    const reply: NewReviewComments = {
      id: null,
      content: replyContent,
      parentID: parentCommentId,
      charityProfile: this.charityProfileId ? { id: this.charityProfileId } : null,
      // Add other required properties, set to their default values
    };

    this.reviewCommentsService.create(reply).subscribe((replyComment: IReviewComments) => {
      this.comments.push(replyComment);
      this.newReply[parentCommentId] = ''; // Clear the reply text field
      this.showReply[parentCommentId] = false; // Hide the reply input field
    });
  }

  deleteComment(commentId: number, parentCommentId?: number): void {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.reviewCommentsService.delete(commentId).subscribe(() => {
      if (parentCommentId) {
        // If there's a parentCommentId, we're deleting a reply, not a top-level comment.
        // Assuming you might implement a structure to manage replies differently in the future,
        // or have a need to treat this case differently in the UI.
        // For now, we filter out the reply by its ID, which is the same action as for a top-level comment.
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      } else {
        // Deleting a top-level comment, directly filter it out.
        this.comments = this.comments.filter(comment => comment.id !== commentId);
      }
    });
  }
  toggleReply(commentId: number): void {
    this.showReply[commentId] = !this.showReply[commentId];
    if (this.showReply[commentId]) {
      setTimeout(() => this.focusOnElement(`replyInput${commentId}`), 100);
    }
  }
  toggleEdit(commentId: number): void {
    this.editCommentId = this.editCommentId === commentId ? null : commentId;
    this.editCommentContent[commentId] = this.comments.find(comment => comment.id === commentId)?.content || '';
    if (this.editCommentId) {
      setTimeout(() => this.focusOnElement(`editInput${commentId}`), 100);
    }
  }
  updateComment(commentId: number, parentCommentId?: number): void {
    if (!this.editCommentContent[commentId].trim()) return;

    // Find the comment or reply to be updated
    const index = this.comments.findIndex(comment => comment.id === commentId);

    if (index !== -1) {
      const updatedComment: IReviewComments = {
        ...this.comments[index],
        content: this.editCommentContent[commentId],
      };

      // Assuming update method in the service correctly handles the update
      this.reviewCommentsService.update(updatedComment).subscribe(() => {
        this.comments[index] = updatedComment; // Update the comment in the local array
        this.editCommentId = null; // Exit edit mode
        this.editCommentContent[commentId] = ''; // Clear the edit field

        // If it's a reply, you may need to refresh or update the parent comment's view.
        // This code doesn't include that logic, assuming a flat structure without nested replies in the data model.
      });
    }
  }
  private focusOnElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) element.focus();
  }
  protected readonly parent = parent;
}
