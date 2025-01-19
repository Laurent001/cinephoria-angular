import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { addIcons } from 'ionicons';
import { chevronBackSharp } from 'ionicons/icons';

import { IonIcon } from '@ionic/angular/standalone';
import { ScreeningResponse } from 'src/app/film/film';
import { ScreeningPage } from 'src/app/film/screenings/screening/screening.page';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [IonIcon, CommonModule, ScreeningPage],
  templateUrl: './slider.page.html',
  styleUrl: './slider.page.scss',
})
export class SliderPage {
  @Input() slides: ScreeningResponse[] = [];

  currentIndex = 0;
  visibleSlides = 3;

  constructor() {
    addIcons({
      chevronBackSharp,
    });
  }

  get totalSlides() {
    return this.slides.length;
  }

  next() {
    if (this.currentIndex < this.slides.length - this.visibleSlides) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
