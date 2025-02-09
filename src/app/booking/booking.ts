import { User } from '../app';
import { ScreeningResponse } from '../screening/screening';
import { SeatResponse } from './seat/seat';

export interface BookingResponse {
  user: User;
  added_date: Date;
  totalPrice: number;
}

export interface BookingValidateResponse {
  message: string;
  booking_id: number;
}

export interface Booking {
  user?: User;
  totalPrice: number;
  screening?: ScreeningResponse;
  seats: SeatResponse[];
}
