import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { UtilsService } from '../shared/utils/utils.service';
import { SpaceResponse } from './space';

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
}
