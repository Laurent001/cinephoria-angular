import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth/auth.service';
import { UtilsService } from '../utils/utils.service';
import { Booking, BookingResponse } from './booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  getBookingsByUserId(id: number): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(
      `${environment.url}/api/booking/user/${id}`
    );
  }

  createBookingByCurrentUSer(
    booking: Booking
  ): Observable<Booking> | undefined {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser || !currentUser.id) {
      this.utilsService.presentAlert(
        'Attention','Vous devez être connecté pour effectuer une réservation',['OK']
      );
      return;
    }

    return this.http.post<Booking>(
      `${environment.url}/api/booking/user/${currentUser.id}`,
      booking
    );
  }
}
