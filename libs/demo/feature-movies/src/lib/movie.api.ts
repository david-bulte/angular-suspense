import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
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
    const movie = movies.find((movie) => movie.name === name);

    if (movie?.name === 'The Piano') {
      return of({ ...movie, actors: actors[name] || [] }).pipe(delay(2000));
    } else if (!movie) {
      return throwError('not found');
    } else {
      return of({ ...movie, actors: actors[name] || [] }).pipe(delay(1500));
    }
  }

  getActor(id: number) {
    const _actors: Actor[] = [];
    Object.values(actors).forEach((__actors) => {
      __actors.forEach((actor) => {
        _actors.push(actor);
      });
    });
    const actor = _actors.find((actor) => actor.id === id);
    return actor ? of(actor).pipe(delay(1000)) : EMPTY;
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
    {
      id: 0,
      firstName: 'Elija',
      lastName: 'Wood',
      summary:
        "Elijah Wood is an American actor best known for portraying Frodo Baggins in Peter Jackson's blockbuster Lord of the Rings film trilogy. In addition to reprising the role in The Hobbit series, Wood also played Ryan in the FX television comedy Wilfred (2011) and voiced Beck in the Disney XD animated television series TRON: Uprising (2012).\n" +
        '\n' +
        "Born Elijah Jordan Wood on 28 January, 1981, in Cedar Rapids, Iowa, Wood is the son of Debbie (Krause) and Warren Wood, who ran a delicatessen. He has an older brother, Zach, and a younger sister, Hannah Wood. He is of English, German, Austrian, and Danish descent. Demonstrating a gift for performing at a young age, Wood's natural talent inspired his mother to take him to an International Modeling and Talent Association annual convention in Los Angeles. Soon after, he began to get bookings for small parts on television.\n" +
        '\n' +
        "Although his first credit was a small part in Back to the Future Part II (1989), Wood's first major film role was in the 'Barry Levinson' historical family drama Avalon (1990). Following that, Wood became an in-demand child actor, appearing in a number of major films such as Paradise (1991), Radio Flyer (1992) and The Good Son (1993), in which he co-starred with Macaulay Culkin. This was followed by the first role for which he received top-billing, North (1994). Although the film was widely condemned and a disaster at the box office, Elijah was praised as the only good thing to come out of it.\n" +
        '\n' +
        "In 1996 Elijah starred in a movie remake of an old TV show, Flipper (1996). Many critics wondered if his ability as a child actor to capture an audience was wearing thin, as had many child actors', but Wood deftly transitioned into a versatile performer with roles such as the endlessly curious Mikey Carver in Ang Lee' ensemble film The Ice Storm (1997), as well as parts in popcorn flicks like Deep Impact (1998) and The Faculty (1998). In 1999, Elijah was in three movies that never made it into wide release: The Bumblebee Flies Anyway (1999) (released on satellite TV), Black & White (1999) (released on home video) and Chain of Fools (2000).\n" +
        '\n' +
        "Wood's work in Peter Jackson's film adaptations of J.R.R. Tolkien's The Lord of the Rings: The Fellowship of the Ring (2001), The Lord of the Rings: The Two Towers (2002), and The Lord of the Rings: The Return of the King (2003), provided a major boost to his career. The actor followed his work in the astronomically successful trilogy with a broad range of interesting screen roles and voice work, including a supporting role in Michel Gondry's Eternal Sunshine of the Spotless Mind (2004), as well as the part of a sinister mute sociopath in Sin City (2005). His voice work has been featured in such animated films as Happy Feet (2006) and 9 (2009), as well as on television series including American Dad! (2005) and Robot Chicken (2005). Wood also played Ad-Rock in the Beastie Boys' comedic video for Beastie Boys: Fight for Your Right Revisited (2011).\n" +
        '\n' +
        'An avid music fan, Wood founded Simian records and released its first album, New Magnetic Wonder by The Apples in Stereo, in 2007.',
    },
    {
      id: 1,
      firstName: 'Ian',
      lastName: 'McKellan',
      summary:
        "Widely regarded as one of greatest stage and screen actors both in his native Great Britain and internationally, twice nominated for the Oscar and recipient of every major theatrical award in the UK and US, Ian Murray McKellen was born on May 25, 1939 in Burnley, Lancashire, England, to Margery Lois (Sutcliffe) and Denis Murray McKellen, a civil engineer and lay preacher. He is of Scottish, Northern Irish, and English descent. During his early childhood, his parents moved with Ian and his older sister, Jean, to the mill town of Wigan. It was in this small town that young Ian rode out World War II. He soon developed a fascination with acting and the theatre, which was encouraged by his parents. They would take him to plays, those by William Shakespeare, in particular. The amateur school productions fostered Ian's growing passion for theatre.\n" +
        '\n' +
        'When Ian was of age to begin attending school, he made sure to get roles in all of the productions. At Bolton School in particular, he developed his skills early on. Indeed, his first role in a Shakespearian play was at Bolton, as Malvolio in "Twelfth Night". Ian soon began attending Stratford-upon-Avon theatre festivals, where he saw the greats perform: Laurence Olivier, Wendy Hiller, John Gielgud, Ralph Richardson and Paul Robeson. He continued his education in English Drama, but soon it fell by the wayside as he concentrated more and more on performing. He eventually obtained his Bachelor of Arts in 1961, and began his career in earnest.\n' +
        '\n' +
        'McKellen began working in theatre over the next few years. Very few people knew of Ian\'s homosexuality; he saw no reason to go public, nor had he told his family. They did not seem interested in the subject and so he saw no reason to bring it up. In 1988, Ian publicly came out of the closet on the BBC Radio 4 program, while discussing Margaret Thatcher\'s "Section 28" legislation, which made the promotion of homosexuality as a family relationship by local authorities an offense. It was reason enough for McKellen to take a stand. He has been active in the gay rights movement ever since.\n' +
        '\n' +
        "Ian resides in Limehouse, where he has also lived with his former long-time partner Sean Mathias. The two men have also worked together on the film Bent (1997) as well as in exquisite stage productions. To this day, McKellen works mostly in theatre, and was knighted by Queen Elizabeth II in 1990 for his efforts in the arts. However, he has managed to make several quite successful forays into film. He has appeared in several productions of Shakespeare's works including his well received Richard III (1995), and in a variety of other movies. However, it has only been recently that his star has finally begun to shine in the eyes of North American audiences. Roles in various films, Cold Comfort Farm (1995), Apt Pupil (1998) and Gods and Monsters (1998), riveted audiences. The latter, in particular, created a sensation in Hollywood, and McKellen's role garnered him several of awards and nominations, including a Golden Globe and an Oscar nod. McKellen, as he continues to work extensively on stage, he always keeps in 'solidifying' his 'role' as Laurence Olivier's worthy 'successor' in the best sense too, such as King Lear (2008) / Great Performances: King Lear (2008) directed by Trevor Nunn and in a range of other staggering performances full of generously euphoric delight that have included \"Peter Pan\" and Noël Coward's \"Present Laughter\", as well as Samuel Beckett's \"Waiting for Godot\" and Harold Pinter's \"No Man's Land\" (National Theatre Live: No Man's Land (2016)), both in acclaimed productions brilliantly directed by Sean Mathias.\n" +
        '\n' +
        'McKellen found mainstream success with his performance as Magneto in X-Men (2000) and its sequels. His largest mark on the big screen may be as Gandalf in "The Lord of the Rings" film trilogy directed by Peter Jackson, which he reprised in "The Hobbit" trilogy. He also reprised the role of \'King Lear\' with new artistic perspectives in National Theatre Live: King Lear (2018) offering an invaluable mesmerizing experience as a natural force of stage - and screen - of infinite generosity through his unsurpassable interpretation of the titanically vulnerable king.',
    },
  ],
  "Rosemary's Baby": [
    { id: 2, firstName: 'Mia', lastName: 'Farrow' },
    { id: 3, firstName: 'John', lastName: 'Cassavetes' },
  ],
  'The Godfather': [
    { id: 4, firstName: 'Marlon', lastName: 'Brandy' },
    { id: 5, firstName: 'Al', lastName: 'Pacino' },
  ],
  'The Piano': [
    { id: 6, firstName: 'Holly', lastName: 'Hunter' },
    { id: 7, firstName: 'Sam', lastName: 'Neil' },
    { id: 8, firstName: 'Harvey', lastName: 'Keitel' },
  ],
};

const movies: Movie[] = [
  {
    name: 'Lord of the Rings',
    director: { id: 0, firstName: 'Peter', lastName: 'Jackson' },
    genre: 'fantasy',
    synopsis:
      'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    year: 2001,
  },
  {
    name: 'The Godfather',
    director: { id: 1, firstName: 'Francis', lastName: 'Coppola' },
    genre: 'crime',
    synopsis:
      'The Godfather follows Vito Corleone, Don of the Corleone family, as he passes the mantel to his unwilling son, Michael.',
    year: 1972,
  },
  {
    name: "Rosemary's Baby",
    director: { id: 2, firstName: 'Roman', lastName: 'Polanski' },
    genre: 'horror',
    synopsis:
      'A young couple trying for a baby move into an aging, ornate apartment building on Central Park West, but find themselves surrounded by peculiar neighbors.',
    year: 1968,
  },
  {
    name: 'The Piano',
    director: { id: 2, firstName: 'Jane', lastName: 'Campion' },
    genre: 'drama',
    synopsis:
      'In the mid-19th century, a mute woman is sent to New Zealand along with her young daughter and prized piano for an arranged marriage to a wealthy landowner, but is soon lusted after by a local worker on the plantation.',
    year: 1993,
  },
];
