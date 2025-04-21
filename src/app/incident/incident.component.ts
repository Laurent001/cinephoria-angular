import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, EMPTY, of, switchMap, tap } from 'rxjs';
import { Auditorium } from '../film/film';
import { Fields } from '../shared/utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from '../shared/utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from '../shared/utils/utils.service';
import { Incident, MaterialResponse } from './incident';
import { IncidentService } from './incident.service';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslateModule, GenericCrudTableComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class IncidentComponent implements OnInit {
  incidents!: Incident[];
  materials!: MaterialResponse[];
  auditoriums!: Auditorium[];
  fields: Fields[] = [];
  columnsToDisplay = [
    { name: 'id', type: 'number' },
    { name: 'description', type: 'string' },
    { name: 'added_date', type: 'datetime' },
    { name: 'is_solved', type: 'boolean' },
    { name: 'material.name', type: 'string' },
    { name: 'auditorium.name', type: 'string' },
  ];
  columnLabels: Record<string, string> = {
    id: '#',
    'auditorium.name': 'Salle',
    'material.name': 'Matériel',
    description: 'Description',
    is_solved: 'Statut',
    added_date: "Date d'ajout",
  };

  booleanLabels: Record<string, { true: string; false: string }> = {
    is_solved: { true: 'Résolu', false: 'Non résolu' },
  };

  constructor(
    private incidentService: IncidentService,
    private utilsService: UtilsService
  ) {}

  ngOnInit() {
    this.getIncidents();
  }

  getIncidents() {
    this.incidentService
      .getIncidents()
      .pipe(
        tap((response) => {
          this.incidents = response.incidents;
          this.materials = response.materials;
          this.auditoriums = response.auditoriums;
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
          value: auditorium.id ?? 0,
        })),
        required: true,
      },
      {
        name: 'material',
        label: 'Matériel',
        type: 'select',
        options: this.materials.map((material) => ({
          label: material.name,
          value: material.id,
        })),
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      { name: 'is_solved', label: 'Résolu', type: 'toggle' },
      {
        name: 'added_date',
        label: 'Ajouté le',
        type: 'datetime',
        readonly: true,
      },
    ];
  }

  getEmptyIncident(): Incident {
    return {
      id: undefined,
      description: '',
      is_solved: false,
      material: undefined,
      auditorium: undefined,
    };
  }

  onAddIncident(incident: Incident) {
    const incidentModified = this.getIncidentResponseModified(
      this.getEmptyIncident(),
      incident
    );
    this.incidentService
      .addIncident(incidentModified)
      .pipe(
        tap((response) => {
          this.incidents = response.incidents;
          this.materials = response.materials;
          this.auditoriums = response.auditoriums;

          this.utilsService.presentAlert(
            'Création réussie ',
            "l'incident' a été ajouté",
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onUpdateIncident(incident: Incident) {
    const incidentModified = this.getIncidentResponseModified(
      this.getEmptyIncident(),
      incident
    );

    this.incidentService
      .updateIncident(incidentModified)
      .pipe(
        tap({
          next: (response) => {
            this.incidents = response.incidents;
            this.materials = response.materials;
            this.auditoriums = response.auditoriums;

            this.utilsService.presentAlert(
              'Mise à jour réussie ',
              "l'incident a été mise à jour",
              ['OK'],
              'success'
            );
          },
          error: (err) => {
            this.utilsService.presentAlert(
              'Erreur',
              "Une erreur est survenue lors de la mise à jour de l'incident",
              ['OK'],
              'error'
            );
          },
        }),
        catchError((err) => {
          return of(null);
        })
      )
      .subscribe();
  }

  onDeleteIncident(incident: Incident) {
    this.utilsService
      .openConfirmModal(
        'Confirmation',
        'Êtes-vous sûr de vouloir supprimer cet incident ?',
        ['Confirmer', 'Annuler']
      )
      .pipe(
        switchMap((response) => {
          if (response && incident.id) {
            return this.incidentService.deleteIncidentById(incident.id).pipe(
              tap((deleteResponse) => {
                this.incidents = deleteResponse.incidents;
                this.materials = deleteResponse.materials;
                this.auditoriums = deleteResponse.auditoriums;

                this.utilsService.presentAlert(
                  'Suppression réussie ',
                  "l'incident a été supprimée",
                  ['OK'],
                  'success'
                );
              }),
              catchError(() => {
                this.utilsService.presentAlert(
                  'Erreur',
                  "Une erreur est survenue lors de la suppression de l'incident",
                  ['OK'],
                  'error'
                );
                return EMPTY;
              })
            );
          }
          return EMPTY;
        })
      )
      .subscribe();
  }

  getIncidentResponseModified(incident: Incident, data: any): Incident {
    const auditoriumId =
      typeof data.auditorium === 'object'
        ? data.auditorium.id
        : data.auditorium;
    const materialId =
      typeof data.material === 'object' ? data.material.id : data.material;

    const selectedAuditorium = this.auditoriums.find(
      (a) => a.id === auditoriumId
    );
    const selectedMaterial = this.materials.find((m) => m.id === materialId);

    return {
      ...incident,
      id: data.id !== '' ? data.id : undefined,
      description: data.description,
      is_solved: data.is_solved,
      added_date: data.added_date,
      auditorium: selectedAuditorium,
      material: selectedMaterial,
    };
  }
}
