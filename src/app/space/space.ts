import { Booking } from '../booking/booking';
import { FilmResponse } from '../film/film';
import { UsersResponse } from '../home/home';

export interface SpaceResponse {
  openBookings: Booking[];
  closedBookings: Booking[];
}

export interface OpinionResponse {
  id?: number;
  user?: UsersResponse;
  film?: FilmResponse;
  rating: number;
  description: string;
  added_date?: Date;
  status?: string;
}
