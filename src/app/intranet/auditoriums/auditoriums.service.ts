import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Auditorium, AuditoriumResponse } from 'src/app/film/film';
import { UtilsService } from 'src/app/utils/utils.service';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root',
})
export class AuditoriumsService {
  constructor(private http: HttpClient, private utilsService: UtilsService) {}

  getAuditoriums(): Observable<AuditoriumResponse> {
    return this.http.get<AuditoriumResponse>(
      `${environment.url}/api/intranet/auditorium`
    );
  }

  updateAuditorium(auditorium: Auditorium): Observable<AuditoriumResponse> {
    return this.http.put<AuditoriumResponse>(
      `${environment.url}/api/intranet/auditorium/update`,
      auditorium
    );
  }

  deleteAuditoriumById(auditoriumId: number): Observable<AuditoriumResponse> {
    return this.http.delete<AuditoriumResponse>(
      `${environment.url}/api/intranet/auditorium/delete/${auditoriumId}`
    );
  }

  addAuditorium(auditorium: Auditorium): Observable<AuditoriumResponse> {
    const formData = this.utilsService.createFormData(auditorium);

    return this.http.post<AuditoriumResponse>(
      `${environment.url}/api/intranet/auditorium/add`,
      formData
    );
  }
}
