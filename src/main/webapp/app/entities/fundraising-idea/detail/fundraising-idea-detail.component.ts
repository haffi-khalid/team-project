import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFundraisingIdea } from '../fundraising-idea.model';

@Component({
  selector: 'jhi-fundraising-idea-detail',
  templateUrl: './fundraising-idea-detail.component.html',
})
export class FundraisingIdeaDetailComponent implements OnInit {
  fundraisingIdea: IFundraisingIdea | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ fundraisingIdea }) => {
      this.fundraisingIdea = fundraisingIdea;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
