import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Actor, Movie } from './movie.service';

@Injectable({ providedIn: 'root' })
export class MovieApi {
  listMovies(genre: string | null): Observable<Movie[]> {
    return of(movies).pipe(
      map((movies) =>
        genre ? movies.filter((movie) => movie.genre === genre) : movies
      ),
      delay(1000)
    );
  }

  getMovie(name: string): Observable<Movie> {
    // return throwError(new Error()).pipe(delay(2000));
    const movie = movies.find((movie) => movie.name === name);
    return movie
      ? of({ ...movie, actors: actors[name] || [] }).pipe(delay(2000))
      : EMPTY;
  }

  getActor(id: number) {
    console.log('id', id);
    const _actors: Actor[] = [];
    Object.values(actors).forEach((__actors) => {
      __actors.forEach((actor) => {
        _actors.push(actor);
      });
    });
    console.log('actors', _actors);
    const actor = _actors.find((actor) => actor.id === id);
    return actor ? of(actor).pipe(delay(2000)) : EMPTY;
  }

  listGenres() {
    return of([
      'fantasy',
      'horror',
      'crime',
      'drama',
      'science fiction',
      'comedy',
      'action',
    ]);
  }

  // listActors(movie) {}
  //
  // getActor(id) {
  //   const actor = actors.find((actor) => actor.name === name);
  //   return of(actor);
  // }
}

const actors: { [key: string]: Actor[] } = {
  'Lord of the Rings': [
    { id: 0, lastName: 'Elija', givenName: 'Wood' },
    { id: 1, lastName: 'Ian', givenName: 'McKellan' },
  ],
  "Rosemary's Baby": [
    { id: 2, lastName: 'Mia', givenName: 'Farrow' },
    { id: 3, lastName: 'John', givenName: 'Cassavetes' },
  ],
  'The Godfather': [
    { id: 4, lastName: 'Marlon', givenName: 'Brandy' },
    { id: 5, lastName: 'Al', givenName: 'Pacino' },
  ],
  'The Piano': [
    { id: 6, lastName: 'Holly', givenName: 'Hunter' },
    { id: 7, lastName: 'Sam', givenName: 'Neil' },
    { id: 8, lastName: 'Harvey', givenName: 'Keitel' },
  ],
};

const movies: Movie[] = [
  {
    name: 'Lord of the Rings',
    director: 'Peter Jackson',
    genre: 'fantasy',
    synopsis:
      'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    year: 2001,
  },
  {
    name: 'The Godfather',
    director: 'Coppola',
    genre: 'crime',
    synopsis:
      'The Godfather follows Vito Corleone, Don of the Corleone family, as he passes the mantel to his unwilling son, Michael.',
    year: 1972,
  },
  {
    name: "Rosemary's Baby",
    director: 'Polanski',
    genre: 'horror',
    synopsis:
      'A young couple trying for a baby move into an aging, ornate apartment building on Central Park West, but find themselves surrounded by peculiar neighbors.',
    year: 1968,
  },
  {
    name: 'The Piano',
    director: 'Campion',
    genre: 'drama',
    synopsis:
      'In the mid-19th century, a mute woman is sent to New Zealand along with her young daughter and prized piano for an arranged marriage to a wealthy landowner, but is soon lusted after by a local worker on the plantation.',
    year: 1993,
  },
];

// const actors: Actor[] = [
//   {
//     id: 1,
//     name: 'Marlon',
//     given: 'Marlon',
//   },
// ];
