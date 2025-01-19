import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonRow,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, tap } from 'rxjs';
import { LayoutComponent } from 'src/app/layout/layout.component';
import { SliderPage } from 'src/app/utils/slider/slider.page';
import { ScreeningsFilmResponse } from '../film';
import { FilmService } from '../film.service';

@Component({
  selector: 'app-screenings',
  templateUrl: './screenings.page.html',
  styleUrls: ['./screenings.page.scss'],
  standalone: true,
  imports: [
    IonCard,
    IonContent,
    IonList,
    IonItem,
    IonRow,
    IonCol,
    IonGrid,
    IonThumbnail,
    IonItem,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonContent,
    CommonModule,
    FormsModule,
    TranslateModule,
    LayoutComponent,
    SliderPage,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScreeningPage implements OnInit {
  filmId?: number;
  screeningsFilm$?: Observable<ScreeningsFilmResponse>;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private filmService: FilmService
  ) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.filmId = +params['id'];
      this.screeningsFilm$ = this.filmService
        .getScreeningsByFilmId(this.filmId)
        .pipe(tap((screenings) => console.log('Screenings:', screenings)));
    });
  }
}
