import { TheatreBackendClient, TheatreBackendError } from '../../main/lambda/services/theatre-backend-client';
import type { TheatreMovie } from '../../../lib/interfaces/backend/TheatreMovie';

const createMovie = (movieId: number, title: string): TheatreMovie => ({
  movieId,
  title,
  visible: true,
  isComingSoon: false,
  showtimes: {
    Monday: [{ screen: '1', time: '11:30' }],
  },
});

const responseFor = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), {
    headers: { 'Content-Type': 'application/json' },
    status,
  });

describe('TheatreBackendClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('retrieves all pages from the public movie catalogue', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch');
    fetchMock
      .mockResolvedValueOnce(
        responseFor({
          movies: [createMovie(1, 'First Movie')],
          nextToken: 'next-page',
        })
      )
      .mockResolvedValueOnce(
        responseFor({
          movies: [createMovie(2, 'Second Movie')],
          nextToken: null,
        })
      );
    const client = new TheatreBackendClient('https://backend.example.test');

    const movies = await client.getMovies();

    expect(movies.map((movie) => movie.title)).toEqual([
      'First Movie',
      'Second Movie',
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(new URL(String(fetchMock.mock.calls[0]?.[0])).searchParams.get('limit')).toBe('100');
    expect(new URL(String(fetchMock.mock.calls[1]?.[0])).searchParams.get('nextToken')).toBe(
      'next-page'
    );
  });

  it('surfaces HTTP errors from the backend', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(responseFor({}, 503));
    const client = new TheatreBackendClient('https://backend.example.test');

    await expect(client.getMovies()).rejects.toBeInstanceOf(TheatreBackendError);
  });

  it('rejects invalid catalogue responses', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      responseFor({ movies: [{ title: 'Incomplete Movie' }], nextToken: null })
    );
    const client = new TheatreBackendClient('https://backend.example.test');

    await expect(client.getMovies()).rejects.toThrow(
      'The backend returned an unexpected movie catalogue.'
    );
  });

  it('rejects a repeated pagination token instead of looping forever', async () => {
    jest.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        responseFor({ movies: [], nextToken: 'repeat' })
      )
      .mockResolvedValueOnce(
        responseFor({ movies: [], nextToken: 'repeat' })
      );
    const client = new TheatreBackendClient('https://backend.example.test');

    await expect(client.getMovies()).rejects.toThrow(
      'The backend returned a repeated page token.'
    );
  });
});
