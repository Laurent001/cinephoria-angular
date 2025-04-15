import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Camera } from '@capacitor/camera';
import { TranslateModule } from '@ngx-translate/core';
import jsQR from 'jsqr';
import { tap } from 'rxjs';
import { BookingInfoWithStatus } from '../qrcode';
import { QRCodeService } from '../qrcode.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  imports: [CommonModule, TranslateModule],
  standalone: true,
})
export class ScanTicketComponent implements OnInit, AfterViewInit {
  @ViewChild('video', { static: false }) videoElement!: ElementRef;
  @ViewChild('canvas', { static: false }) canvasElement!: ElementRef;

  videoStream?: MediaStream;
  scanning = false;
  scanResult: BookingInfoWithStatus | null = null;
  scanError: string | null = null;
  isMobile: boolean;
  isViewReady = false;

  videoConstraints = {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  constructor(
    private bookingQrService: QRCodeService,
    private platform: Platform,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.isMobile = this.platform.ANDROID || this.platform.IOS;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.isViewReady = true;

    setTimeout(() => {
      if (!this.videoElement || !this.canvasElement) {
        console.error('Video or canvas element is not defined');
        return;
      }
    }, 0);
  }

  prepareScanner(): void {
    this.scanning = true;

    setTimeout(() => {
      this.startScanner();
    }, 0);
  }

  startScanner(): void {
    if (
      !this.videoElement?.nativeElement ||
      !this.canvasElement?.nativeElement
    ) {
      setTimeout(() => this.startScanner(), 50);
      return;
    }

    this.scanning = true;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    let constraints = {
      video: this.isMobile
        ? this.videoConstraints
        : { facingMode: 'environment' },
      audio: false,
    };

    this.checkCameraPermission()
      .then(() => {
        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then((stream) => {
        this.videoStream = stream;
        video.srcObject = stream;

        video.onloadedmetadata = () => {
          video.play();
          this.scheduleScan(video, canvas, context);
        };
      })
      .catch((err) => {
        console.error("Erreur d'accès à la caméra:", err);
        if (err.name === 'NotAllowedError') {
          this.scanError = 'Permission refusée pour accéder à la caméra';
        } else if (err.name === 'NotFoundError') {
          this.scanError = 'Aucune caméra trouvée sur cet appareil';
        } else {
          this.scanError = `Impossible d'accéder à la caméra. ${err.message}`;
        }
        this.scanning = false;
      });
  }

  scheduleScan(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null
  ): void {
    if (!this.scanning) return;

    requestAnimationFrame(() => {
      this.performScan(video, canvas, context);
    });
  }

  performScan(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null
  ): void {
    if (video.readyState !== video.HAVE_ENOUGH_DATA || !this.scanning) {
      this.scheduleScan(video, canvas, context);
      return;
    }

    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code) {
          this.ngZone.run(() => {
            this.extractBookingFromQRCode(code.data);
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'analyse du QR code:", error);
      }
    }

    this.scheduleScan(video, canvas, context);
  }

  async checkCameraPermission(): Promise<void> {
    const permission = await Camera.requestPermissions();

    if (permission.camera !== 'granted') {
      throw new Error("Permission caméra refusée par l'utilisateur.");
    }
  }

  stopScanner(): void {
    this.scanning = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
  }

  extractBookingFromQRCode(token: string): void {
    this.stopScanner();

    this.bookingQrService
      .extractBookingFromQRCode(token)
      .pipe(
        tap((result) => {
          this.scanResult = result;
        })
      )
      .subscribe();
  }

  scanAgain(): void {
    this.scanning = false;
    this.scanResult = null;
  }

  ngOnDestroy(): void {
    this.stopScanner();
  }
}
