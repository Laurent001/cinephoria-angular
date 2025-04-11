import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Email } from './mailer';

@Injectable({
  providedIn: 'root',
})
export class MailerService {
  constructor(private http: HttpClient) {}

  sendEmail(contact: Email): Observable<Email> {
    const data = { contact };
    return this.http.post<Email>(`${environment.url}/api/mail/contact`, data);
  }
}
