import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth/auth.service';
import { UtilsService } from '../utils/utils.service';
import { Booking, BookingResponse, BookingValidateResponse } from './booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private bookingSubject = new BehaviorSubject<BookingResponse | null>(null);
  bookings$ = this.bookingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  setBooking(booking: BookingResponse) {
    this.bookingSubject.next(booking);
  }

  getBookings() {
    return this.bookingSubject.value;
  }

  getBookingsByUserId(id: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(
      `${environment.url}/api/booking/user/${id}`
    );
  }

  createBooking(booking: Booking): Observable<BookingValidateResponse | null> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      this.utilsService.presentAlert(
        'Attention',
        'Vous devez être connecté pour effectuer une réservation',
        ['OK'],
        'warn'
      );
      return of(null);
    }

    return this.http.post<BookingValidateResponse>(
      `${environment.url}/api/booking/create`,
      booking
    );
  }

  deleteBookingById(id: number): Observable<Boolean> {
    return this.http.delete<Boolean>(`${environment.url}/api/booking/${id}`);
  }
}
