import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Page, Role, User } from './app';
import { AuthService } from './auth/auth.service';
import { CinemaService } from './film/cinema.service';
import { OpeningHoursResponse } from './utils/utils';
import { UtilsService } from './utils/utils.service';

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
  private roles: Role[] = [];
  public openings_hours: OpeningHoursResponse[] = [];
  public currentDay: number = new Date().getDay();
  public cinemaSelectedByUser: boolean = false;

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router,
    private utilsService: UtilsService,
    private cinemaService: CinemaService
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
            this.roles.some((role) => role.name === 'admin') ||
            this.roles.some((role) => role.name === 'user') ||
            this.roles.some((role) => role.name === 'staff');
        } else {
          this.roles = [{ id: 0, name: 'guest' }];
          this.updatePages(this.roles);
          this.showLogout = false;
        }
      });

    this.authService.user$.subscribe((user) => {
      this.roles = user ? [user.role] : [{ id: 0, name: 'guest' }];
      this.updatePages(this.roles);
      this.showLogout =
        this.roles.some((role) => role.name === 'admin') ||
        this.roles.some((role) => role.name === 'user') ||
        this.roles.some((role) => role.name === 'staff');
    });

    this.cinemaService.cinemaId$.subscribe((cinemaId) => {
      if (cinemaId)
        this.getOpeningHours(cinemaId).subscribe(
          (data: OpeningHoursResponse[]) => {
            this.openings_hours = data;
            this.cinemaSelectedByUser = true;
          }
        );
      else this.cinemaSelectedByUser = false;
    });
  }

  updatePages(roles: Role[]) {
    const pages = [
      {
        title: this.translateService.instant('menu-home'),
        url: '/home',
        icon: 'house',
        roles: [
          { id: 0, name: 'guest' },
          { id: 1, name: 'admin' },
          { id: 2, name: 'staff' },
          { id: 3, name: 'user' },
        ],
      },
      {
        title: this.translateService.instant('menu-film'),
        url: '/film',
        icon: 'film',
        roles: [
          { id: 0, name: 'guest' },
          { id: 1, name: 'admin' },
          { id: 2, name: 'staff' },
          { id: 3, name: 'user' },
        ],
      },
      {
        title: this.translateService.instant('menu-booking'),
        url: '/booking',
        icon: 'ticket-perforated',
        roles: [
          { id: 0, name: 'guest' },
          { id: 1, name: 'admin' },
          { id: 2, name: 'staff' },
          { id: 3, name: 'user' },
        ],
      },
      {
        title: this.translateService.instant('menu-contact'),
        url: '/contact',
        icon: 'people',
        roles: [
          { id: 0, name: 'guest' },
          { id: 3, name: 'user' },
        ],
      },
      {
        title: this.translateService.instant('menu-login'),
        url: '/login',
        icon: 'box-arrow-in-right',
        roles: [{ id: 0, name: 'guest' }],
      },
      {
        title: this.translateService.instant('menu-incident'),
        url: '/incident',
        icon: 'exclamation-octagon',
        roles: [
          { id: 1, name: 'admin' },
          { id: 2, name: 'staff' },
        ],
      },
      {
        title: roles.some((role) => role.name === 'admin')
          ? this.translateService.instant('menu-admin')
          : this.translateService.instant('menu-intranet'),
        url: '/intranet',
        icon: roles.some((role) => role.name === 'admin') ? 'gear' : 'server',
        roles: [
          { id: 1, name: 'admin' },
          { id: 2, name: 'staff' },
        ],
      },
      {
        title: this.translateService.instant('menu-space'),
        url: '/space',
        icon: 'cloud',
        roles: [{ id: 3, name: 'user' }],
      },
      {
        title: this.translateService.instant('menu-logout'),
        url: '/logout',
        icon: 'box-arrow-in-left',
        roles: [
          { id: 1, name: 'admin' },
          { id: 2, name: 'staff' },
          { id: 3, name: 'user' },
        ],
      },
    ];

    const filteredPages = pages
      .filter((page) =>
        page.roles.some((role) => roles.map((r) => r.name).includes(role.name))
      )
      .map((page) => ({
        ...page,
        roles: page.roles.map((role) => role.name),
      }));
    this.pages$.next(filteredPages);
  }

  logout() {
    this.authService.resetUserToGuest();
    this.router.navigate(['/login']);
  }

  getOpeningHours(cinemaId: number) {
    return this.utilsService.getOpeningHours(cinemaId);
  }

  formatTime(time: string): string {
    return time.slice(0, 5);
  }
}
