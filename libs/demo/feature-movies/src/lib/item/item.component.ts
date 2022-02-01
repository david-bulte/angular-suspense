import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingState } from '@david-bulte/angular-suspense';
import { BehaviorSubject, timer } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {
  loadingState$ = new BehaviorSubject(LoadingState.LOADING);
  @Input() data!: Data;

  constructor(private route: ActivatedRoute) {
    this.data = route.snapshot.data as Data;
  }

  ngOnInit(): void {
    timer(this.data.wait).subscribe(() => {
      this.loadingState$.next(
        this.data.error ? LoadingState.ERROR : LoadingState.SUCCESS
      );
    });
  }
}

interface Data {
  debug: string;
  links: string[];
  wait: number;
  error: boolean;
  hasChild: boolean;
  hasLocalLoadingState: boolean;
  catchError: boolean;
  stopPropagation: boolean;
}
