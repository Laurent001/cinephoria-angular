import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { QRCodeService } from './qrcode.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: 'qrcode.component.html',
  styleUrls: ['qrcode.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
})
export class QRCodeComponent {
  @Input() bookingId: number = 0;
  qr_image?: string;
  qr_code?: number;

  environment = environment;

  constructor(
    private translate: TranslateService,
    private qrCodeService: QRCodeService
  ) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.qrCodeService
      .getQRCodeByBookingId(this.bookingId)
      .pipe(
        tap((response) => {
          this.qr_image = response.image;
          this.qr_code = response.token;
        })
      )
      .subscribe();
  }
}
