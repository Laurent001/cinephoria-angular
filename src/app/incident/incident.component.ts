import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { AuditoriumResponse } from '../film/film';
import { Fields } from '../utils/dynamic-modal-form/dynamic-modal-form';
import { DynamicModalFormComponent } from '../utils/dynamic-modal-form/dynamic-modal-form.component';
import { Incident, IncidentFields, MaterialResponse } from './incident';
import { IncidentService } from './incident.service';

@Component({
  selector: 'app-intranet',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    MatDialogModule,
    DynamicModalFormComponent,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class IncidentComponent implements OnInit {
  incidents!: Incident[];
  materials!: MaterialResponse[];
  auditoriums!: AuditoriumResponse[];
  showModal: boolean = false;
  title: string = "Modifier l'incident";
  fields: Fields[] = [];
  initialValues: IncidentFields;
  paginatedIncidents!: Incident[];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private translate: TranslateService,
    private incidentService: IncidentService //private dialog: MatDialog
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);

    this.initialValues = {
      id: 0,
      auditorium_id: 0,
      material_id: 0,
      description: '',
      is_solved: false,
      added_date: new Date(),
    };
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
          this.updatePagination();
        })
      )
      .subscribe();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.incidents.length / this.itemsPerPage);
    this.currentPage = 1;
    this.paginateIncidents();
  }

  paginateIncidents() {
    this.itemsPerPage = Number(this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.incidents.length
    );

    this.paginatedIncidents = this.incidents.slice(startIndex, endIndex);
  }

  changeItemsPerPage() {
    this.updatePagination();
    this.paginateIncidents();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateIncidents();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateIncidents();
    }
  }

  getFields(isEmptyIncident?: boolean): Fields[] {
    const fields: Fields[] = [
      {
        name: 'auditorium_id',
        label: 'Auditorium',
        type: 'select',
        options: this.auditoriums.map((auditorium) => ({
          label: auditorium.name,
          value: auditorium.id,
        })),
        required: true,
      },
      {
        name: 'material_id',
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
    ];

    if (!isEmptyIncident) {
      fields.push({ name: 'added_date', label: 'Ajouté le', type: 'date' });
    }

    return fields;
  }

  getInitialValues(incident: Incident): IncidentFields {
    const initialValues: IncidentFields = {
      auditorium_id: incident.auditorium.id,
      material_id: incident.material.id,
      description: incident.description,
      is_solved: incident.is_solved,
      id: incident.id,
    };

    if (incident.added_date) {
      initialValues.added_date = incident.added_date;
    }

    return initialValues;
  }

  getEmptyIncident(): Incident {
    return {
      id: 0,
      description: '',
      is_solved: false,
      material: {
        id: 0,
        name: '',
        description: '',
      },
      auditorium: {
        id: 0,
        name: '',
        seat: 0,
        handi_seat: 0,
        quality: '',
        quality_id: 0,
        price: 0,
        cinema: {
          id: 0,
          name: '',
          address: '',
          city: '',
          postcode: 0,
          phone: 0,
          opening_hours: 0,
        },
      },
    };
  }

  openModal(incident?: Incident) {
    if (!incident) {
      const newIncident = true;
      this.fields = this.getFields(newIncident);
      incident = this.getEmptyIncident();
    } else {
      this.fields = this.getFields();
    }
    this.initialValues = this.getInitialValues(incident);
    this.showModal = true;
  }

  onModalClose(incident?: Incident) {
    this.showModal = false;
    if (incident) {
      const incidentModified = this.getIncidentReponseModified(
        this.getEmptyIncident(),
        incident
      );

      if (incidentModified.id === 0) {
        this.addIncident(incidentModified);
      } else {
        this.updateIncident(incidentModified);
      }
    }
  }

  getIncidentReponseModified(incident: Incident, data: any): Incident {
    return {
      ...incident,
      id: data.id,
      description: data.description,
      is_solved: data.is_solved,
      added_date: new Date(data.added_date),
      auditorium: {
        ...incident.auditorium,
        id: data.auditorium_id,
      },
      material: {
        ...incident.material,
        id: data.material_id,
      },
    };
  }

  deleteIncident(incident: Incident) {
    this.incidentService
      .deleteIncidentById(incident.id)
      .pipe(
        tap((incidentResponse) => {
          this.incidents = incidentResponse.incidents;
          this.materials = incidentResponse.materials;
          this.auditoriums = incidentResponse.auditoriums;
          this.updatePagination();
        })
      )
      .subscribe();
  }

  updateIncident(incident: Incident) {
    this.incidentService
      .setIncident(incident)
      .pipe(
        tap((incidentResponse) => {
          this.incidents = incidentResponse.incidents;
          this.materials = incidentResponse.materials;
          this.auditoriums = incidentResponse.auditoriums;
          this.updatePagination();
        })
      )
      .subscribe();
  }

  addIncident(incident: Incident) {
    this.incidentService
      .addIncident(incident)
      .pipe(
        tap((incidentResponse) => {
          this.incidents = incidentResponse.incidents;
          this.materials = incidentResponse.materials;
          this.auditoriums = incidentResponse.auditoriums;
          this.updatePagination();
        })
      )
      .subscribe();
  }
}
