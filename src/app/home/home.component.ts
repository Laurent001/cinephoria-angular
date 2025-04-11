import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BarRatingModule } from 'ngx-bar-rating';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FilmResponse } from '../film/film';
import { FilmService } from '../film/film.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, BarRatingModule],
})
export class HomeComponent {
  protected films$: Observable<FilmResponse[]>;
  environment = environment;
  imagesPath = environment.url + '/images/';

  constructor(
    private filmService: FilmService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('fr');
    this.films$ = this.filmService.getFilms();
  }
}
