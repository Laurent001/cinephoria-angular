import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScreeningsComponent } from './screenings/screenings.component';
import { FilmsComponent } from './films/films.component';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss'],
  standalone: true,
  imports: [FormsModule, TranslateModule, ScreeningsComponent, FilmsComponent],
})
export class IntranetComponent implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {}
}
