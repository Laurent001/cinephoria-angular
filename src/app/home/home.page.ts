import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonRow,
  IonThumbnail,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';
import { FilmsResponse, UsersResponse } from './home';
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
export class HomePage implements OnInit {
  protected message = 'angular content';
  protected users: UsersResponse[] = [];
  protected films: FilmsResponse[] = [];

  constructor(private http: HttpClient, private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getHello().subscribe({
      next: (data) => {
        this.message = data.message;
      },
      error: (error) => {
        console.error('An error occurred:', error);
      },
    });

    this.homeService.getFilms().subscribe({
      next: (data: FilmsResponse[]) => {
        this.films = data;
      },
      error: (error) => {
        console.error('An error occurred:', error);
      },
    });
  }
}
