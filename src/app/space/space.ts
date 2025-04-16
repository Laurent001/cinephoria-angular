import { User } from '../app';
import { Booking, BookingWithOccurrence } from '../booking/booking';
import { FilmResponse } from '../film/film';

export interface SpaceResponse {
  openBookings: Booking[];
  closedBookings: BookingWithOccurrence[];
  statuses: StatusResponse[];
}

export interface OpinionResponse {
  id?: number;
  user?: User;
  film?: FilmResponse;
  rating: number;
  description: string;
  added_date?: Date;
  status?: StatusResponse;
}

export interface OpinionsResponse {
  opinions: OpinionResponse[];
  statuses: StatusResponse[];
}

export interface StatusResponse {
  id: number;
  name: string;
}
