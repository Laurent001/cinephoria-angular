import { ScreeningResponse } from 'src/app/film/film';

export interface SeatResponse {
  id: number;
  number: number;
  is_handi: boolean;
  is_available: boolean;
}

export interface SeatsScreeningResponse {
  screening: ScreeningResponse;
  seats: SeatResponse[];
}
