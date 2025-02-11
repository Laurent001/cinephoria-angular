import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonGrid,
  IonItem,
  IonList,
  IonRow,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.page.html',
  styleUrls: ['./intranet.page.scss'],
  standalone: true,
  imports: [
    IonGrid,
    IonItem,
    IonList,
    IonRow,
    IonContent,
    CommonModule,
    FormsModule,
    LayoutComponent,
    TranslateModule,
  ],
})
export class IntranetPage implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {}
}
