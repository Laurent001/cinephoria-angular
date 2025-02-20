import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {} from '../film/film';
import {
  ScreeningResponse,
  ScreeningsByFilmResponse,
} from '../screening/screening';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private snackBar: MatSnackBar) {}

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

  findScreeningById(
    screeningIdSelected?: number,
    screenings?: ScreeningsByFilmResponse
  ): ScreeningResponse | undefined {
    if (screeningIdSelected === undefined || screenings === undefined) {
      return undefined;
    }

    for (const day of screenings.screenings) {
      const screening = day.screeningsByDay.find(
        (screening) => screening.id === screeningIdSelected
      );
      if (screening) {
        return screening;
      }
    }

    return undefined;
  }
}
