import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs';
import { FilmResponse } from 'src/app/film/film';
import { User } from 'src/app/app';
import { OpinionResponse, StatusResponse } from 'src/app/space/space';
import { Fields } from 'src/app/utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from 'src/app/utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from 'src/app/utils/utils.service';
import { OpinionsService } from './opinions.service';

@Component({
  selector: 'app-opinions',
  templateUrl: './opinions.component.html',
  styleUrls: ['./opinions.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, GenericCrudTableComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class OpinionsComponent implements OnInit {
  opinions: OpinionResponse[] = [];
  statuses: StatusResponse[] = [];
  fields: Fields[] = [];
  columnsToDisplay = [
    { name: 'id', type: 'number' },
    { name: 'user.email', type: 'string' },
    { name: 'film.title', type: 'string' },
    { name: 'rating', type: 'number' },
    { name: 'added_date', type: 'datetime' },
    { name: 'description', type: 'string' },
    { name: 'status.name', type: 'string' },
  ];
  columnLabels: Record<string, string> = {
    id: '#',
    'user.email': 'Utilisateur',
    'film.title': 'Film',
    rating: 'Score',
    added_date: 'Date ajout',
    description: 'Description',
    'status.name': 'Status',
  };

  constructor(
    private translate: TranslateService,
    private opinionsService: OpinionsService,
    private utilsService: UtilsService
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit() {
    this.getOpinions();
  }

  getOpinions() {
    this.opinionsService
      .getOpinions()
      .pipe(
        tap((response) => {
          this.opinions = response.opinions;
          this.statuses = response.statuses;
          this.fields = this.getFields();
        })
      )
      .subscribe();
  }

  getFields(): Fields[] {
    return [
      { name: 'id', label: 'id', type: 'masked' },
      {
        name: 'user',
        label: 'Utilisateur',
        type: 'object',
        value: 'email',
        readonly: true,
      },
      {
        name: 'film',
        label: 'Film',
        type: 'object',
        value: 'title',
        readonly: true,
      },
      {
        name: 'rating',
        label: 'note',
        type: 'select',
        options: [
          {
            label: '1',
            value: 1,
          },
          {
            label: '2',
            value: 2,
          },
          {
            label: '3',
            value: 3,
          },
          {
            label: '4',
            value: 4,
          },
          {
            label: '5',
            value: 5,
          },
        ],
        readonly: true,
      },
      {
        name: 'description',
        label: 'description',
        type: 'textarea',
        required: true,
        readonly: true,
      },
      {
        name: 'status',
        label: 'Statut',
        type: 'select',
        options: this.statuses.map((status) => ({
          label: status.name,
          value: status.id ?? 0,
        })),
        required: true,
      },
    ];
  }

  getEmptyOpinion(): OpinionResponse {
    return {
      id: undefined,
      user: undefined,
      film: undefined,
      rating: 0,
      description: '',
      status: undefined,
    };
  }

  onUpdateOpinion(opinion: OpinionResponse) {
    const OpinionModified = this.getOpinionResponseModified(
      this.getEmptyOpinion(),
      opinion
    );
    this.opinionsService
      .updateOpinion(OpinionModified)
      .pipe(
        tap((opinions) => {
          this.getOpinions();

          this.utilsService.presentAlert(
            'Mise à jour réussie ',
            "L'avis' a été mise à jour",
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onDeleteOpinion(opinion: OpinionResponse) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Cela va supprimer cet avis définitivement. Êtes-vous sûr de vouloir continuer ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && opinion.id) {
            return this.opinionsService.deleteOpinionById(opinion.id).pipe(
              tap(() => {
                this.getOpinions();
                this.utilsService.presentAlert(
                  'Suppression réussie ',
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

  getOpinionResponseModified(
    opinion: OpinionResponse,
    data: any
  ): OpinionResponse {
    return {
      ...opinion,
      id: data.id !== '' ? data.id : undefined,
      user: {
        email: data.user,
        ...(opinion.user || {}),
      } as User,

      film: {
        title: data.film,
        ...(opinion.film || {}),
      } as FilmResponse,

      rating: data.rating,
      added_date: data.added_date,
      description: data.description,
      status: {
        id: data.status,
        ...(opinion.status || {}),
      } as StatusResponse,
    };
  }
}
