import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { SuspenseComponent } from '@david-bulte/angular-suspense';
import { BehaviorSubject, filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  show$$ = new BehaviorSubject(-1);
  @ViewChild(SuspenseComponent, { static: true })
  suspenseComponent!: SuspenseComponent;
  continue!: () => void;

  ngOnInit(): void {
    this.continue = this.suspenseComponent.wait();
    setTimeout(() => {
      this.show$$.next(1);
      this.continue();
    }, 1000);

    this.show$$.pipe(filter((show) => show !== -1)).subscribe(this.continue);
  }
}
