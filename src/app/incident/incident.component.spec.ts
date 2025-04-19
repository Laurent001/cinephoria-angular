import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { UtilsService } from '../utils/utils.service';
import { Incident } from './incident';
import { IncidentComponent } from './incident.component';
import { IncidentService } from './incident.service';

describe('IncidentComponent', () => {
  let component: IncidentComponent;
  let fixture: ComponentFixture<IncidentComponent>;
  let incidentServiceSpy: jasmine.SpyObj<IncidentService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    const incidentServiceMock = jasmine.createSpyObj('IncidentService', [
      'addIncident',
    ]);
    const utilsServiceMock = jasmine.createSpyObj('UtilsService', [
      'presentAlert',
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, TranslateModule.forRoot()],
      declarations: [IncidentComponent],
      providers: [
        { provide: IncidentService, useValue: incidentServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentComponent);
    component = fixture.componentInstance;

    incidentServiceSpy = TestBed.inject(
      IncidentService
    ) as jasmine.SpyObj<IncidentService>;
    utilsServiceSpy = TestBed.inject(
      UtilsService
    ) as jasmine.SpyObj<UtilsService>;

    component.incidents = [];
    component.materials = [
      { id: 2, name: 'Projecteur', description: 'Projecteur de salle' },
    ];
    component.auditoriums = [
      { id: 1, name: 'Salle 1', seat: 100, seat_handi: 5 },
    ];
  });

  it('should add a new incident and show success alert', () => {
    const newIncident = {
      id: '',
      description: 'Problème de son',
      is_solved: false,
      added_date: new Date().toISOString(),
      auditorium: { name: 'Salle 1', seat: 100, seat_handi: 5 },
      material: {
        id: 2,
        name: 'Projecteur',
        description: 'Projecteur de salle',
      },
    };

    const mockedResponse = {
      incidents: [
        { id: 123, description: 'Problème de son', is_solved: false },
      ],
      materials: component.materials,
      auditoriums: component.auditoriums,
    };

    incidentServiceSpy.addIncident.and.returnValue(of(mockedResponse));

    component.onAddIncident(newIncident as any);

    expect(incidentServiceSpy.addIncident).toHaveBeenCalled();
    expect(component.incidents.length).toBe(1);
    expect(component.incidents[0].description).toBe('Problème de son');
    expect(utilsServiceSpy.presentAlert).toHaveBeenCalledWith(
      'Création réussie ',
      "l'incident' a été ajouté",
      ['OK'],
      'success'
    );
  });
});
