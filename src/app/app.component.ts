import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
import {
  alertSharp,
  cloudSharp,
  constructSharp,
  filmSharp,
  gitNetworkSharp,
  homeSharp,
  logInSharp,
  logOutSharp,
  peopleSharp,
  ticketSharp,
} from 'ionicons/icons';
import { BehaviorSubject } from 'rxjs';
import { Page } from './app';
import { AuthService } from './auth/auth.service';

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
  public pages$ = new BehaviorSubject<Page[]>([]);
  public showLogout = false;

  updatePages(roles: string[]) {
    const pages = [
      {
        title: this.translateService.instant('menu-home'),
        url: '/home',
        icon: 'home',
        roles: ['admin', 'user', 'employee', 'guest'],
      },
      {
        title: this.translateService.instant('menu-film'),
        url: '/film',
        icon: 'film',
        roles: ['admin', 'user', 'employee', 'guest'],
      },
      {
        title: this.translateService.instant('menu-booking'),
        url: '/booking',
        icon: 'ticket',
        roles: ['admin', 'user', 'employee', 'guest'],
      },
      {
        title: this.translateService.instant('menu-contact'),
        url: '/contact',
        icon: 'people',
        roles: ['user', 'guest'],
      },
      {
        title: this.translateService.instant('menu-login'),
        url: '/login',
        icon: 'log-in',
        roles: ['guest'],
      },
      {
        title: this.translateService.instant('menu-incident'),
        url: '/incident',
        icon: 'alert',
        roles: ['admin', 'employee'],
      },
      {
        title: this.translateService.instant('menu-intranet'),
        url: '/intranet',
        icon: 'git-network',
        roles: ['admin', 'employee'],
      },
      {
        title: this.translateService.instant('menu-admin'),
        url: '/admin',
        icon: 'construct',
        roles: ['admin'],
      },
      {
        title: this.translateService.instant('menu-espace'),
        url: '/space',
        icon: 'cloud',
        roles: ['user'],
      },
      {
        title: this.translateService.instant('menu-logout'),
        url: '/logout',
        icon: 'log-out',
        roles: ['admin', 'user', 'employee'],
      },
    ];

    const filteredPages = pages.filter((page) =>
      page.roles.some((role) => roles.includes(role))
    );
    this.pages$.next(filteredPages);
  }

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      homeSharp,
      filmSharp,
      ticketSharp,
      peopleSharp,
      logInSharp,
      logOutSharp,
      alertSharp,
      gitNetworkSharp,
      constructSharp,
      cloudSharp,
    });
  }

  ngOnInit() {
    const lang = 'fr';
    this.translateService.use(lang).subscribe(() => {
      this.authService.user$.subscribe((user) => {
        const roles = user ? [user.role] : ['guest'];
        this.updatePages(roles);
        this.showLogout =
          roles.includes('admin') ||
          roles.includes('user') ||
          roles.includes('employee');
      });
    });
  }

  logout() {
    this.authService.resetUserToGuest();
    this.router.navigate(['/login']);
  }
}
