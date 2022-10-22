import { DemoFeatureMoviesModule } from '@angular-suspense/demo-feature-movies';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { SuspenseModule } from '@david-bulte/angular-suspense';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { BarComponent } from './bar.component';
import { FooComponent } from './foo.component';
import { LoadingStatesComponent } from './loading-states.component';

@NgModule({
  declarations: [
    AppComponent,
    LoadingStatesComponent,
    FooComponent,
    BarComponent,
  ],
  imports: [
    DemoFeatureMoviesModule,
    RouterModule.forRoot(routes),
    SuspenseModule.forRoot({ debugLoadingStatesInTemplate: true }),
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
