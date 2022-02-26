import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SuspenseModule } from '@david-bulte/angular-suspense';
import { AvatarComponent } from './avatar/avatar.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MoviesComponent } from './movies/movies.component';

@NgModule({
  imports: [CommonModule, RouterModule, SuspenseModule],
  declarations: [
    MoviesComponent,
    MovieDetailComponent,
    AvatarComponent,
    MovieCardComponent,
  ],
  exports: [MoviesComponent, MovieDetailComponent],
})
export class DemoFeatureMoviesModule {}
