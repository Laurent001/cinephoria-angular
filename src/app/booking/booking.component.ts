import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { CinemaService } from '../film/cinema.service';
import { CinemaResponse, FilmResponse } from '../film/film';
import { FilmService } from '../film/film.service';
import { Screening, ScreeningsByFilmResponse } from '../screening/screening';
import { ScreeningService } from '../screening/screening.service';
import { SliderComponent } from '../utils/slider/slider.component';
import { UtilsService } from '../utils/utils.service';
import { Booking } from './booking';
import { BookingService } from './booking.service';
import { BookingStateService } from './bookingState/booking-state.service';
import { SeatResponse, SeatsScreeningResponse } from './seat/seat';
import { SeatComponent } from './seat/seat.component';
import { SeatService } from './seat/seat.service';
@Component({
  selector: 'app-booking',
  templateUrl: 'booking.component.html',
  styleUrls: ['booking.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TranslateModule,
    SliderComponent,
    SeatComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
  ],
})
export class BookingComponent implements OnInit {
  screenings$?: Observable<ScreeningsByFilmResponse>;
  screenings?: ScreeningsByFilmResponse;
  filmsFiltered$?: Observable<FilmResponse[]>;
  seats$?: Observable<SeatsScreeningResponse>;
  booking?: Booking;
  cinemas?: CinemaResponse[];
  screeningId?: number;
  filmSelectedId?: number;
  cinemaSelectedId?: number;
  showSeatsScreening: boolean = false;
  isDatePickerOpen = false;
  totalPrice: number = 0;
  seatsSelected: SeatResponse[] = [];
  screeningSelected?: Screening;

  constructor(
    private filmService: FilmService,
    private authService: AuthService,
    private cinemaService: CinemaService,
    private translate: TranslateService,
    private utilsService: UtilsService,
    private screeningService: ScreeningService,
    private bookingStateService: BookingStateService,
    private seatService: SeatService,
    private bookingService: BookingService
  ) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.cinemaService.getCinemas().subscribe((cinemas: CinemaResponse[]) => {
      this.cinemas = cinemas;
    });

    this.loadBookingStateFromLocalStorage();

