import {
  ItemComponent,
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
    path: 'item-1',
    component: ItemComponent,
    data: {
      debug: 'item-1',
      links: ['item-1.1', 'item-1.2', 'theatre'],
      wait: 200,
      error: false,
      hasChild: false,
      hasLocalLoadingState: false,
      catchError: false,
      stopPropagation: false,
    },
    children: [
      {
        path: 'item-1.1',
        component: ItemComponent,
        data: {
          debug: 'item-1.1',
          links: ['item-1.1.1'],
          wait: 100,
          error: false,
          hasChild: true,
          hasLocalLoadingState: false,
          catchError: false,
          stopPropagation: false,
        },
        children: [
          {
            path: 'item-1.1.1',
            component: ItemComponent,
            data: {
              debug: 'item-1.1.1',
              links: [],
              wait: 1000,
              error: false,
              hasChild: false,
              hasLocalLoadingState: false,
              catchError: false,
              stopPropagation: false,
            },
          },
        ],
      },
      {
        path: 'item-1.2',
        component: ItemComponent,
        data: {
          debug: 'item-1.2',
          links: [],
          wait: 400,
          error: false,
          hasChild: false,
          hasLocalLoadingState: false,
          catchError: false,
          stopPropagation: false,
        },
      },
    ],
  },
  {
    path: '',
    // redirectTo: 'item-1',
    redirectTo: 'movies',
    pathMatch: 'full',
  },
];
// export const routes: Routes = [{
//   path: 'movies',
//   component: MoviesComponent,
//   children: [{
//     path: ':name',
//     component: MovieDetailComponent
//   }]
// }, {
//   path: '',
//   redirectTo: 'movies',
//   pathMatch: 'full'
// }];
