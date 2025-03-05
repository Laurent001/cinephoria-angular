import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FilmResponse } from '../film/film';
import { FilmService } from '../film/film.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
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