    this.screeningService.screenings$
      .pipe(
        tap((screenings) => {
          if (screenings) {
            this.screenings = screenings;
            this.loadBookingStateFromLocalStorage();
          }
        }),
        switchMap((screenings) => {
          if (screenings && this.filmSelectedId) {
            return this.screeningService
              .getFilmScreeningsByCinema(
                this.filmSelectedId,
                this.cinemaSelectedId
              )
              .pipe(
                tap((screenings) => {
                  this.screenings = screenings;
                })
              );
          } else {
            return of(null);
          }
        })
      )
      .subscribe();
  }

  private loadBookingStateFromLocalStorage() {
    const bookingState = localStorage.getItem('bookingState');
    if (bookingState) {
      this.booking = JSON.parse(bookingState) as Booking;
      this.seatsSelected = this.booking.seats;
      this.totalPrice = this.booking.totalPrice;
      this.cinemaSelectedId = this.booking?.screening?.auditorium?.cinema.id;
      this.filmSelectedId = this.booking.screening?.film.id;
      this.screeningSelected = this.booking.screening;

      if (this.cinemaSelectedId) {
        this.filmsFiltered$ = this.filmService.getFilmsByCinema(
          this.cinemaSelectedId
        );
      }

      if (this.filmSelectedId && this.cinemaSelectedId) {
        this.screeningService
          .getFilmScreeningsByCinema(this.filmSelectedId, this.cinemaSelectedId)
          .pipe(
            tap((screenings) => {
              this.screenings = screenings;
            })
          )
          .subscribe();
      }

      if (this.screeningSelected?.id)
        this.seats$ = this.seatService.getSeatsByScreeningId(
          this.screeningSelected.id
        );
    }
  }

  onCinemaChange(event: any) {
    this.screenings = undefined;
    this.cinemaSelectedId = event.value;

    if (this.cinemaSelectedId) {
      this.filmsFiltered$ = this.filmService.getFilmsByCinema(
        this.cinemaSelectedId
      );

      if (this.filmSelectedId) {
        this.screeningService
          .getFilmScreeningsByCinema(this.filmSelectedId, this.cinemaSelectedId)
          .pipe(
            tap((screenings) => {
              this.screeningService.setScreenings(screenings);
            })
          )
          .subscribe();
      }
    }
  }

  getFilmScreeningsByCinema(filmId: number, cinemaId?: number) {
    if (!cinemaId) {
      this.utilsService.presentAlert(
        'Attention',
        'veuillez sélectionner un cinéma',
        ['OK'],
        'warn'
      );
      return;
    }

    if (this.screeningSelected && this.screeningSelected.film.id != filmId)
      this.screeningSelected = undefined;

    this.showSeatsScreening = false;
    this.screeningService
      .getFilmScreeningsByCinema(filmId, cinemaId)
      .pipe(
        tap((screenings) => {
          this.screenings = screenings;
          this.filmSelectedId = filmId;
        })
      )
      .subscribe();
  }

  openDatePicker() {
    this.isDatePickerOpen = true;
  }

  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  seeSeatsAvailable() {
    this.showSeatsScreening = true;
  }

  onScreeningSelected(screening: Screening) {
    this.seatsSelected = [];
    this.totalPrice = 0;
    if (this.screenings) {
      //this.screenings.screeningSelected = screening;
      this.screeningSelected = screening;

      this.seats$ = this.seatService.getSeatsByScreeningId(
        this.screeningSelected.id
      );
    }
    if (this.booking) {
      this.booking.seats = [];
      this.booking.screening = screening;
      this.bookingStateService.setBookingState(this.booking);
    }
  }

  async onSeatSelected(seat: SeatResponse) {
    if (this.screeningSelected) {
      if (this.isSeatSelected(seat)) {
        this.removeSeatSelected(seat);
        this.totalPrice -= Number(this.screeningSelected.auditorium.price);
        if (this.booking) this.booking.totalPrice = this.totalPrice;
      } else if (seat.is_available) {
        this.totalPrice += Number(this.screeningSelected.auditorium.price);
        if (this.booking) this.booking.totalPrice = this.totalPrice;
        this.addSeatSelected(seat);
      } else {
        await this.utilsService.presentAlert(
          'Attention',
          'Ce siège est déjà pris.',
          ['OK'],
          'warn'
        );
      }

      this.updateCurrentBooking();
    }
  }

  isSeatSelected(seat: SeatResponse): boolean {
    return this.seatsSelected.some(
      (selectedSeat) => selectedSeat.id === seat.id
    );
  }

  addSeatSelected(seat: SeatResponse) {
    this.seatsSelected = [...this.seatsSelected, seat];

    if (this.booking) {
      this.booking.seats = this.seatsSelected;
      this.booking.screening = this.screeningSelected;
    }
  }

  removeSeatSelected(seat: SeatResponse) {
    this.seatsSelected = this.seatsSelected.filter(
      (selectedSeat) => selectedSeat.id !== seat.id
    );

    if (this.booking) {
      this.booking.seats = this.seatsSelected;
      this.booking.screening = this.screeningSelected;
    }
  }

  updateCurrentBooking() {
    const booking: Booking = {
      user: this.authService.getCurrentUser(),
      totalPrice: this.totalPrice,
      screening: this.screeningSelected,
      seats: this.seatsSelected,
    };
    this.booking = booking;
    this.bookingStateService.setBookingState(booking);
  }

  initBooking() {
    this.totalPrice = 0;
    this.seatsSelected = [];

    const booking: Booking = {
      user: this.authService.getCurrentUser(),
      totalPrice: 0,
      screening: this.screeningSelected,
      seats: [],
    };
    this.bookingStateService.setBookingState(booking);
    return booking;
  }

  validateBooking() {
    if (this.booking?.seats && this.booking?.seats?.length > 0) {
      this.bookingService
        .createBooking(this.booking)
        ?.pipe(
          tap((response) => {
            if (response)
              this.utilsService.presentAlert(
                'Information',
                response.message,
                ['OK'],
                'success'
              );
          })
        )
        .subscribe((response) => {
          if (this.screeningSelected) {
            this.seats$ = this.seatService.getSeatsByScreeningId(
              this.screeningSelected.id
            );
          }

          this.initBooking();
        });
    } else {
      this.utilsService.presentAlert(
        'Non réservé',
        'Votre booking ne contient pas de place',
        ['Cancel'],
        'warn'
      );
    }
  }

  createRows(seats: SeatResponse[]): SeatResponse[][] {
    const rows: SeatResponse[][] = [];
    for (let i = 0; i < seats.length; i += 10) {
      rows.push(seats.slice(i, i + 10));
    }
    return rows;
  }
}
