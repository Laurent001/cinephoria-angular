import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { IncidentResponse } from './incident';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private http: HttpClient) {}

  getIncidents(): Observable<IncidentResponse[]> {
    return this.http.get<IncidentResponse[]>(`${environment.url}/api/incident`);
  }

  setIncident(incident: IncidentResponse): Observable<IncidentResponse> {
    return this.http.post<IncidentResponse>(
      `${environment.url}/api/incident/update`,
      incident
    );
  }

  deleteIncidentById(incidentId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.url}/api/incident/delete/${incidentId}`
    );
  }
}
