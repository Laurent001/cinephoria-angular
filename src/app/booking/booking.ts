import { User } from '../app';
import { Screening } from '../screening/screening';
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
  id?: number;
  user?: User;
  totalPrice: number;
  screening?: Screening;
  seats: SeatResponse[];
}
