// idea-popup.component.ts
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { IFundraisingIdea } from '../fundraising-idea.model';
8;

@Component({
  selector: 'app-idea-popup',
  templateUrl: './idea-popup.component.html',
  styleUrls: ['./idea-popup.component.scss'],
})
export class IdeaPopupComponent {
  @Input() idea?: IFundraisingIdea = {
    id: 0,
  };
  @Output() clickOutside = new EventEmitter<void>();

  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const popup = document.querySelector('.popup') as HTMLElement;
    if (!popup.contains(target)) {
      this.clickOutside.emit();
    }
  }

  closePopup(): void {
    this.clickOutside.emit();
  }
}
