import type { TheatreMovie } from './TheatreMovie';

export interface TheatreMoviesPage {
  readonly movies: readonly TheatreMovie[];
  readonly nextToken: string | null;
}
