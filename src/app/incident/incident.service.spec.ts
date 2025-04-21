import { provideHttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { Incident } from './incident';
import { IncidentService } from './incident.service';

describe('IncidentService', () => {
  let service: IncidentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        IncidentService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(IncidentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch incidents', () => {
    service.getIncidents().subscribe((data) => {
      expect(data).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.url}/api/incident`);
    expect(req.request.method).toBe('GET');
    req.flush({ incidents: [], materials: [], auditoriums: [] });
  });

  it('should update incident', () => {
    const incident: Incident = {
      id: 1,
      description: 'Updated',
      is_solved: true,
    };
    service.updateIncident(incident).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.url}/api/incident/update`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should add incident', () => {
    const incident: Incident = {
      description: 'New',
      is_solved: false,
    };
    service.addIncident(incident).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.url}/api/incident/add`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should delete incident', () => {
    const id = 10;
    service.deleteIncidentById(id).subscribe((res) => {
      expect(res).toBeTruthy();
    });
    const req = httpMock.expectOne(
      `${environment.url}/api/incident/delete/${id}`
    );
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
