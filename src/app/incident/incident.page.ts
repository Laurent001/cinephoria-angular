import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { LayoutComponent } from '../layout/layout.component';
import { Fields } from '../utils/dynamic-modal-form/dynamic-modal-form';
import { DynamicModalFormComponent } from '../utils/dynamic-modal-form/dynamic-modal-form.component';
import { IncidentResponse } from './incident';
import { IncidentService } from './incident.service';

@Component({
  selector: 'app-intranet',
  templateUrl: './incident.page.html',
  styleUrls: ['./incident.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutComponent,
    TranslateModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class IncidentPage implements OnInit {
  incidents!: IncidentResponse[];
  paginatedIncidents!: IncidentResponse[];
  itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private translate: TranslateService,
    private incidentService: IncidentService,
    private modalCtrl: ModalController
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit() {
    this.getIncidents();
  }

  getIncidents() {
    this.incidentService.getIncidents().subscribe((incidents) => {
      this.incidents = incidents;
      this.updatePagination();
    });
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

  async openEditModal(incident: any) {
    const fields: Fields[] = [
      {
        name: 'auditorium_name',
        label: 'Auditorium',
        type: 'text',
        required: true,
      },
      {
        name: 'material_name',
        label: 'Matériel',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      { name: 'is_solved', label: 'Résolu', type: 'toggle' },
      { name: 'added_date', label: 'Ajouté le', type: 'date' },
    ];
    const title: string = "Modifier l'incident";

    console.log('incident.is_solved', incident.is_solved);

    const initialValues = {
      auditorium_name: incident.auditorium.name,
      material_name: incident.material.name,
      description: incident.description,
      is_solved: incident.is_solved == 1 ? 'true' : 'false',
      added_date: incident.added_date,
    };

    const modal = await this.modalCtrl.create({
      component: DynamicModalFormComponent,
      componentProps: {
        title,
        fields,
        initialValues: initialValues,
      },
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'save') {
      const incidentModified = this.getIncidentReponseModified(incident, data);
      console.log('Données sauvegardées:', incidentModified);
      this.updateIncident(incidentModified);
    }
  }

  getIncidentReponseModified(
    incident: IncidentResponse,
    data: any
  ): IncidentResponse {
    return {
      ...incident,
      description: data.description,
      is_solved: data.is_solved == '' ? false : true,
      added_date: new Date(data.added_date),
      auditorium: {
        ...incident.auditorium,
        name: data.auditorium_name,
      },
      material: {
        ...incident.material,
        name: data.material_name,
      },
    };
  }

  deleteIncident(incident: IncidentResponse) {
    this.incidentService
      .deleteIncidentById(incident.id)
      .pipe(
        tap(() => {
          this.getIncidents();
        })
      )
      .subscribe();
  }

  updateIncident(incident: IncidentResponse) {
    this.incidentService
      .setIncident(incident)
      .pipe(
        tap(() => {
          this.getIncidents();
        })
      )
      .subscribe();
  }
}
