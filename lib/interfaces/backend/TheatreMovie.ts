import type { ScreenedShowtime } from './ScreenedShowtime';

export type TheatreWeekday =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface TheatreMovie {
  readonly movieId: number;
  readonly title: string;
  readonly visible: boolean;
  readonly isComingSoon: boolean;
  readonly showtimes: Readonly<
    Partial<Record<TheatreWeekday, readonly ScreenedShowtime[]>>
  >;
}
