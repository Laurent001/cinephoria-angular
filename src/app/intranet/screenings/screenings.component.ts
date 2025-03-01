import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs';
import { AuditoriumResponse, FilmResponse } from 'src/app/film/film';
import { Screening } from 'src/app/screening/screening';
import { Fields } from 'src/app/utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from 'src/app/utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from 'src/app/utils/utils.service';
import { ScreeningsService } from './screenings.service';

@Component({
  selector: 'app-screenings',
  templateUrl: './screenings.component.html',
  styleUrls: ['./screenings.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, GenericCrudTableComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class ScreeningsComponent implements OnInit {
  screenings!: Screening[];
  films!: FilmResponse[];
  auditoriums!: AuditoriumResponse[];
  fields: Fields[] = [];
  columnsToDisplay = [
    { name: 'id', type: 'number' },
    { name: 'auditorium.name', type: 'string' },
    { name: 'film.title', type: 'string' },
    { name: 'start_time', type: 'datetime' },
    { name: 'end_time', type: 'datetime' },
    { name: 'remaining_seat', type: 'string' },
    { name: 'remaining_handi_seat', type: 'string' },
  ];
  columnLabels: Record<string, string> = {
    id: '#',
    'auditorium.name': 'Salle',
    'film.title': 'Film',
    start_time: 'Début',
    end_time: 'Fin',
    remaining_seat: 'Places',
    remaining_handi_seat: 'Places handi',
  };

  constructor(
    private translate: TranslateService,
    private screeningsService: ScreeningsService,
    private utilsService: UtilsService
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit() {
    this.getScreenings();
  }

  getScreenings() {
    this.screeningsService
      .getScreenings()
      .pipe(
        tap((response) => {
          console.log('response : ', response);
          this.screenings = response.screenings;
          this.auditoriums = response.auditoriums;
          this.films = response.films;
          this.fields = this.getFields();
        })
      )
      .subscribe();
  }

  getFields(): Fields[] {
    return [
      { name: 'id', label: 'id', type: 'masked' },
      {
        name: 'auditorium',
        label: 'Salle',
        type: 'select',
        options: this.auditoriums.map((auditorium) => ({
          label: auditorium.name,
          value: auditorium.id,
        })),
        required: true,
      },
      {
        name: 'film',
        label: 'Film',
        type: 'select',
        options: this.films.map((film) => ({
          label: film.title,
          value: film.id,
        })),
        required: true,
      },
      { name: 'start_time', label: 'Début', type: 'datetime', readonly: false },
      { name: 'end_time', label: 'Fin', type: 'datetime', readonly: false },
    ];
  }

  getEmptyScreening(): Screening {
    return {
      id: undefined,
      start_time: new Date(),
      end_time: new Date(),
      remaining_seat: 0,
      remaining_handi_seat: 0,
      film: undefined,
      auditorium: undefined,
    };
  }

  onAddScreening(screening: Screening) {
    const screeningModified = this.getScreeningReponseModified(
      this.getEmptyScreening(),
      screening
    );
    this.screeningsService
      .addScreening(screeningModified)
      .pipe(
        tap((response) => {
          this.screenings = response.screenings;
          this.films = response.films;
          this.auditoriums = response.auditoriums;

          this.utilsService.presentAlert(
            'Création réussie',
            'La séance a été ajoutée',
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onUpdateScreening(screening: Screening) {
    const ScreeningModified = this.getScreeningReponseModified(
      this.getEmptyScreening(),
      screening
    );
    this.screeningsService
      .updateScreening(ScreeningModified)
      .pipe(
        tap((response) => {
          this.screenings = response.screenings;
          this.films = response.films;
          this.auditoriums = response.auditoriums;

          this.utilsService.presentAlert(
            'Mise à jour réussie',
            'La séance a été mise à jour',
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onDeleteScreening(screening: Screening) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Cela va supprimer toutes les sièges et réservations associés à cette séance. Êtes-vous sûr de vouloir supprimer cette séance ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && screening.id) {
            return this.screeningsService
              .deleteScreeningById(screening.id)
              .pipe(
                tap((deleteResponse) => {
                  this.screenings = deleteResponse.screenings;
                  this.films = deleteResponse.films;
                  this.auditoriums = deleteResponse.auditoriums;

                  this.utilsService.presentAlert(
                    'Suppression réussie',
                    'La séance a été supprimée',
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

  getScreeningReponseModified(screening: Screening, data: any): Screening {
    return {
      ...screening,
      id: data.id !== '' ? data.id : undefined,
      start_time: data.start_time,
      end_time: data.end_time,
      remaining_seat: data.remaining_seat,
      remaining_handi_seat: data.remaining_handi_seat,
      auditorium: {
        id: data.auditorium,
        ...(screening.auditorium || {}),
      } as AuditoriumResponse,
      film: {
        id: data.film,
        ...(screening.film || {}),
      } as FilmResponse,
    };
  }
}
