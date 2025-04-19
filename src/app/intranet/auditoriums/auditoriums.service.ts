import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Auditorium, AuditoriumResponse } from 'src/app/film/film';
import { UtilsService } from 'src/app/shared/utils/utils.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditoriumsService {
  auditoriumDeleted: EventEmitter<void> = new EventEmitter<void>();
  auditoriumAdded: EventEmitter<void> = new EventEmitter<void>();

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
      .pipe(
        tap(() => {
          this.auditoriumDeleted.emit();
        })
      );
  }

  onAuditoriumDeleted(callback: () => void) {
    return this.auditoriumDeleted.subscribe(callback);
  }

  addAuditorium(auditorium: Auditorium): Observable<AuditoriumResponse> {
    return this.http
      .post<AuditoriumResponse>(
        `${environment.url}/api/intranet/auditorium/add`,
        auditorium
      )
      .pipe(
        tap(() => {
          this.auditoriumAdded.emit();
        })
      );
  }

  onAuditoriumAdded(callback: () => void) {
    return this.auditoriumAdded.subscribe(callback);
  }
}
