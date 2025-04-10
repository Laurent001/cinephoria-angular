import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OpinionResponse, OpinionsResponse } from 'src/app/space/space';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpinionsService {
  constructor(private http: HttpClient) {}

  getOpinions(): Observable<OpinionsResponse> {
    return this.http.get<OpinionsResponse>(`${environment.url}/api/opinion`);
  }

  addOpinion(newOpinion: OpinionResponse): Observable<any> {
    return this.http.post<any>(`${environment.url}/api/opinion`, newOpinion);
  }

  updateOpinionStatus(opinion: OpinionResponse): Observable<void> {
    return this.http.put<void>(
      `${environment.url}/api/opinion/update/status`,
      opinion
    );
  }

  updateOpinion(opinion: OpinionResponse): Observable<void> {
    return this.http.put<void>(
      `${environment.url}/api/opinion/update`,
      opinion
    );
  }

  deleteOpinionById(opinionId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.url}/api/opinion/delete/${opinionId}`
    );
  }
}
