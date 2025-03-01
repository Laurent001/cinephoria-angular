import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { AuditoriumResponse } from '../film/film';
import { Fields } from '../utils/dynamic-modal-form/dynamic-modal-form';
import { GenericCrudTableComponent } from '../utils/generic-crud-table/generic-crud-table.component';
import { UtilsService } from '../utils/utils.service';
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
  auditoriums!: AuditoriumResponse[];
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
    private translate: TranslateService,
    private incidentService: IncidentService,
    private utilsService: UtilsService
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

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
      { name: 'id', label: 'id', type: 'masked' },
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
    const incidentModified = this.getIncidentReponseModified(
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
            'Création réussie',
            "L'incident' a été ajouté",
            ['OK'],
            'success'
          );
        })
      )
      .subscribe();
  }

  onUpdateIncident(incident: Incident) {
    const incidentModified = this.getIncidentReponseModified(
      this.getEmptyIncident(),
      incident
    );
    this.incidentService
      .updateIncident(incidentModified)
      .pipe(
        tap((response) => {
          this.incidents = response.incidents;
          this.materials = response.materials;
          this.auditoriums = response.auditoriums;
        })
      )
      .subscribe();
  }

  onDeleteIncident(incident: Incident) {
    if (incident.id)
      this.incidentService
        .deleteIncidentById(incident.id)
        .pipe(
          tap((response) => {
            this.incidents = response.incidents;
            this.materials = response.materials;
            this.auditoriums = response.auditoriums;
          })
        )
        .subscribe();
  }

  getIncidentReponseModified(incident: Incident, data: any): Incident {
    return {
      ...incident,
      id: data.id !== '' ? data.id : undefined,
      description: data.description,
      is_solved: data.is_solved,
      added_date: data.added_date,
      auditorium: {
        id: data.auditorium,
        ...(incident.auditorium || {}),
      } as AuditoriumResponse,
      material: {
        id: data.material,
        ...(incident.material || {}),
      } as MaterialResponse,
    };
  }
}
