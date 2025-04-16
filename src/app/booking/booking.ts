import { User } from '../app';
import { Screening } from '../screening/screening';
import { OpinionResponse } from '../space/space';
import { QRCodeResponse } from './qrcode/qrcode';
import { SeatResponse } from './seat/seat';

export interface BookingResponse {
  user: User;
  totalPrice: number;
  qrcode: QRCodeResponse;
  added_date: Date;
}

export interface BookingValidateResponse {
  message: string;
  booking_id: number;
  qrcode: QRCodeResponse;
}

export interface Booking {
  id?: number;
  film_id?: number;
  user?: User;
  totalPrice: number;
  screening?: Screening;
  seats: SeatResponse[];
  opinion?: OpinionResponse;
}

export interface BookingWithOccurrence extends Booking {
  isFirstOccurrence?: boolean;
}
