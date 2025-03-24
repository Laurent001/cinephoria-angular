import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuditoriumsComponent } from './auditoriums/auditoriums.component';
import { FilmsComponent } from './films/films.component';
import { OpinionsComponent } from './opinions/opinions.component';
import { ScreeningsComponent } from './screenings/screenings.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { EmployeesComponent } from './employees/employees.component';

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
  ],
})
export class IntranetComponent implements OnInit {
  userRole: string = 'guest';

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
