import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { Incident, IncidentResponse } from './incident';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  getIncidents(): Observable<IncidentResponse> {
    return this.http.get<IncidentResponse>(`${environment.url}/api/incident`);
  }

  setIncident(incident: Incident): Observable<IncidentResponse> {
    const data = { incident, locale: 'Europe/Paris' };
    return this.http.post<IncidentResponse>(
      `${environment.url}/api/incident/update`,
      data
    );
  }

  deleteIncidentById(incidentId: number): Observable<IncidentResponse> {
    return this.http.delete<IncidentResponse>(
      `${environment.url}/api/incident/delete/${incidentId}`
    );
  }

  addIncident(incident: Incident): Observable<IncidentResponse> {
    return this.http.post<IncidentResponse>(
      `${environment.url}/api/incident/add`,
      incident
    );
  }
}
