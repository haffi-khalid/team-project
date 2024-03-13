import { Component, OnInit } from '@angular/core';
import { ReviewCommentsService } from '../service/review-comments.service';
import { IReviewComments, NewReviewComments } from '../review-comments.model';

@Component({
  selector: 'app-review-comments',
  templateUrl: './review-comments.component.html',
  styleUrls: ['./review-comments.component.scss'],
})
export class ReviewCommentsComponent implements OnInit {
  comments: IReviewComments[] = [];
  newComment: string = ''; // Use this for the new comment's text
  newReply: { [key: number]: string } = {}; // To store the replies' texts, keyed by comment ID
  showReply: { [key: number]: boolean } = {}; // To manage the visibility of reply inputs
  editCommentId: number | null = null;
  editCommentContent: { [key: number]: string } = {};

  constructor(private reviewCommentsService: ReviewCommentsService) {}

  ngOnInit(): void {
    this.fetchComments();
  }

  fetchComments(): void {
    this.reviewCommentsService.query().subscribe((comments: IReviewComments[]) => {
      this.comments = comments;
      // Initialize the showReply states
      comments.forEach(comment => {
        this.showReply[comment.id] = false;
      });
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) return;

    const newComment: NewReviewComments = {
      id: null,
      content: this.newComment,
      parentID: null,
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
  }
  toggleEdit(commentId: number): void {
    this.editCommentId = this.editCommentId === commentId ? null : commentId;
    this.editCommentContent[commentId] = this.comments.find(comment => comment.id === commentId)?.content || '';
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

  protected readonly parent = parent;
}
