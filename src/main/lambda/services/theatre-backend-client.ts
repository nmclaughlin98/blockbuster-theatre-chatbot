import type { ScreenedShowtime } from '../../../../lib/interfaces/backend/ScreenedShowtime';
import type { TheatreMovie, TheatreWeekday } from '../../../../lib/interfaces/backend/TheatreMovie';
import type { TheatreMoviesPage } from '../../../../lib/interfaces/backend/TheatreMoviesPage';

const DEFAULT_API_URL = 'https://api.blockbuster-theatre.nml-applications.com';
const PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 4_000;
const WEEKDAYS: readonly string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const SCREENS: readonly string[] = ['1', '2', '3', '4', '5'];

export class TheatreBackendError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TheatreBackendError';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {

  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isScreenedShowtime(value: unknown): value is ScreenedShowtime {

  return (
    isRecord(value) &&
    typeof value.screen === 'string' &&
    SCREENS.includes(value.screen) &&
    typeof value.time === 'string' &&
    /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value.time)
  );
}

function isShowtimeSchedule(
  value: unknown
): value is TheatreMovie['showtimes'] {
  if (!isRecord(value)) {

    return false;
  }

  return Object.entries(value).every(
    ([weekday, showtimes]) =>
      WEEKDAYS.includes(weekday) &&
      Array.isArray(showtimes) &&
      showtimes.every(isScreenedShowtime)
  );
}

function isTheatreMovie(value: unknown): value is TheatreMovie {

  return (
    isRecord(value) &&
    typeof value.movieId === 'number' &&
    Number.isFinite(value.movieId) &&
    typeof value.title === 'string' &&
    typeof value.visible === 'boolean' &&
    typeof value.isComingSoon === 'boolean' &&
    isShowtimeSchedule(value.showtimes)
  );
}

function isTheatreMoviesPage(value: unknown): value is TheatreMoviesPage {

  return (
    isRecord(value) &&
    Array.isArray(value.movies) &&
    value.movies.every(isTheatreMovie) &&
    (value.nextToken === null ||
      (typeof value.nextToken === 'string' && value.nextToken.length > 0))
  );
}

export class TheatreBackendClient {
  constructor(
    private readonly apiUrl =
      process.env.THEATRE_BACKEND_API_URL ?? DEFAULT_API_URL
  ) {}

  async getMovies(): Promise<readonly TheatreMovie[]> {
    const movies: TheatreMovie[] = [];
    const seenTokens = new Set<string>();
    let nextToken: string | undefined;

    do {
      const page = await this.getMoviesPage(nextToken);
      movies.push(...page.movies);
      nextToken = page.nextToken ?? undefined;

      if (nextToken !== undefined) {
        if (seenTokens.has(nextToken)) {
          throw new TheatreBackendError('The backend returned a repeated page token.');
        }

        seenTokens.add(nextToken);
      }
    } while (nextToken !== undefined);

    return movies;
  }

  private async getMoviesPage(nextToken?: string): Promise<TheatreMoviesPage> {
    let url: URL;

    try {
      url = new URL('/movies', this.apiUrl);
    } catch {
      throw new TheatreBackendError('The backend API URL is invalid.');
    }

    url.searchParams.set('limit', String(PAGE_SIZE));

    if (nextToken !== undefined) {
      url.searchParams.set('nextToken', nextToken);
    }

    let response: Response;

    try {
      response = await fetch(url, {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
    } catch (error: unknown) {
      const detail = error instanceof Error ? ` ${error.message}` : '';
      throw new TheatreBackendError(`The backend request failed.${detail}`);
    }

    if (!response.ok) {
      throw new TheatreBackendError(
        `The backend returned HTTP ${response.status}.`
      );
    }

    let payload: unknown;

    try {
      payload = await response.json();
    } catch {
      throw new TheatreBackendError('The backend returned invalid JSON.');
    }

    if (!isTheatreMoviesPage(payload)) {
      throw new TheatreBackendError('The backend returned an unexpected movie catalogue.');
    }

    return payload;
  }
}
