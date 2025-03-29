import { Booking } from '../booking/booking';
import { FilmResponse } from '../film/film';
import { User } from '../app';

export interface SpaceResponse {
  openBookings: Booking[];
  closedBookings: Booking[];
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
