import { Booking } from '../booking/booking';

export interface SpaceResponse {
  openBookings: Booking[];
  closedBookings: Booking[];
}
