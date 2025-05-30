import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BarRatingModule } from 'ngx-bar-rating';
import { filter, Observable, take, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { Booking } from '../booking/booking';
import { BookingStateService } from '../booking/bookingState/booking-state.service';
import { CinemaResponse } from '../cinema/cinema';
import { CinemaService } from '../cinema/cinema.service';
import { Screening, ScreeningsByFilmResponse } from '../screening/screening';
import { ScreeningService } from '../screening/screening.service';
import { SliderComponent } from '../shared/utils/slider/slider.component';
import { FilmResponse, GenreResponse } from './film';
import { FilmService } from './film.service';
import { GenreService } from './genre.service';
import { SafePipe } from '../shared/pipes/safe.pipe';

@Component({
  selector: 'app-film',
  templateUrl: 'film.component.html',
  styleUrls: ['film.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SliderComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatInputModule,
    DatePipe,
    BarRatingModule,
    SafePipe,
  ],
})
export class FilmComponent implements OnInit {
  environment = environment;
  imagesPath = environment.url + '/images/';
  screenings?: ScreeningsByFilmResponse;
  protected filmsFiltered$?: Observable<FilmResponse[]>;
  protected cinemas?: CinemaResponse[];
  protected genres?: GenreResponse[];
  private datePipe = new DatePipe('fr-FR');
  filmSelectedId?: number;
  cinemaSelectedId?: number;
  genreSelectedId?: number;
  dateSelected: string | null = null;
  isDatePickerOpen = false;
  minDate: string = new Date().toISOString();
  booking?: Booking;

  constructor(
    private filmService: FilmService,
    private cinemaService: CinemaService,
    private genreService: GenreService,
    private router: Router,
    private screeningService: ScreeningService,
    private bookingStateService: BookingStateService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.screeningService.screenings$.subscribe((screenings) => {
      if (screenings) this.screenings = screenings;
    });

    this.cinemaService.getCinemas().subscribe((cinemas: CinemaResponse[]) => {
      this.cinemas = cinemas;
    });

    this.genreService.getGenres().subscribe((genres: GenreResponse[]) => {
      this.genres = genres;
    });

    const bookingState = localStorage.getItem('bookingState');
    if (bookingState) {
      this.booking = JSON.parse(bookingState) as Booking;
      this.cinemaSelectedId = this.booking?.screening?.auditorium?.cinema?.id;
      this.filmSelectedId = this.booking.screening?.film?.id;

      if (this.cinemaSelectedId) {
        this.filmsFiltered$ = this.filmService.getFilmsByCinema(
          this.cinemaSelectedId
        );
      }

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
    } else {
      this.filmsFiltered$ = this.filmService.getFilms();
    }
  }

  onCinemaChange(event: any) {
    this.screenings = undefined;
    this.cinemaSelectedId = event.value;
    this.cinemaService.updateCinemaById(this.cinemaSelectedId);

    if (this.cinemaSelectedId) {
      this.filmsFiltered$ = this.filmService.getFilmsByCinema(
        this.cinemaSelectedId
      );

      this.genreSelectedId = undefined;
      this.dateSelected = null;
    }
  }

  onGenreChange(event: any) {
    console.log('event', event);

    const selectedGenreId = event.value;
    if (this.genreSelectedId) {
      this.filmsFiltered$ = this.filmService.getFilmsByGenre(selectedGenreId);
      this.cinemaSelectedId = undefined;
      this.dateSelected = null;
    }
  }

  onDateChange(dateSelected: any) {
    this.dateSelected = this.datePipe.transform(dateSelected, 'yyyy-MM-dd');

    if (this.dateSelected) {
      this.filmsFiltered$ = this.filmService.getFilmsByDate(this.dateSelected);
      this.cinemaSelectedId = undefined;
      this.genreSelectedId = undefined;
      this.closeDatePicker();
    }
  }

  onScreeningsButton(filmId: number) {
    if (this.screenings) {
      this.screenings.screeningSelected = undefined;
      this.screeningService.setScreenings(this.screenings);
    }

    if (this.cinemaSelectedId) {
      this.screeningService
        .getFilmScreeningsByCinema(filmId, this.cinemaSelectedId)
        .pipe(
          tap((screenings) => {
            this.screeningService.setScreenings(screenings);
            this.filmSelectedId = filmId;
          })
        )
        .subscribe();
    } else {
      this.screeningService
        .getScreeningsByFilmId(filmId)
        .pipe(
          tap((screenings) => {
            this.screeningService.setScreenings(screenings);
            this.filmSelectedId = filmId;
          })
        )
        .subscribe();
    }
  }

  openDatePicker() {
    this.isDatePickerOpen = true;
  }

  closeDatePicker() {
    this.isDatePickerOpen = false;
  }

  onScreeningSelected(screening: Screening) {
    if (this.screenings) this.screenings.screeningSelected = screening;
  }

  onBookingButton() {
    if (this.screenings && this.screenings.screeningSelected) {
      const booking: Booking = {
        user: this.authService.getCurrentUser(),
        totalPrice: 0,
        screening: this.screenings.screeningSelected,
        seats: [],
      };
      this.bookingStateService.setBookingState(booking);
      this.screeningService.setScreenings(this.screenings);
      this.screeningService.screenings$
        .pipe(
          take(1),
          filter((screenings) => screenings !== null)
        )
        .subscribe(() => {
          this.router.navigate(['/booking']);
        });
    }
  }
}
