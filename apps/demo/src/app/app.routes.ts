import {
  MovieDetailComponent,
  MoviesComponent,
} from '@angular-suspense/demo-feature-movies';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'movies',
    component: MoviesComponent,
    children: [
      {
        path: ':name',
        component: MovieDetailComponent,
      },
      {
        path: '',
        component: MovieDetailComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
];
