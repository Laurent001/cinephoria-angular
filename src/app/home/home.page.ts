import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  IonTitle,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LayoutComponent } from '../layout/layout.component';
import { FilmsResponse } from './home';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonCol,
    IonTitle,
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
  ],
})
export class HomePage {
  protected films$: Observable<FilmsResponse[]>;

  constructor(private http: HttpClient, private homeService: HomeService) {
    this.films$ = this.homeService.getFilms();
  }
}
