import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuspenseModule } from '@david-bulte/angular-suspense';
import { StatsComponent } from './stats/stats.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: StatsComponent,
      },
    ]),
    SuspenseModule,
  ],
  declarations: [StatsComponent],
})
export class DemoFeatureStatsModule {}
