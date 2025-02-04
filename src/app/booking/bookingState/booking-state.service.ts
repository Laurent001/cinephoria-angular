import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Booking } from '../booking';

@Injectable({
  providedIn: 'root',
})
export class BookingStateService {
  private bookingState = new BehaviorSubject<any>(null);

  constructor() {
    this.initializeState();
  }

  private initializeState() {
    const savedState = localStorage.getItem('bookingState');

    if (savedState) {
      this.bookingState.next(JSON.parse(savedState));
    }
  }

  setBookingState(state: any) {
    localStorage.setItem('bookingState', JSON.stringify(state));
    this.bookingState.next(state);
  }

  getBookingState(): Observable<Booking> {
    return this.bookingState.asObservable();
  }
}
