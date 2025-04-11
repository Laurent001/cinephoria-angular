import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Role } from '../app';
import { AuthService } from '../auth/auth.service';
import { AuditoriumsComponent } from './auditoriums/auditoriums.component';
import { EmployeesComponent } from './employees/employees.component';
import { FilmsComponent } from './films/films.component';
import { OpinionsComponent } from './opinions/opinions.component';
import { ScreeningsComponent } from './screenings/screenings.component';
import { DashboardComponent } from '../utils/dashboard/dashboard.component';
import { ScanTicketComponent } from '../booking/qrcode/scan/scan.component';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ScreeningsComponent,
    FilmsComponent,
    AuditoriumsComponent,
    OpinionsComponent,
    CommonModule,
    EmployeesComponent,
    DashboardComponent,
    ScanTicketComponent,
  ],
})
export class IntranetComponent implements OnInit {
  userRole: Role = { id: 0, name: 'guest' } as Role;
  ROLE_ADMIN = 1;
  ROLE_STAFF = 2;
  ROLE_USER = 3;

  constructor(
    private translate: TranslateService,
    private authService: AuthService
  ) {
    this.translate.setDefaultLang('fr');
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userRole = user.role;
    }
  }

  ngOnInit() {}
}
