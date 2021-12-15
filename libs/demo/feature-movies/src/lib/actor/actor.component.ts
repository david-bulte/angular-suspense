import { Component, Input } from '@angular/core';
import { Actor } from '../movie.service';

@Component({
  selector: 'demo-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css'],
})
export class ActorComponent {
  @Input() actor!: Actor;
  // loadingState$ = new BehaviorSubject(LoadingState.LOADING);

  constructor() {
    // setTimeout(() => {
    //   console.log('xxxxx');
    //   this.loadingState$.next(LoadingState.SUCCESS);
    // }, 3000);
  }
}
