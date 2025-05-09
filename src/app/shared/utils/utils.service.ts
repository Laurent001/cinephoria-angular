import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import {
  Screening,
  ScreeningsByFilmResponse,
} from 'src/app/screening/screening';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(
    private snackBar: MatSnackBar,
    private modal: MatDialog,
    private http: HttpClient
  ) {}

  presentAlert(
    header: string,
    message: string,
    buttons: string[],
    type?: 'success' | 'error' | 'warn'
  ) {
    const fullMessage = header ? `${header}: ${message}` : message;
    const action = buttons && buttons.length > 0 ? buttons[0] : 'OK';

    let panelClass: string[];
    switch (type) {
      case 'success':
        panelClass = ['snackbar-success'];
        break;
      case 'error':
        panelClass = ['snackbar-error'];
        break;
      case 'warn':
        panelClass = ['snackbar-warn'];
        break;
      default:
        panelClass = ['snackbar-success'];
    }

    this.snackBar.open(fullMessage, action, {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: panelClass,
    });
  }

  openConfirmModal(
    header: string,
    message: string,
    buttons: string[]
  ): Observable<boolean> {
    const modalRef = this.modal.open(ConfirmModalComponent, {
      data: { header, message, buttons },
    });

    return modalRef.afterClosed();
  }

  findScreeningById(
    screeningIdSelected?: number,
    screenings?: ScreeningsByFilmResponse
  ): Screening | undefined {
    if (screeningIdSelected === undefined || screenings === undefined) {
      return undefined;
    }

    for (const day of screenings.screenings) {
      const screening = day.screeningsByDay.find(
        (screening: Screening) => screening.id === screeningIdSelected
      );
      if (screening) {
        return screening;
      }
    }

    return undefined;
  }

  createFormData(data: any): FormData {
    const formData = new FormData();

    const buildFormData = (data: any, parentKey?: string) => {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const value = data[key];
          const fullKey = parentKey ? `${parentKey}[${key}]` : key;

          if (value !== null && value !== undefined) {
            if (value instanceof File) {
              formData.append(fullKey, value, value.name);
            } else if (typeof value === 'object') {
              buildFormData(value, fullKey);
            } else {
              formData.append(fullKey, value.toString());
            }
          }
        }
      }
    };

    buildFormData(data);
    return formData;
  }
}
