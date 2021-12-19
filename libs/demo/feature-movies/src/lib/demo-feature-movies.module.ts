import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedSuspenseModule } from '@david-bulte/angular-suspense';
import { AvatarComponent } from './avatar/avatar.component';
import { ItemComponent } from './item/item.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MoviesComponent } from './movies/movies.component';

@NgModule({
  imports: [CommonModule, RouterModule, SharedSuspenseModule],
  declarations: [
    MoviesComponent,
    MovieDetailComponent,
    ItemComponent,
    AvatarComponent,
    MovieCardComponent,
  ],
  exports: [MoviesComponent, MovieDetailComponent, ItemComponent],
})
export class DemoFeatureMoviesModule {}
