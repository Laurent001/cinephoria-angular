import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { FilmResponse } from '../film/film';
import { FilmService } from '../film/film.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
})
export class HomePage {
  protected films$: Observable<FilmResponse[]>;

  constructor(private filmService: FilmService) {
    this.films$ = this.filmService.getFilms();
  }
}
