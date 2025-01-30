import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonItem,
  IonList,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LayoutComponent } from '../layout/layout.component';
import { CinemaService } from './cinema.service';
import { CinemaResponse, FilmResponse, GenreResponse } from './film';
import { FilmService } from './film.service';
import { GenreService } from './genre.service';

@Component({
  selector: 'app-home',
  templateUrl: 'film.page.html',
  styleUrls: ['film.page.scss'],
  standalone: true,
  imports: [
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
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonButton,
    IonModal,
    RouterLink,
    CommonModule,
    FormsModule,
    TranslateModule,
    LayoutComponent,
    TranslateModule,
  ],
})
export class FilmPage implements OnInit {
  protected filmsFiltered$?: Observable<FilmResponse[]>;
  protected cinemas?: CinemaResponse[];
  protected genres?: GenreResponse[];
  selectedCinema: number | null;
  selectedGenre: number | null;
  selectedDate!: string | null;
  isDatePickerOpen = false;
  minDate: string = new Date().toISOString();

  constructor(
    private filmService: FilmService,
    private cinemaService: CinemaService,
    private genreService: GenreService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('fr');
    this.selectedCinema = null;
    this.selectedGenre = null;
    this.selectedDate = null;
  }

  ngOnInit() {
    this.cinemaService.getCinemas().subscribe((cinemas: CinemaResponse[]) => {
      this.cinemas = cinemas;
    });
    this.genreService.getGenres().subscribe((genres: GenreResponse[]) => {
      this.genres = genres;
    });
    this.filmsFiltered$ = this.filmService.getFilms();
  }

  onCinemaChange(event: any) {
    const selectedCinemaId = event.detail.value;
    if (this.selectedCinema) {
      this.filmsFiltered$ = this.filmService.getFilmsByCinema(selectedCinemaId);
      this.selectedGenre = null;
      this.selectedDate = null;
    }
  }

  onGenreChange(event: any) {
    const selectedGenreId = event.detail.value;
    if (this.selectedGenre) {
      this.filmsFiltered$ = this.filmService.getFilmsByGenre(selectedGenreId);
      this.selectedCinema = null;
      this.selectedDate = null;
    }
  }

  onDateChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.selectedDate = selectedDate.toISOString().split('T')[0];
    if (this.selectedDate) {
      this.filmsFiltered$ = this.filmService.getFilmsByDate(this.selectedDate);
      this.selectedCinema = null;
      this.selectedGenre = null;
      this.closeDatePicker();
    }
  }

  openDatePicker() {
    this.isDatePickerOpen = true;
  }

  closeDatePicker() {
    this.isDatePickerOpen = false;
  }
}
