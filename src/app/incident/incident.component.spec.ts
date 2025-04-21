import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { UtilsService } from '../shared/utils/utils.service';
import { Incident, IncidentResponse } from './incident';
import { IncidentComponent } from './incident.component';
import { IncidentService } from './incident.service';

describe('IncidentComponent', () => {
  let component: IncidentComponent;
  let fixture: ComponentFixture<IncidentComponent>;
  let incidentServiceSpy: jasmine.SpyObj<IncidentService>;
  let utilsServiceSpy: jasmine.SpyObj<UtilsService>;
  let incidentResponse: IncidentResponse;

  beforeEach(async () => {
    const incidentServiceMock = jasmine.createSpyObj('IncidentService', [
      'getIncidents',
      'addIncident',
      'updateIncident',
      'deleteIncidentById',
    ]);
    const utilsServiceMock = jasmine.createSpyObj('UtilsService', [
      'presentAlert',
      'openConfirmModal',
    ]);

    incidentResponse = {
      incidents: [
        {
          id: 1,
          description: 'Micro défectueux',
          is_solved: false,
          added_date: new Date('2024-03-01T10:00:00'),
          material: {
            id: 1,
            name: 'Mic',
            description: 'microphone',
          },
          auditorium: {
            id: 1,
            name: 'Salle 1',
            seat: 100,
            seat_handi: 2,
            quality: {
              id: 1,
              name: '4K',
              price: 10,
            },
            cinema: {
              id: 1,
              name: 'Cinéma Lumière',
              address: '12 Rue du Cinéma',
              postcode: '75001',
              city: 'Paris',
              phone: '01 23 45 67 89',
            },
          },
        },
        {
          id: 2,
          description: 'Projecteur hors service',
          is_solved: false,
          added_date: new Date('2024-03-02T14:30:00'),
          material: {
            id: 2,
            name: 'Projecteur',
            description: 'projecteur 4K',
          },
          auditorium: {
            id: 1,
            name: 'Salle 1',
            seat: 100,
            seat_handi: 2,
            quality: {
              id: 1,
              name: '4K',
              price: 10,
            },
            cinema: {
              id: 1,
              name: 'Cinéma Lumière',
              address: '12 Rue du Cinéma',
              postcode: '75001',
              city: 'Paris',
              phone: '01 23 45 67 89',
            },
          },
        },
        {
          id: 3,
          description: 'Problème de climatisation',
          is_solved: true,
          added_date: new Date('2024-03-03T09:15:00'),
          material: {
            id: 1,
            name: 'Mic',
            description: 'microphone',
          },
          auditorium: {
            id: 1,
            name: 'Salle 1',
            seat: 100,
            seat_handi: 2,
            quality: {
              id: 1,
              name: '4K',
              price: 10,
            },
            cinema: {
              id: 1,
              name: 'Cinéma Lumière',
              address: '12 Rue du Cinéma',
              postcode: '75001',
              city: 'Paris',
              phone: '01 23 45 67 89',
            },
          },
        },
      ],
      materials: [
        { id: 1, name: 'Mic', description: 'microphone' },
        { id: 2, name: 'Projecteur', description: 'projecteur 4K' },
      ],
      auditoriums: [
        {
          id: 1,
          name: 'Salle 1',
          seat: 100,
          seat_handi: 2,
          quality: {
            id: 1,
            name: '4K',
            price: 10,
          },
          cinema: {
            id: 1,
            name: 'Cinéma Lumière',
            address: '12 Rue du Cinéma',
            postcode: '75001',
            city: 'Paris',
            phone: '01 23 45 67 89',
          },
        },
      ],
    };

    incidentServiceMock.getIncidents.and.returnValue(of(incidentResponse));

    await TestBed.configureTestingModule({
      imports: [CommonModule, HttpClientTestingModule, IncidentComponent],
      providers: [
        { provide: IncidentService, useValue: incidentServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
      ],
    }).compileComponents();

    incidentServiceSpy = TestBed.inject(
      IncidentService
    ) as jasmine.SpyObj<IncidentService>;
    utilsServiceSpy = TestBed.inject(
      UtilsService
    ) as jasmine.SpyObj<UtilsService>;

    fixture = TestBed.createComponent(IncidentComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('Initialisation', () => {
    it('should call getIncidents on init', () => {
      expect(incidentServiceSpy.getIncidents).toHaveBeenCalled();
    });
  });

  describe("Ajout d'un incident", () => {
    it('should add an incident and show alert', () => {
      const newIncident: Incident = {
        description: 'Ampoule cassée',
        is_solved: false,
        added_date: new Date('2024-03-02T14:30:00'),
        material: {
          id: 4,
          name: 'Ampoule',
          description: 'un projectile a cassé une ampoule au fond de la salle',
        },
        auditorium: {
          id: 1,
          name: 'Salle 1',
          seat: 100,
          seat_handi: 2,
          quality: {
            id: 1,
            name: '4K',
            price: 10,
          },
          cinema: {
            id: 1,
            name: 'Cinéma Lumière',
            address: '12 Rue du Cinéma',
            postcode: '75001',
            city: 'Paris',
            phone: '01 23 45 67 89',
          },
        },
      };

      const updatedResponse: IncidentResponse = {
        ...incidentResponse,
        incidents: [...incidentResponse.incidents, { id: 4, ...newIncident }],
      };

      incidentServiceSpy.addIncident.and.returnValue(of(updatedResponse));

      component.onAddIncident(newIncident);

      expect(incidentServiceSpy.addIncident).toHaveBeenCalled();
      expect(utilsServiceSpy.presentAlert).toHaveBeenCalledWith(
        'Création réussie ',
        "l'incident' a été ajouté",
        ['OK'],
        'success'
      );
      expect(component.incidents.length).toBe(4);
    });
  });

  describe("Mise à jour d'un incident", () => {
    it('should update an incident and show alert', () => {
      const updatedIncident: Incident = {
        id: 2,
        description: 'Projecteur réparé',
        is_solved: true,
        added_date: new Date('2024-03-02T14:30:00'),
        material: {
          id: 2,
          name: 'Projecteur',
          description: 'projecteur 4K',
        },
        auditorium: {
          id: 1,
          name: 'Salle 1',
          seat: 100,
          seat_handi: 2,
          quality: {
            id: 1,
            name: '4K',
            price: 10,
          },
          cinema: {
            id: 1,
            name: 'Cinéma Lumière',
            address: '12 Rue du Cinéma',
            postcode: '75001',
            city: 'Paris',
            phone: '01 23 45 67 89',
          },
        },
      };

      const updatedResponse: IncidentResponse = {
        ...incidentResponse,
        incidents: incidentResponse.incidents.map((incident) =>
          incident.id === 2 ? updatedIncident : incident
        ),
      };

      incidentServiceSpy.updateIncident.and.returnValue(of(updatedResponse));

      component.onUpdateIncident(updatedIncident);

      expect(incidentServiceSpy.updateIncident).toHaveBeenCalledWith(
        updatedIncident
      );
      expect(utilsServiceSpy.presentAlert).toHaveBeenCalledWith(
        'Mise à jour réussie ',
        "l'incident a été mise à jour",
        ['OK'],
        'success'
      );

      expect(component.incidents.length).toBe(3);

      const incident = component.incidents.find((i) => i.id === 2);
      expect(incident?.description).toBe('Projecteur réparé');
      expect(incident?.is_solved).toBeTrue();
    });

    it('should handle error when updating a non-existing incident and show error alert', () => {
      const updatedIncident: Incident = {
        id: 99,
        description: 'Projecteur réparé',
        is_solved: true,
        added_date: new Date('2024-03-02T14:30:00'),
        material: { id: 2, name: 'Projecteur', description: 'projecteur 4K' },
        auditorium: {
          id: 1,
          name: 'Salle 1',
          seat: 100,
          seat_handi: 2,
          quality: { id: 1, name: '4K', price: 10 },
          cinema: {
            id: 1,
            name: 'Cinéma Lumière',
            address: '12 Rue du Cinéma',
            postcode: '75001',
            city: 'Paris',
            phone: '01 23 45 67 89',
          },
        },
      };

      incidentServiceSpy.updateIncident.and.callFake((incident: Incident) => {
        if (incident.id === 99) {
          return throwError(() => new Error('Erreur lors de la mise à jour'));
        } else {
          const fakeResponse: IncidentResponse = {
            incidents: [incident],
            materials: [],
            auditoriums: [],
          };
          return of(fakeResponse);
        }
      });

      component.onUpdateIncident(updatedIncident);

      expect(utilsServiceSpy.presentAlert).toHaveBeenCalledWith(
        'Erreur',
        "Une erreur est survenue lors de la mise à jour de l'incident",
        ['OK'],
        'error'
      );

      expect(component.incidents.length).toBe(3);
    });
  });

  describe("Suppression d'un incident", () => {
    it('should delete an incident and show alert', () => {
      const incidentIdToDelete = 2;

      utilsServiceSpy.openConfirmModal.and.returnValue(of(true));

      const updatedResponse: IncidentResponse = {
        ...incidentResponse,
        incidents: incidentResponse.incidents.filter(
          (i) => i.id !== incidentIdToDelete
        ),
      };

      incidentServiceSpy.deleteIncidentById.and.returnValue(
        of(updatedResponse)
      );

      component.onDeleteIncident({ id: incidentIdToDelete } as Incident);

      expect(utilsServiceSpy.openConfirmModal).toHaveBeenCalled();
      expect(incidentServiceSpy.deleteIncidentById).toHaveBeenCalledWith(
        incidentIdToDelete
      );
      expect(utilsServiceSpy.presentAlert).toHaveBeenCalledWith(
        'Suppression réussie ',
        "l'incident a été supprimée",
        ['OK'],
        'success'
      );

      expect(
        component.incidents.some((i) => i.id === incidentIdToDelete)
      ).toBeFalse();
    });

    it('should not delete if confirmation is false', () => {
      utilsServiceSpy.openConfirmModal.and.returnValue(of(false));

      component.onDeleteIncident({ id: 5 } as any);

      expect(incidentServiceSpy.deleteIncidentById).not.toHaveBeenCalled();
      expect(utilsServiceSpy.presentAlert).not.toHaveBeenCalled();
    });

    it('should show error alert if incident does not exist', () => {
      const nonExistingIncidentId = 999;

      utilsServiceSpy.openConfirmModal.and.returnValue(of(true));

      incidentServiceSpy.deleteIncidentById.and.returnValue(
        throwError(() => new Error('Incident non trouvé'))
      );

      component.onDeleteIncident({ id: nonExistingIncidentId } as Incident);

      expect(utilsServiceSpy.openConfirmModal).toHaveBeenCalled();
      expect(incidentServiceSpy.deleteIncidentById).toHaveBeenCalledWith(
        nonExistingIncidentId
      );

      expect(utilsServiceSpy.presentAlert).toHaveBeenCalledWith(
        'Erreur',
        "Une erreur est survenue lors de la suppression de l'incident",
        ['OK'],
        'error'
      );

      expect(component.incidents.length).toBe(3);
    });
  });

  describe('Tests supplémentaires', () => {
    it('should generate fields correctly', () => {
      const fields = component.getFields();
      expect(fields.length).toBeGreaterThan(0);
      expect(fields.some((f) => f.name === 'description')).toBeTrue();
      expect(fields.find((f) => f.name === 'auditorium')?.options?.length).toBe(
        1
      );
    });
  });

  describe('getIncidentResponseModified', () => {
    let component: IncidentComponent;
    let fixture: ComponentFixture<IncidentComponent>;

    beforeAll(async () => {
      await TestBed.configureTestingModule({
        imports: [CommonModule, HttpClientTestingModule, IncidentComponent],
      }).compileComponents();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(IncidentComponent);
      component = fixture.componentInstance;

      component.auditoriums = [
        {
          id: 1,
          name: 'Salle 1',
          seat: 100,
          seat_handi: 2,
          quality: { id: 1, name: '4K', price: 10 },
          cinema: {
            id: 1,
            name: 'Cinéma Lumière',
            address: '12 Rue du Cinéma',
            postcode: '75001',
            city: 'Paris',
            phone: '01 23 45 67 89',
          },
        },
        {
          id: 2,
          name: 'Salle 2',
          seat: 50,
          seat_handi: 1,
          quality: { id: 2, name: 'HD', price: 5 },
          cinema: {
            id: 2,
            name: 'Cinéma Lumière',
            address: '14 Rue du Cinéma',
            postcode: '75002',
            city: 'Paris',
            phone: '01 23 45 67 90',
          },
        },
      ];

      component.materials = [
        { id: 1, name: 'Mic', description: 'microphone' },
        { id: 2, name: 'Projecteur', description: 'projecteur 4K' },
      ];

      fixture.detectChanges();
    });

    it('should correctly modify incident when data is passed', () => {
      const incident: Incident = {
        id: 1,
        description: 'Test',
        is_solved: false,
        material: undefined,
        auditorium: undefined,
      };
      const data = {
        id: 1,
        description: 'Micro défectueux',
        is_solved: true,
        material: { id: 1, name: 'Mic', description: 'microphone' },
        auditorium: { id: 1, name: 'Salle 1' },
        added_date: new Date('2024-03-01T10:00:00'),
      };

      const modifiedIncident = component.getIncidentResponseModified(
        incident,
        data
      );

      expect(modifiedIncident.id).toBe(data.id);
      expect(modifiedIncident.description).toBe(data.description);
      expect(modifiedIncident.is_solved).toBeTrue();
      expect(modifiedIncident.material?.id).toBe(1);
      expect(modifiedIncident.auditorium?.id).toBe(1);
    });

    it('should handle incident with auditorium and material passed as IDs', () => {
      const incident: Incident = {
        id: 2,
        description: 'Projecteur défectueux',
        is_solved: false,
        material: undefined,
        auditorium: undefined,
      };
      const data = {
        id: 2,
        description: 'Projecteur réparé',
        is_solved: true,
        material: 2,
        auditorium: 1,
        added_date: new Date('2024-03-02T14:30:00'),
      };

      const modifiedIncident = component.getIncidentResponseModified(
        incident,
        data
      );

      expect(modifiedIncident.id).toBe(data.id);
      expect(modifiedIncident.description).toBe(data.description);
      expect(modifiedIncident.is_solved).toBeTrue();
      expect(modifiedIncident.material?.id).toBe(2);
      expect(modifiedIncident.auditorium?.id).toBe(1);
    });

    it("should return undefined material and auditorium if IDs don't match", () => {
      const incident: Incident = {
        id: 3,
        description: 'Problème de climatisation',
        is_solved: false,
        material: undefined,
        auditorium: undefined,
      };
      const data = {
        id: 3,
        description: 'Clim réparée',
        is_solved: true,
        material: 999,
        auditorium: 999,
        added_date: new Date('2024-03-03T09:15:00'),
      };

      const modifiedIncident = component.getIncidentResponseModified(
        incident,
        data
      );

      expect(modifiedIncident.material).toBeUndefined();
      expect(modifiedIncident.auditorium).toBeUndefined();
    });
  });
});
