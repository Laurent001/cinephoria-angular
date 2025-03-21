import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuditoriumsComponent } from './auditoriums/auditoriums.component';
import { FilmsComponent } from './films/films.component';
import { OpinionsComponent } from './opinions/opinions.component';
import { ScreeningsComponent } from './screenings/screenings.component';

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
  ],
})
export class IntranetComponent implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {}
}
