import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { HomeResponse } from './home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}

  getHello(): Observable<HomeResponse> {
    return this.http.get<HomeResponse>(`${environment.url}/api/hello`);
  }
}
