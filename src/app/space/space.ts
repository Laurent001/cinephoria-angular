import { Booking } from '../booking/booking';
import { FilmResponse } from '../film/film';
import { UserResponse } from '../home/home';

export interface SpaceResponse {
  openBookings: Booking[];
  closedBookings: Booking[];
  statuses: StatusResponse[];
}

export interface OpinionResponse {
  id?: number;
  user?: UserResponse;
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
