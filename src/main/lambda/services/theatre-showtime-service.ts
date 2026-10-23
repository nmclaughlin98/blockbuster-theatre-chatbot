import type { TheatreMovie, TheatreWeekday } from '../../../../lib/interfaces/backend/TheatreMovie';
import type { TheatreShowtimeOccurrence } from '../../../../lib/interfaces/backend/TheatreShowtimeOccurrence';
import { TheatreBackendClient } from './theatre-backend-client';

const DAY_NAMES: readonly TheatreWeekday[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const SEARCH_WINDOW_DAYS = 7;

export type DateShowtimeQueryResult =
  | {
      readonly kind: 'invalid-date';
    }
  | {
      readonly kind: 'showtimes';
      readonly showings: readonly TheatreShowtimeOccurrence[];
    };

export type TimeShowtimeQueryResult =
  | {
      readonly kind: 'invalid-time';
    }
  | {
      readonly kind: 'showtimes';
      readonly showings: readonly TheatreShowtimeOccurrence[];
    };

export type MovieShowtimeQueryResult =
  | {
      readonly kind: 'missing-movie';
    }
  | {
      readonly kind: 'movie-not-found';
    }
  | {
      readonly kind: 'ambiguous-movie';
      readonly matchingTitles: readonly string[];
    }
  | {
      readonly kind: 'showtimes';
      readonly movieTitle: string;
      readonly showings: readonly TheatreShowtimeOccurrence[];
    };

export type MovieShowtimeDateQueryResult =
  | MovieShowtimeQueryResult
  | {
      readonly kind: 'invalid-date';
    };

export type MovieShowtimeDateAndTimeQueryResult =
  | MovieShowtimeDateQueryResult
  | {
      readonly kind: 'invalid-time';
    };

interface ShowtimeFilters {
  readonly date?: string;
  readonly time?: string;
}

function getLondonDateParts(now: Date): {
  date: string;
  hour: number;
  minute: number;
} {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    month: '2-digit',
    timeZone: 'Europe/London',
    year: 'numeric',
  }).formatToParts(now);
  const getPart = (type: Intl.DateTimeFormatPartTypes): string | undefined =>
    parts.find((part) => part.type === type)?.value;
  const year = getPart('year');
  const month = getPart('month');
  const day = getPart('day');
  const hour = getPart('hour');
  const minute = getPart('minute');

  if (!year || !month || !day || !hour || !minute) {
    throw new Error('Unable to determine the current London date and time.');
  }

  return {
    date: `${year}-${month}-${day}`,
    hour: Number(hour),
    minute: Number(minute),
  };
}

function parseIsoDate(value: string | undefined): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {

    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {

    return undefined;
  }

  return value;
}

function addDays(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const nextDate = new Date(Date.UTC(year, month - 1, day + days));

  return nextDate.toISOString().slice(0, 10);
}

function getWeekday(date: string): TheatreWeekday {

  return DAY_NAMES[new Date(`${date}T00:00:00.000Z`).getUTCDay()];
}

