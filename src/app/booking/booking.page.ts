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
import { SeatResponse, SeatsScreeningResponse } from './screening/screening';
import { ScreeningPage } from './screening/screening.page';
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
  filmId?: number;
  booking$?: Observable<ScreeningsFilmResponse>;
  screeningSelected?: ScreeningResponse;
  seats$?: Observable<SeatsScreeningResponse>;
  totalPrice: number = 0;
  seatsSelected: SeatResponse[] = [];
  seatsAvailable: SeatResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private filmService: FilmService,
    private seatService: SeatService,
    private bookingService: BookingService,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.filmId = +params['id'];
      this.booking$ = this.filmService.getScreeningsByFilmId(this.filmId);
    });
  }

  onScreeningSelected(screening: ScreeningResponse) {
    this.screeningSelected = screening;

    this.seatsSelected = [];
    this.totalPrice = 0;
    this.seats$ = this.seatService.getSeatsByScreeningId(screening.id).pipe(
      tap((seats: SeatsScreeningResponse) => {
        this.seatsAvailable = seats.seats.filter((seat) => seat.is_available);
      })
    );
  }

  async onSeatSelected(seat: SeatResponse) {
    if (this.screeningSelected) {
      if (this.isSeatSelected(seat)) {
        this.removeSeatSelected(seat);
        this.totalPrice -= Number(this.screeningSelected.auditorium_price);
      } else if (this.isSeatAvailable(seat)) {
        this.addSeatSelected(seat);
        this.totalPrice += Number(this.screeningSelected.auditorium_price);
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

  isSeatAvailable(seat: SeatResponse): boolean {
    return (
      !this.isSeatSelected(seat) &&
      this.seatsAvailable.some(
        (seatsAvailable) => seatsAvailable.id === seat.id
      )
    );
  }

  addSeatSelected(seat: SeatResponse) {
    this.seatsSelected.push(seat);
  }

  removeSeatSelected(seat: SeatResponse) {
    this.seatsSelected = this.seatsSelected.filter(
      (selectedSeat) => selectedSeat !== seat
    );
  }

  removeSeatAvailable(seat: SeatResponse) {
    this.seatsAvailable = this.seatsAvailable.filter(
      (seatAvailable) => seatAvailable !== seat
    );
  }

  onBookingButton() {
    const requiredRoles = ['user'];
    if (!this.authService.hasRole(requiredRoles)) {
      this.utilsService.presentAlert('Attention', 'Vous devez être connecté pour réserver',['OK']);
      return;
    }

    //todo: login token etc.
    const userId = this.authService.getCurrentUser()?.id;
    const screeningId = this.screeningSelected?.id;
    const booking: Booking = {
      userId: userId,
      screeningId: screeningId,
      totalPrice: this.totalPrice,
      seatsSelected: this.seatsSelected,
    };

    this.seats$ = this.bookingService.createBookingByCurrentUSer(booking)?.pipe(
      switchMap(() => {
        if (screeningId) {
          return this.seatService.getSeatsByScreeningId(screeningId).pipe(
            tap((seats: SeatsScreeningResponse) => {
              this.seatsAvailable = seats.seats.filter(
                (seat) => seat.is_available
              );
            })
          );
        } else {
          return EMPTY;
        }
      }),
      tap(() => {
        this.seatsSelected = [];
        this.totalPrice = 0;
      })
    );
  }
}
