import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, input } from '@angular/core';

import { addIcons } from 'ionicons';
import { chevronBackSharp } from 'ionicons/icons';
import { ScreeningResponse } from 'src/app/film/film';

import { ScreeningPage } from 'src/app/booking/screening/screening.page';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, ScreeningPage],
  templateUrl: './slider.page.html',
  styleUrl: './slider.page.scss',
})
export class SliderPage {
  readonly screenings = input<ScreeningResponse[]>([]);
  @Output() screeningSelected = new EventEmitter<ScreeningResponse>();

  currentIndex = 0;
  visibleScreenings = 3;
  selectedScreening: ScreeningResponse | null;

  constructor() {
    addIcons({
      chevronBackSharp,
    });
    this.selectedScreening = null;
  }

  get totalScreenings() {
    return this.screenings().length;
  }

  next() {
    if (this.currentIndex < this.screenings().length - this.visibleScreenings) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  selectScreening(screening: any) {
    this.selectedScreening = screening;
    this.screeningSelected.emit(screening);
  }
}
