import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGroupDonatorCollector } from '../group-donator-collector.model';

@Component({
  selector: 'jhi-group-donator-collector-detail',
  templateUrl: './group-donator-collector-detail.component.html',
})
export class GroupDonatorCollectorDetailComponent implements OnInit {
  groupDonatorCollector: IGroupDonatorCollector | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groupDonatorCollector }) => {
      this.groupDonatorCollector = groupDonatorCollector;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
