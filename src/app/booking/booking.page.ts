import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonRow,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EMPTY, Observable, switchMap, tap } from 'rxjs';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { SliderPage } from 'src/app/utils/slider/slider.page';
import { AuthService } from '../auth/auth.service';
import { ScreeningResponse, ScreeningsFilmResponse } from '../film/film';
import { FilmService } from '../film/film.service';
import { UtilsService } from '../utils/utils.service';
import { Booking } from './booking';
import { BookingService } from './booking.service';
import { BookingStateService } from './bookingState/booking-state.service';
import { SeatResponse, SeatsScreeningResponse } from './screening/screening';
import { ScreeningPage } from './screening/screening.page';
import { ScreeningService } from './screening/screening.service';
import { SeatPage } from './seat/seat.page';
import { SeatService } from './seat/seat.service';
@Component({
  selector: 'app-screenings',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonContent,
    IonList,
    IonItem,
    IonRow,
    IonCol,
    IonGrid,
    IonThumbnail,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonContent,
    CommonModule,
    FormsModule,
    TranslateModule,
    LayoutComponent,
    SliderPage,
    ScreeningPage,
    SeatPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BookingPage implements OnInit {
  screenings$?: Observable<ScreeningsFilmResponse>;
  filmId?: number;
  booking: Booking;
  screeningSelected?: ScreeningResponse;
  seats$?: Observable<SeatsScreeningResponse>;
  totalPrice: number = 0;
  seatsSelected: SeatResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private filmService: FilmService,
    private seatService: SeatService,
    private bookingService: BookingService,
    private bookingStateService: BookingStateService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private screeningService: ScreeningService
  ) {
    this.translate.setDefaultLang('fr');
    this.booking = {
      userId: this.authService.getCurrentUser()?.id,
      screeningId: this.screeningSelected?.id,
      totalPrice: 0,
      seatsSelected: [],
    };

    const bookingState = localStorage.getItem('bookingState');
    if (bookingState) {
      this.booking = JSON.parse(bookingState) as Booking;
      console.log('this.booking', this.booking.screeningId);

      this.seatsSelected = this.booking.seatsSelected;
      this.totalPrice = this.booking.totalPrice;

      if (this.booking.screeningId) {
        this.screeningService
          .getScreeningById(this.booking.screeningId)
          .pipe(
            tap((screening) => {
              console.log('screening', screening);

              this.onScreeningSelected(screening);
            })
          )
          .subscribe();
      }
    }
  }

  ngOnInit() {
    this.screenings$ = this.route.params.pipe(
      switchMap((params) => {
        this.filmId = +params['id'];
        return this.filmService.getScreeningsByFilmId(this.filmId);
      })
    );
  }

  onScreeningSelected(screening: ScreeningResponse) {
    this.screeningSelected = screening;

    this.seats$ = this.seatService.getSeatsByScreeningId(screening.id).pipe(
      tap((seats: SeatsScreeningResponse) => {
        if (this.booking.screeningId === this.screeningSelected?.id) {
          this.seatsSelected = this.booking.seatsSelected;
          this.totalPrice = this.booking.totalPrice;
        } else {
          this.seatsSelected = [];
          this.totalPrice = 0;
        }
      })
    );
  }

  async onSeatSelected(seat: SeatResponse) {
    if (this.screeningSelected) {
      if (this.isSeatSelected(seat)) {
        this.removeSeatSelected(seat);
        this.totalPrice -= Number(this.screeningSelected.auditorium_price);
        this.booking.totalPrice = this.totalPrice;
      } else if (seat.is_available) {
        this.totalPrice += Number(this.screeningSelected.auditorium_price);
        this.booking.totalPrice = this.totalPrice;
        this.addSeatSelected(seat);
      } else {
        await this.utilsService.presentAlert(
          'Attention',
          'Ce siège est déjà pris.',
          ['OK']
        );
      }
    }
  }

  isSeatSelected(seat: SeatResponse): boolean {
    return this.seatsSelected.some(
      (selectedSeat) => selectedSeat.id === seat.id
    );
  }

  addSeatSelected(seat: SeatResponse) {
    this.seatsSelected.push(seat);

    this.booking.seatsSelected = this.seatsSelected;
    this.booking.screeningId = this.screeningSelected?.id;
    this.bookingStateService.setBookingState(this.booking);
  }

  removeSeatSelected(seat: SeatResponse) {
    this.seatsSelected = this.seatsSelected.filter(
      (selectedSeat) => selectedSeat.id !== seat.id
    );

    this.booking.seatsSelected = this.seatsSelected;
    this.booking.screeningId = this.screeningSelected?.id;
    this.bookingStateService.setBookingState(this.booking);
  }

  onBookingButton() {
    const requiredRoles = ['user'];
    if (!this.authService.hasRole(requiredRoles)) {
      this.utilsService.presentAlert(
        'Attention',
        'Vous devez être connecté pour réserver',
        ['OK']
      );
      return;
    }

    const userId = this.authService.getCurrentUser()?.id;
    const screeningId = this.screeningSelected?.id;
    this.booking = {
      userId: userId,
      screeningId: screeningId,
      totalPrice: this.totalPrice,
      seatsSelected: this.seatsSelected,
    };

    this.bookingStateService.setBookingState(this.booking);
    this.seats$ = this.bookingService
      .createBookingByCurrentUSer(this.booking)
      ?.pipe(
        switchMap(() => {
          if (screeningId) {
            return this.seatService.getSeatsByScreeningId(screeningId);
          } else {
            return EMPTY;
          }
        }),
        tap(() => {
          this.seatsSelected = [];
          this.totalPrice = 0;
          this.booking = {
            userId: userId,
            screeningId: screeningId,
            totalPrice: 0,
            seatsSelected: [],
          };
        })
      );
  }
}
