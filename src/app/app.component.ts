import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Page, User } from './app';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class AppComponent implements OnInit {
  public pages$ = new BehaviorSubject<Page[]>([]);
  public showLogout = false;
  private roles: string[] = [];

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.translateService.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit() {
    const lang = 'fr';

    this.translateService
      .use(lang)
      .pipe(
        switchMap(() => {
          const token = this.authService.getToken();
          if (token) {
            return this.authService.getUserByToken(token);
          } else {
            return this.authService.user$;
          }
        })
      )
      .subscribe((user?: User) => {
        if (user) {
          this.authService.setUser(user);
          this.roles = [user.role];
          this.updatePages(this.roles);
          this.showLogout =
            this.roles.includes('admin') ||
            this.roles.includes('user') ||
            this.roles.includes('employee');
        } else {
          this.roles = ['guest'];
          this.updatePages(this.roles);
          this.showLogout = false;
        }
      });

    this.authService.user$.subscribe((user) => {
      this.roles = user ? [user.role] : ['guest'];
      this.updatePages(this.roles);
      this.showLogout =
        this.roles.includes('admin') ||
        this.roles.includes('user') ||
        this.roles.includes('employee');
    });
  }

  updatePages(roles: string[]) {
    const pages = [
      {
        title: this.translateService.instant('menu-home'),
        url: '/home',
        icon: 'house',
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
        icon: 'ticket-perforated',
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
        icon: 'box-arrow-in-right',
        roles: ['guest'],
      },
      {
        title: this.translateService.instant('menu-incident'),
        url: '/incident',
        icon: 'exclamation-octagon',
        roles: ['admin', 'employee'],
      },
      {
        title: roles.includes('admin')
          ? this.translateService.instant('menu-admin')
          : this.translateService.instant('menu-employee'),
        url: '/intranet',
        icon: roles.includes('admin') ? 'gear' : 'server',
        roles: ['admin', 'employee'],
      },
      {
        title: this.translateService.instant('menu-space'),
        url: '/space',
        icon: 'cloud',
        roles: ['user'],
      },
      {
        title: this.translateService.instant('menu-logout'),
        url: '/logout',
        icon: 'box-arrow-in-left',
        roles: ['admin', 'user', 'employee'],
      },
    ];

    const filteredPages = pages.filter((page) =>
      page.roles.some((role) => roles.includes(role))
    );
    this.pages$.next(filteredPages);
  }

  logout() {
    this.authService.resetUserToGuest();
    this.router.navigate(['/login']);
  }
}
