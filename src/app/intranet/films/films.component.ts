import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs';
import { FilmResponse } from 'src/app/film/film';
import { FilmService } from 'src/app/film/film.service';
import { Fields } from 'src/app/shared/utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from 'src/app/shared/utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from 'src/app/shared/utils/utils.service';

@Component({
  selector: 'app-films',
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, GenericCrudTableComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class FilmsComponent implements OnInit {
  films!: FilmResponse[];
  fields: Fields[] = [];
  columnsToDisplay = [
    { name: 'id', type: 'number' },
    { name: 'title', type: 'string' },
    { name: 'description', type: 'string' },
    { name: 'release_date', type: 'datetime' },
    { name: 'age_minimum', type: 'number' },
    { name: 'favorite', type: 'boolean' },
    { name: 'poster', file: 'poster_file', type: 'image' },
  ];
  columnLabels: Record<string, string> = {
    id: '#',
    title: 'Titre',
    description: 'Description',
    release_date: 'Date de sortie',
    age_minimum: 'Age min.',
    favorite: 'Favori',
    poster: 'Poster',
  };

  constructor(
    private filmService: FilmService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getFilms();
  }

  getFilms() {
    this.filmService
      .getFilms()
      .pipe(
        tap((films) => {
          this.films = films;
          this.fields = this.getFields();
        })
      )
      .subscribe();
  }

  getFields(): Fields[] {
    return [
      { name: 'id', label: 'id', type: 'masked' },
      { name: 'title', label: 'Titre', type: 'text', required: true },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'release_date',
        label: 'Date de sortie',
        type: 'datetime',
        required: true,
      },
      {
        name: 'age_minimum',
        label: 'Age minimum',
        type: 'text',
        required: true,
      },
      {
        name: 'favorite',
        label: 'Coup de coeur',
        type: 'toggle',
        required: true,
      },
      {
        name: 'poster',
        file: 'poster_file',
        label: 'Affiche',
        type: 'image',
        required: true,
      },
    ];
  }

  getEmptyFilm(): FilmResponse {
    return {
      id: undefined,
      title: '',
      description: '',
      release_date: new Date(),
      age_minimum: undefined,
      favorite: 0,
      poster: '',
      poster_file: undefined,
    };
  }

  onAddFilm(film: FilmResponse) {
    const filmModified = this.getFilmResponseModified(
      this.getEmptyFilm(),
      film
    );

    this.filmService
      .addFilm(filmModified)
      .pipe(
        tap((films) => {
          this.films = films;

          this.utilsService.presentAlert(
            'Création réussie ',
            'le film a été ajoutée',
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onUpdateFilm(film: FilmResponse) {
    const filmModified = this.getFilmResponseModified(
      this.getEmptyFilm(),
      film
    );

    this.filmService
      .updateFilm(filmModified)
      .pipe(
        tap((films) => {
          this.films = films;

          this.utilsService.presentAlert(
            'Mise à jour réussie ',
            'le film a été mis à jour',
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onDeleteFilm(film: FilmResponse) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Cela va supprimer toutes les sièges et réservations associés à ce film. Êtes-vous sûr de vouloir supprimer ce film ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && film.id) {
            return this.filmService.deleteFilmById(film.id).pipe(
              tap((films) => {
                this.films = films;

                this.utilsService.presentAlert(
                  'Suppression réussie ',
                  'le film a été supprimé',
                  ['OK'],
                  'success'
                );
              })
            );
          }
          return [];
        })
      )
      .subscribe();
  }

  getFilmResponseModified(film: FilmResponse, data: any): FilmResponse {
    console.log('data : ', data);
    return {
      ...film,
      id: data.id !== '' ? data.id : undefined,
      title: data.title,
      description: data.description,
      release_date: data.release_date,
      age_minimum: data.age_minimum,
      favorite: data.favorite,
      poster_file: data.poster_file,
      poster: data.poster,
    };
  }
}
