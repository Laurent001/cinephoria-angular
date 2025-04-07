import { Booking } from '../booking';

export interface QRCodeResponse {
  image: string;
  token: number;
}

export interface QRCodeCheckResponse {
  valid: boolean;
  info?: QRCodeInfo;
  message?: string;
}

export interface QRCodeInfo {
  booking_id: number;
  user_email: string;
  user_first_name: string;
  user_last_name: string;
  booking_added_date: Date;
  booking_total_price: number;
  seat_numbers: string;
  screening_start_time: Date;
  screening_end_time: Date;
  auditorium_name: string;
  quality_name: string;
  cinema_name: string;
}
