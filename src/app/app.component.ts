import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterLink,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular/standalone';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { homeSharp } from 'ionicons/icons';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonNote,
    IonLabel,
    IonRouterLink,
    RouterModule,
    TranslateModule,
    CommonModule,
  ],
})
export class AppComponent implements OnInit {
  public pages$ = new BehaviorSubject<any[]>([]);
  updatePages() {
    const pages = [
      {
        title: this.translateService.instant('menu-home'),
        url: '/home',
        icon: 'home',
      },
    ];
    this.pages$.next(pages);
  }

  constructor(private translateService: TranslateService) {
    addIcons({
      homeSharp,
    });
  }

  ngOnInit() {
    const lang = 'fr';
    this.translateService.use(lang).subscribe(() => {
      this.updatePages();
    });
  }
}
