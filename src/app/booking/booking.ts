import { SeatResponse } from './screening/screening';

export interface BookingResponse {
  added_date: Date;
  user_id: number;
  screening_id: number;
  seat_number: number;
  seat_is_handicap: boolean;
  seat_id: number;
  seat_auditorium_id: number;
  auditorium_name: string;
  auditorium_cinema_id: number;
  auditorium_quality_id: number;
  cinema_address: string;
  cinema_city: string;
  cinema_name: string;
  cinema_opening_hours: string;
  cinema_phone: string;
  cinema_postcode: string;
}

export interface Booking {
  userId?: number;
  screeningId?: number;
  totalPrice: number;
  seatsSelected: SeatResponse[];
}
