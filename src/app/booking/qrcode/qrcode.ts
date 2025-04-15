import { Booking } from '../booking';

export interface QRCodeResponse {
  image: string;
  token: number;
}

export interface QRCodeCheckResponse {
  valid: boolean;
  info?: BookingInfo;
  message?: string;
}

export interface BookingInfo {
  booking_id: string;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  booking_added_date: string;
  booking_total_price: number;
  seat_numbers: string;
  screening_start_time: string;
  screening_end_time: string;
  auditorium_name: string;
  quality_name: string;
  cinema_name: string;
  film_title: string;
  createdAt: string;
  exp: number;
}

export interface BookingInfoWithStatus extends BookingInfo {
  valid: boolean;
  reason?: string;
}
