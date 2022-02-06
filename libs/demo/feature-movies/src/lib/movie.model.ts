export interface Movie {
  name: string;
  director: Actor;
  genre: string;
  synopsis: string;
  year: number;
  actors?: Actor[];
}

export interface Actor {
  id: number;
  lastName: string;
  firstName: string;
  summary?: string;
}
