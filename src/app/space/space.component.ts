import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth/auth.service';
import { BookingService } from '../booking/booking.service';
import { UtilsService } from '../utils/utils.service';
import { SpaceResponse } from './space';
import { SpaceService } from './space.service';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
})
export class SpaceComponent implements OnInit {
  space: SpaceResponse;
  environment = environment;
  imagesPath = environment.url + '/images/';

  constructor(
    private spaceService: SpaceService,
    private authService: AuthService,
    private bookingService: BookingService,
    private utilsService: UtilsService
  ) {
    this.space = { openBookings: [], closedBookings: [] };
  }

  ngOnInit() {
    this.loadUserSpace().subscribe();
  }

  loadUserSpace(): Observable<any> {
    const userId = this.authService.getCurrentUser()?.id;

    return this.spaceService.getSpaceByUserId(userId).pipe(
      tap((spaceResponse) => {
        this.space.openBookings = spaceResponse.openBookings;
        this.space.closedBookings = spaceResponse.closedBookings;
        console.log('spaceResponse : ', spaceResponse);
      })
    );
  }

  deleteBooking(bookingId: number) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Êtes-vous sûr de vouloir supprimer cet incident ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && bookingId) {
            return this.bookingService.deleteBookingById(bookingId).pipe(
              switchMap((deleted) => {
                if (deleted) {
                  return this.loadUserSpace();
                }
                return of(false);
              }),
              tap(() => {
                this.utilsService.presentAlert(
                  'Suppression réussie ',
                  'Votre réservation a été supprimée',
                  ['OK'],
                  'success'
                );
              })
            );
          }
          return of(false);
        })
      )
      .subscribe();
  }

  scoreFilm(bookingId: number, score: number): void {
    //this.bookingService.scoreBookingById(bookingId, score);
  }

  getSeatNumbers(seats: any[]): string {
    return seats.map((seat) => seat.number).join(', ');
  }
}
