import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { QRCodeCheckResponse, QRCodeResponse } from './qrcode';

@Injectable({
  providedIn: 'root',
})
export class QRCodeService {
  constructor(private http: HttpClient) {}

  getQRCodeByBookingId(bookingId: number): Observable<QRCodeResponse> {
    return this.http.get<QRCodeResponse>(
      `${environment.url}/api/qrcode/generate/${bookingId}`
    );
  }

  verifyQRCode(token: string): Observable<QRCodeCheckResponse> {
    return this.http.get<QRCodeCheckResponse>(
      `${environment.url}/api/qrcode/verify/${token}`
    );
  }
}
