import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter, Observable, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Booking } from '../booking/booking';
import { BookingStateService } from '../booking/bookingState/booking-state.service';
import {
  ScreeningResponse,
  ScreeningsByFilmResponse,
} from '../screening/screening';
import { ScreeningService } from '../screening/screening.service';
import { SliderPage } from '../utils/slider/slider.page';
import { UtilsService } from '../utils/utils.service';
import { CinemaService } from './cinema.service';
import { CinemaResponse, FilmResponse, GenreResponse } from './film';
import { FilmService } from './film.service';
import { GenreService } from './genre.service';

@Component({
  selector: 'app-film',
  templateUrl: 'film.page.html',
  styleUrls: ['film.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    TranslateModule,
    SliderPage,
  ],
})
export class FilmPage implements OnInit {
  screenings!: ScreeningsByFilmResponse;
  protected filmsFiltered$?: Observable<FilmResponse[]>;
  protected cinemas?: CinemaResponse[];
  protected genres?: GenreResponse[];
  filmSelectedId?: number;
  cinemaSelectedId?: number;
  genreSelectedId?: number;
  dateSelected?: string;
  isDatePickerOpen = false;
  minDate: string = new Date().toISOString();
  booking?: Booking;

  constructor(
    private filmService: FilmService,
    private cinemaService: CinemaService,
    private genreService: GenreService,
    private translate: TranslateService,
    private utilsService: UtilsService,
    private router: Router,
    private screeningService: ScreeningService,
    private bookingStateService: BookingStateService,
    private authService: AuthService
  ) {
    this.translate.setDefaultLang('fr');
  }

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
      this.cinemaSelectedId = this.booking?.screening?.auditorium.cinema.id;
      this.filmSelectedId = this.booking.screening?.film_id;

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
    this.cinemaSelectedId = event.detail.value;

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

      this.genreSelectedId = undefined;
      this.dateSelected = undefined;
    }
  }

  onGenreChange(event: any) {
    const selectedGenreId = event.detail.value;
    if (this.genreSelectedId) {
      this.filmsFiltered$ = this.filmService.getFilmsByGenre(selectedGenreId);
      this.cinemaSelectedId = undefined;
      this.dateSelected = undefined;
    }
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.dateSelected = selectedDate.toISOString().split('T')[0];
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

  async seeFullDescription(description: string) {
    await this.utilsService.presentAlert('Pitch', description, ['OK']);
  }

  onScreeningSelected(screening: ScreeningResponse) {
    this.screenings.screeningSelected = screening;
  }

  onBookingButton() {
    if (this.screenings.screeningSelected) {
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
