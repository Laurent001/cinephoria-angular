import { Screening } from 'src/app/screening/screening';

export interface SeatResponse {
  id: number;
  number: number;
  is_handi: boolean;
  is_available: boolean;
}

export interface SeatsScreeningResponse {
  screening: Screening;
  seats: SeatResponse[];
}
