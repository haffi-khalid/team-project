import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGroupDonator } from '../group-donator.model';

@Component({
  selector: 'jhi-group-donator-detail',
  templateUrl: './group-donator-detail.component.html',
})
export class GroupDonatorDetailComponent implements OnInit {
  groupDonator: IGroupDonator | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groupDonator }) => {
      this.groupDonator = groupDonator;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
