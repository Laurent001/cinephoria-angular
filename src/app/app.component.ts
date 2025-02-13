import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
})
export class AppComponent implements OnInit {
  public pages$ = new BehaviorSubject<Page[]>([]);
  public showLogout = false;
  private roles: string[] = [];

  updatePages(roles: string[]) {
    const pages = [
      {
        title: this.translateService.instant('menu-home'),
        url: '/home',
        icon: 'house',
        roles: ['admin', 'user', 'employe', 'guest'],
      },
      {
        title: this.translateService.instant('menu-film'),
        url: '/film',
        icon: 'film',
        roles: ['admin', 'user', 'employe', 'guest'],
      },
      {
        title: this.translateService.instant('menu-booking'),
        url: '/booking',
        icon: 'ticket-perforated',
        roles: ['admin', 'user', 'employe', 'guest'],
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
        roles: ['admin', 'employe'],
      },
      {
        title: this.translateService.instant('menu-intranet'),
        url: '/intranet',
        icon: 'server',
        roles: ['admin', 'employe'],
      },
      {
        title: this.translateService.instant('menu-admin'),
        url: '/admin',
        icon: 'gear',
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
        icon: 'box-arrow-in-left',
        roles: ['admin', 'user', 'employe'],
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
  ) {}

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
            this.roles.includes('employe');
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
        this.roles.includes('employe');
    });
  }

  logout() {
    this.authService.resetUserToGuest();
    this.router.navigate(['/login']);
  }
}
