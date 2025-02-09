import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import {} from '../film/film';
import {
  ScreeningsByFilmResponse,
  ScreeningResponse,
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
    return screenings.screenings.find(
      (screening) => screening.id === screeningIdSelected
    );
  }
}
