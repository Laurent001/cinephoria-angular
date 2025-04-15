import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  BookingInfoWithStatus,
  QRCodeCheckResponse,
  QRCodeResponse,
} from './qrcode';

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

  extractBookingFromQRCode(
    qrCodeValue: string
  ): Observable<BookingInfoWithStatus> {
    try {
      const decoded = jwtDecode<any>(qrCodeValue);
      const bookingInfo = decoded.hasOwnProperty('0') ? decoded[0] : decoded;
      console.log('bookingInfo 1 : ', bookingInfo);

      return of({
        ...bookingInfo,
        valid: true,
      } as BookingInfoWithStatus);
    } catch (error) {
      console.error('Erreur de décodage du QR code :', error);
      return of({
        valid: false,
        reason: 'QR code invalide',
      } as BookingInfoWithStatus);
    }
  }
}