function getDateLabel(date: string): string {

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
    weekday: 'short',
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function parseTime(value: string | undefined): number | undefined {
  if (!value) {

    return undefined;
  }

  const match = /^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(AM|PM)?$/i.exec(
    value.trim()
  );

  if (!match) {

    return undefined;
  }

  const hour = Number(match[1]);
  const minute = Number(match[2] ?? 0);
  const meridiem = match[3]?.toUpperCase();

  if (minute > 59) {

    return undefined;
  }

  if (meridiem) {
    if (hour < 1 || hour > 12) {

      return undefined;
    }

    return ((hour % 12) + (meridiem === 'PM' ? 12 : 0)) * 60 + minute;
  }

  if (hour > 23) {

    return undefined;
  }

  return hour * 60 + minute;
}

function normalizeTitle(title: string): string {

  return title
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLocaleLowerCase('en-GB')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function findMatchingMovies(
  movies: readonly TheatreMovie[],
  query: string
): readonly TheatreMovie[] {
  const normalizedQuery = normalizeTitle(query);
  const visibleMovies = movies.filter((movie) => movie.visible);
  const exactMatches = visibleMovies.filter(
    (movie) => normalizeTitle(movie.title) === normalizedQuery
  );

  if (exactMatches.length > 0) {

    return exactMatches;
  }

  return visibleMovies.filter((movie) => {
    const normalizedTitle = normalizeTitle(movie.title);

    return (
      normalizedTitle.includes(normalizedQuery) ||
      normalizedQuery.includes(normalizedTitle)
    );
  });
}

function sortShowings(
  first: TheatreShowtimeOccurrence,
  second: TheatreShowtimeOccurrence
): number {

  return (
    first.date.localeCompare(second.date) ||
    first.time.localeCompare(second.time) ||
    first.movieTitle.localeCompare(second.movieTitle)
  );
}

function collectShowings(
  movies: readonly TheatreMovie[],
  dates: readonly string[],
  now: Date,
  timeFilter?: number
): readonly TheatreShowtimeOccurrence[] {
  const londonNow = getLondonDateParts(now);
  const currentMinutes = londonNow.hour * 60 + londonNow.minute;
  const showings: TheatreShowtimeOccurrence[] = [];

  for (const date of dates) {
    if (date < londonNow.date) {
      continue;
    }

    const weekday = getWeekday(date);

    for (const movie of movies) {
      if (!movie.visible || movie.isComingSoon) {
        continue;
      }

      for (const showtime of movie.showtimes[weekday] ?? []) {
        const [hour, minute] = showtime.time.split(':').map(Number);
        const showtimeMinutes = hour * 60 + minute;

        if (date === londonNow.date && showtimeMinutes < currentMinutes) {
          continue;
        }

        if (timeFilter !== undefined && showtimeMinutes !== timeFilter) {
          continue;
        }

        showings.push({
          date,
          dateLabel: getDateLabel(date),
          movieTitle: movie.title,
          screen: showtime.screen,
          time: showtime.time,
        });
      }
    }
  }

  return showings.sort(sortShowings);
}

function getNextSevenDays(now: Date): readonly string[] {
  const today = getLondonDateParts(now).date;

  return Array.from({ length: SEARCH_WINDOW_DAYS }, (_, offset) =>
    addDays(today, offset)
  );
}

export class TheatreShowtimeService {
  constructor(
    private readonly backendClient: Pick<TheatreBackendClient, 'getMovies'>
  ) {}

  async getUpcomingShowings(now: Date = new Date()): Promise<readonly TheatreShowtimeOccurrence[]> {
    const movies = await this.backendClient.getMovies();

    return collectShowings(movies, getNextSevenDays(now), now);
  }

  async getShowingsByDate(
    dateValue: string | undefined,
    now: Date = new Date()
  ): Promise<DateShowtimeQueryResult> {
    const date = parseIsoDate(dateValue);

    if (!date) {

      return { kind: 'invalid-date' };
    }

    const movies = await this.backendClient.getMovies();

    return {
      kind: 'showtimes',
      showings: collectShowings(movies, [date], now),
    };
  }

  async getShowingsByTime(
    timeValue: string | undefined,
    now: Date = new Date()
  ): Promise<TimeShowtimeQueryResult> {
    const time = parseTime(timeValue);

    if (time === undefined) {

      return { kind: 'invalid-time' };
    }

    const movies = await this.backendClient.getMovies();

    return {
      kind: 'showtimes',
      showings: collectShowings(movies, getNextSevenDays(now), now, time),
    };
  }

  async getShowingsForMovie(
    movieQuery: string | undefined,
    now?: Date
  ): Promise<MovieShowtimeQueryResult>;
  async getShowingsForMovie(
    movieQuery: string | undefined,
    filters: { readonly date: string | undefined },
    now?: Date
  ): Promise<MovieShowtimeDateQueryResult>;
  async getShowingsForMovie(
    movieQuery: string | undefined,
    filters: { readonly date: string | undefined; readonly time: string | undefined },
    now?: Date
  ): Promise<MovieShowtimeDateAndTimeQueryResult>;
  async getShowingsForMovie(
    movieQuery: string | undefined,
    filtersOrNow: ShowtimeFilters | Date = {},
    now: Date = new Date()
  ): Promise<MovieShowtimeDateAndTimeQueryResult> {
    const filters = filtersOrNow instanceof Date ? {} : filtersOrNow;
    const currentTime = filtersOrNow instanceof Date ? filtersOrNow : now;
    const query = movieQuery?.trim();

    if (!query) {

      return { kind: 'missing-movie' };
    }

    const hasDateFilter = Object.prototype.hasOwnProperty.call(filters, 'date');
    const date = hasDateFilter ? parseIsoDate(filters.date) : undefined;
    if (hasDateFilter && date === undefined) {

      return { kind: 'invalid-date' };
    }

    const hasTimeFilter = Object.prototype.hasOwnProperty.call(filters, 'time');
    const time = hasTimeFilter ? parseTime(filters.time) : undefined;
    if (hasTimeFilter && time === undefined) {

      return { kind: 'invalid-time' };
    }

    const movies = await this.backendClient.getMovies();
    const matches = findMatchingMovies(movies, query);

    if (matches.length === 0) {

      return { kind: 'movie-not-found' };
    }

    if (matches.length > 1) {

      return {
        kind: 'ambiguous-movie',
        matchingTitles: matches
          .map((movie) => movie.title)
          .sort((first, second) => first.localeCompare(second)),
      };
    }

    const [movie] = matches;
    const dates = date ? [date] : getNextSevenDays(currentTime);

    return {
      kind: 'showtimes',
      movieTitle: movie.title,
      showings: collectShowings([movie], dates, currentTime, time),
    };
  }
}

export const theatreShowtimeService = new TheatreShowtimeService(
  new TheatreBackendClient()
);
