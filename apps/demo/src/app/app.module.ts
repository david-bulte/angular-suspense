import { DemoFeatureMoviesModule } from '@angular-suspense/demo-feature-movies';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { SuspenseModule } from '@david-bulte/angular-suspense';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { LoadingStatesComponent } from './loading-states.component';

@NgModule({
  declarations: [AppComponent, LoadingStatesComponent],
  imports: [
    DemoFeatureMoviesModule,
    RouterModule.forRoot(routes),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    SuspenseModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
