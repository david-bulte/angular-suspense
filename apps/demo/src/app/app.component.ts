import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SuspenseService } from '@david-bulte/angular-suspense';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private suspenseService: SuspenseService) {
    this.suspenseService.debugLoadingStatesInTemplate = true;
  }
}
