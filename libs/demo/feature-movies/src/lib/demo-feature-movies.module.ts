import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedSuspenseModule } from '@david-bulte/angular-suspense';
import { ActorComponent } from './actor/actor.component';
import { ItemComponent } from './item/item.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MoviesComponent } from './movies/movies.component';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  imports: [CommonModule, RouterModule, SharedSuspenseModule],
  declarations: [
    MoviesComponent,
    MovieDetailComponent,
    ActorComponent,
    ItemComponent,
    AvatarComponent,
  ],
  exports: [MoviesComponent, MovieDetailComponent, ItemComponent],
})
export class DemoFeatureMoviesModule {}
