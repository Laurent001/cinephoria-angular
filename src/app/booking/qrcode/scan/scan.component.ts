// scan-ticket.component.ts (Version adaptée pour mobile)
import { Platform } from '@angular/cdk/platform';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import jsQR from 'jsqr';
import { catchError, of, tap } from 'rxjs';
import { QRCodeService } from '../qrcode.service';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class ScanTicketComponent implements OnInit {
  @ViewChild('video') videoElement!: ElementRef;
  @ViewChild('canvas') canvasElement!: ElementRef;

  videoStream?: MediaStream;
  scanning = false;
  scanResult: any;
  scanError!: string | null;
  isMobile: boolean;

  // Liste des contraintes de caméra pour Android
  videoConstraints = {
    facingMode: { ideal: 'environment' },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  };

  constructor(
    private bookingQrService: QRCodeService,
    private platform: Platform,
    private ngZone: NgZone
  ) {
    // Détecter si on est sur mobile
    this.isMobile = this.platform.ANDROID || this.platform.IOS;
  }

  ngOnInit(): void {}

  startScanner(): void {
    this.scanning = true;
    this.scanResult = null;
    this.scanError = null;

    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    // Ajout des contraintes spécifiques pour mobile
    let constraints = {
      video: this.isMobile
        ? this.videoConstraints
        : { facingMode: 'environment' },
      audio: false,
    };

    // Vérification des permissions sur Android
    this.checkCameraPermission()
      .then(() => {
        return navigator.mediaDevices.getUserMedia(constraints);
      })
      .then((stream) => {
        this.videoStream = stream;
        video.srcObject = stream;

        // Gestionnaire d'événements de chargement pour résoudre les problèmes de lecture vidéo
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

  // Vérifier les permissions de caméra (particulièrement important sur Android)
  checkCameraPermission(): Promise<void> {
    if (!this.isMobile || !navigator.permissions) {
      return Promise.resolve();
    }

    return navigator.permissions
      .query({ name: 'camera' as PermissionName })
      .then((result) => {
        if (result.state === 'denied') {
          throw new Error('Permission caméra refusée');
        }
      });
  }

  // Programmer le scan pour éviter les problèmes de performance
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

  // Effectuer le scan d'image de la caméra
  performScan(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D | null
  ): void {
    if (video.readyState !== video.HAVE_ENOUGH_DATA || !this.scanning) {
      // Réessayer si la vidéo n'est pas prête
      this.scheduleScan(video, canvas, context);
      return;
    }

    // Ajuster la taille du canvas à la vidéo
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    // Dessiner l'image actuelle
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Analyser l'image pour trouver un QR code
    try {
      if (context) {
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        // QR code détecté
        if (code) {
          this.ngZone.run(() => {
            this.verifyQrCode(code.data);
          });
        }
        return;
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse du QR code:", error);
    }

    // Continuer le scan si aucun code n'est détecté
    this.scheduleScan(video, canvas, context);
  }

  stopScanner(): void {
    this.scanning = false;
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
  }

  verifyQrCode(token: string): void {
    this.stopScanner();

    this.bookingQrService
      .verifyQRCode(token)
      .pipe(
        tap((result) => {
          console.log('result : ', result);
          this.scanResult = result;
          if (this.isMobile && navigator.vibrate) {
            navigator.vibrate(result.valid ? [100] : [100, 50, 100]);
          }
          this.playSound(result.valid);
        }),
        catchError((error) => {
          console.error('Erreur de vérification:', error);
          this.scanError = 'Erreur lors de la vérification du QR code';
          return of(null);
        })
      )
      .subscribe();
  }

  playSound(isValid: boolean): void {
    try {
      const audio = new Audio();
      audio.src = isValid
        ? 'assets/sounds/valid.mp3'
        : 'assets/sounds/invalid.mp3';
      audio.load();
      audio
        .play()
        .catch((error) => console.error('Erreur de lecture audio:', error));
    } catch (error) {
      console.error('Erreur lors de la lecture du son:', error);
    }
  }

  scanAgain(): void {
    this.startScanner();
  }

  // Pour éviter les fuites de mémoire
  ngOnDestroy(): void {
    this.stopScanner();
  }
}
