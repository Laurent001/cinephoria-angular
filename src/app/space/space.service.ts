import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { AuthService } from '../auth/auth.service';
import { UtilsService } from '../utils/utils.service';
import { OpinionResponse, SpaceResponse } from './space';

@Injectable({
  providedIn: 'root',
})
export class SpaceService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private utilsService: UtilsService
  ) {}

  getSpaceByUserId(id?: number): Observable<SpaceResponse> {
    return this.http.get<SpaceResponse>(
      `${environment.url}/api/space/user/${id}`
    );
  }

  addOpinion(newOpinion: OpinionResponse): Observable<any> {
    return this.http.post<any>(`${environment.url}/api/opinion`, newOpinion);
  }

  updateOpinion(opinion: OpinionResponse): Observable<OpinionResponse> {
    return this.http.put<OpinionResponse>(
      `${environment.url}/api/opinion/${opinion.id}`,
      opinion
    );
  }
}
