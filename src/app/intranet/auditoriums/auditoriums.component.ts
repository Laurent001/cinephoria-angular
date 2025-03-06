import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs';
import { Auditorium, CinemaResponse, QualityResponse } from 'src/app/film/film';
import { Fields } from 'src/app/utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from 'src/app/utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from 'src/app/utils/utils.service';
import { AuditoriumsService } from './auditoriums.service';

@Component({
  selector: 'app-auditoriums',
  templateUrl: './auditoriums.component.html',
  styleUrls: ['./auditoriums.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, GenericCrudTableComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class AuditoriumsComponent implements OnInit {
  auditoriums!: Auditorium[];
  cinemas!: CinemaResponse[];
  qualities!: QualityResponse[];

  fields: Fields[] = [];
  columnsToDisplay = [
    { name: 'id', type: 'number' },
    { name: 'name', type: 'string' },
    { name: 'seat', type: 'string' },
    { name: 'seat_handi', type: 'string' },
    { name: 'cinema.name', type: 'string' },
    { name: 'quality.name', type: 'string' },
  ];
  columnLabels: Record<string, string> = {
    id: '#',
    name: 'Nom',
    seat: 'Nb places',
    seat_handi: 'Nb places handi',
    'cinema.name': 'Cinéma',
    'quality.name': 'Qualité',
  };

  constructor(
    private translate: TranslateService,
    private utilsService: UtilsService,
    private auditoriumsService: AuditoriumsService
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit() {
    this.getAuditoriums();
  }

  getAuditoriums() {
    this.auditoriumsService
      .getAuditoriums()
      .pipe(
        tap((response) => {
          this.auditoriums = response.auditoriums;
          this.cinemas = response.cinemas;
          this.qualities = response.qualities;
          this.fields = this.getFields();
        })
      )
      .subscribe();
  }

  getFields(): Fields[] {
    return [
      { name: 'id', label: 'id', type: 'masked' },
      { name: 'name', label: 'Nom', type: 'text', required: true },
      {
        name: 'seat',
        label: 'Siège',
        type: 'text',
        required: true,
      },
      {
        name: 'seat_handi',
        label: 'Siège handi',
        type: 'text',
        required: true,
      },
      {
        name: 'price',
        label: 'Prix',
        type: 'text',
        required: true,
      },
      {
        name: 'cinema',
        label: 'Cinéma',
        type: 'select',
        options: this.cinemas.map((cinema) => ({
          label: cinema.name,
          value: cinema.id,
        })),
        required: true,
      },
      {
        name: 'quality',
        label: 'Qualité',
        type: 'select',
        options: this.qualities.map((quality) => ({
          label: quality.name,
          value: quality.id,
        })),
        required: true,
      },
    ];
  }

  getEmptyAuditorium(): Auditorium {
    return {
      id: undefined,
      name: '',
      seat: 0,
      seat_handi: 0,
      price: 0,
      cinema: undefined,
      quality: undefined,
    };
  }

  onAddAuditorium(auditorium: Auditorium) {
    const auditoriumModified = this.getAuditoriumModified(
      this.getEmptyAuditorium(),
      auditorium
    );

    this.auditoriumsService
      .addAuditorium(auditoriumModified)
      .pipe(
        tap((response) => {
          this.auditoriums = response.auditoriums;
          this.cinemas = response.cinemas;
          this.qualities = response.qualities;

          this.utilsService.presentAlert(
            'Création réussie',
            'La salle a été ajoutée',
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onUpdateAuditorium(auditorium: Auditorium) {
    const auditoriumModified = this.getAuditoriumModified(
      this.getEmptyAuditorium(),
      auditorium
    );

    this.auditoriumsService.updateAuditorium(auditoriumModified).pipe(
      tap((response) => {
        this.auditoriums = response.auditoriums;
        this.cinemas = response.cinemas;
        this.qualities = response.qualities;

        this.utilsService.presentAlert(
          'Mise à jour réussie',
          'La salle a été mise à jour',
          ['OK'],
          'success'
        );
      })
    );
    // .subscribe()
  }

  onDeleteAuditorium(auditorium: Auditorium) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Cela va supprimer toutes réservations associées à cette salle. Êtes-vous sûr de vouloir supprimer cette salle ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && auditorium.id) {
            return this.auditoriumsService
              .deleteAuditoriumById(auditorium.id)
              .pipe(
                tap((response) => {
                  console.log('response : ', response);
                  this.auditoriums = response.auditoriums;
                  this.cinemas = response.cinemas;
                  this.qualities = response.qualities;

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

  getAuditoriumModified(auditorium: Auditorium, data: any): Auditorium {
    console.log('data : ', data);
    return {
      ...auditorium,
      id: data.id !== '' ? data.id : undefined,
      name: data.name,
      seat: data.seat,
      seat_handi: data.seat_handi,
      price: data.price,
      cinema: {
        id: data.cinema,
        ...(auditorium.cinema || {}),
      } as CinemaResponse,
      quality: {
        id: data.quality,
        ...(auditorium.quality || {}),
      } as QualityResponse,
    };
  }
}
