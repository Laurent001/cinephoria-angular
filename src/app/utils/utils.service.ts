import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {} from '../film/film';
import {
  ScreeningResponse,
  ScreeningsByFilmResponse,
} from '../screening/screening';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private alertController: AlertController) {}

  async presentAlert(header: string, message: string, buttons: string[]) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: buttons,
    });
    await alert.present();
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
