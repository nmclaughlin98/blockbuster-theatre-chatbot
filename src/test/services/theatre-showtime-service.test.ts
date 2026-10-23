import type { TheatreMovie } from '../../../lib/interfaces/backend/TheatreMovie';
import { TheatreShowtimeService } from '../../main/lambda/services/theatre-showtime-service';

const movies: readonly TheatreMovie[] = [
  {
    movieId: 101,
    title: 'The Example Movie',
    visible: true,
    isComingSoon: false,
    showtimes: {
      Friday: [
        { screen: '1', time: '08:30' },
        { screen: '2', time: '11:30' },
        { screen: '3', time: '19:30' },
      ],
      Saturday: [
        { screen: '2', time: '13:00' },
        { screen: '3', time: '19:00' },
      ],
    },
  },
  {
    movieId: 202,
    title: 'Another Film',
    visible: true,
    isComingSoon: false,
    showtimes: {
      Friday: [{ screen: '4', time: '19:30' }],
      Saturday: [{ screen: '5', time: '19:00' }],
    },
  },
  {
    movieId: 303,
    title: 'The Example Movie Extended',
    visible: true,
    isComingSoon: false,
    showtimes: {},
  },
  {
    movieId: 404,
    title: 'Hidden Movie',
    visible: false,
    isComingSoon: false,
    showtimes: {
      Friday: [{ screen: '1', time: '12:00' }],
    },
  },
  {
    movieId: 505,
    title: 'Coming Soon Movie',
    visible: true,
    isComingSoon: true,
    showtimes: {
      Friday: [{ screen: '1', time: '12:00' }],
    },
  },
];
const now = new Date('2026-10-23T08:00:00.000Z');

function createService(): TheatreShowtimeService {

  return new TheatreShowtimeService({
    getMovies: async () => movies,
  });
}

describe('TheatreShowtimeService', () => {
  it('returns visible, available showtimes during the next seven days', async () => {
    const showings = await createService().getUpcomingShowings(now);

    expect(showings).toHaveLength(6);
    expect(showings[0]).toMatchObject({
      date: '2026-10-23',
      movieTitle: 'The Example Movie',
      time: '11:30',
    });
    expect(showings.map((showing) => showing.movieTitle)).not.toContain(
      'Hidden Movie'
    );
    expect(showings.map((showing) => showing.movieTitle)).not.toContain(
      'Coming Soon Movie'
    );
  });

  it('matches a date to the backend weekday schedule', async () => {
    const result = await createService().getShowingsByDate('2026-10-24', now);

    expect(result.kind).toBe('showtimes');
    if (result.kind !== 'showtimes') {
      throw new Error('Expected date showtimes.');
    }

    expect(result.showings).toHaveLength(3);
    expect(result.showings.every((showing) => showing.date === '2026-10-24')).toBe(
      true
    );
  });

  it('normalizes a 12-hour time and matches it across the upcoming week', async () => {
    const result = await createService().getShowingsByTime('7 PM', now);

    expect(result.kind).toBe('showtimes');
    if (result.kind !== 'showtimes') {
      throw new Error('Expected time showtimes.');
    }

    expect(result.showings).toHaveLength(2);
    expect(result.showings.every((showing) => showing.time === '19:00')).toBe(
      true
    );
  });

  it('filters showtimes by movie, date, and time', async () => {
    const result = await createService().getShowingsForMovie(
      'The Example Movie',
      { date: '2026-10-24', time: '7 PM' },
      now
    );

    expect(result.kind).toBe('showtimes');
    if (result.kind !== 'showtimes') {
      throw new Error('Expected movie showtimes.');
    }

    expect(result.showings).toHaveLength(1);
    expect(result.showings[0]).toMatchObject({
      movieTitle: 'The Example Movie',
      date: '2026-10-24',
      time: '19:00',
    });
  });

  it('matches movie titles despite case and punctuation differences', async () => {
    const avengersMovie: TheatreMovie = {
      movieId: 606,
      title: 'Avengers: Endgame',
      visible: true,
      isComingSoon: false,
      showtimes: {
        Friday: [{ screen: '1', time: '12:00' }],
      },
    };
    const service = new TheatreShowtimeService({
      getMovies: async () => [avengersMovie],
    });

    for (const query of ['avengers: ENdGame', 'avengers endgame']) {
      const result = await service.getShowingsForMovie(query, now);

      if (result.kind !== 'showtimes') {
        throw new Error(`Expected a movie match for "${query}".`);
      }

      expect(result.movieTitle).toBe('Avengers: Endgame');
    }
  });

  it('ignores diacritic marks when matching movie titles', async () => {
    const pokemonMovie: TheatreMovie = {
      movieId: 707,
      title: 'Pokémon',
      visible: true,
      isComingSoon: false,
      showtimes: {
        Friday: [{ screen: '1', time: '12:00' }],
      },
    };
    const service = new TheatreShowtimeService({
      getMovies: async () => [pokemonMovie],
    });
    const result = await service.getShowingsForMovie('pokemon', now);

    if (result.kind !== 'showtimes') {
      throw new Error('Expected a movie match without diacritic marks.');
    }

    expect(result.movieTitle).toBe('Pokémon');
  });

  it('reports ambiguous partial movie matches instead of choosing arbitrarily', async () => {
    const result = await createService().getShowingsForMovie('The Example', now);

    expect(result).toEqual({
      kind: 'ambiguous-movie',
      matchingTitles: ['The Example Movie', 'The Example Movie Extended'],
    });
  });

  it('rejects malformed dates and times as user-correctable queries', async () => {
    const service = createService();

    await expect(service.getShowingsByDate('2026-02-31', now)).resolves.toEqual({
      kind: 'invalid-date',
    });
    await expect(service.getShowingsByTime('later', now)).resolves.toEqual({
      kind: 'invalid-time',
    });
  });
});
