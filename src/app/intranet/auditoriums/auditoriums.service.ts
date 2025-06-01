import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Auditorium, AuditoriumResponse } from 'src/app/film/film';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditoriumsService {
  private auditoriumDeletedSubject = new Subject<void>();
  private auditoriumAddedSubject = new Subject<void>();

  auditoriumDeleted$: Observable<void> =
    this.auditoriumDeletedSubject.asObservable();
  auditoriumAdded$: Observable<void> =
    this.auditoriumAddedSubject.asObservable();

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
    return this.http
      .delete<AuditoriumResponse>(
        `${environment.url}/api/intranet/auditorium/delete/${auditoriumId}`
      )
      .pipe(tap(() => this.auditoriumDeletedSubject.next()));
  }

  addAuditorium(auditorium: Auditorium): Observable<AuditoriumResponse> {
    return this.http
      .post<AuditoriumResponse>(
        `${environment.url}/api/intranet/auditorium/add`,
        auditorium
      )
      .pipe(tap(() => this.auditoriumAddedSubject.next()));
  }
}
