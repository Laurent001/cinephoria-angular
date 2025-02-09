import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { addIcons } from 'ionicons';
import { chevronBackSharp } from 'ionicons/icons';
import { Booking } from 'src/app/booking/booking';
import { BookingStateService } from 'src/app/booking/bookingState/booking-state.service';
import { SeatResponse } from 'src/app/booking/seat/seat';
import {} from 'src/app/film/film';
import {
  ScreeningResponse,
  ScreeningsByFilmResponse,
} from 'src/app/screening/screening';
import { ScreeningPage } from 'src/app/screening/screening.page';
import { ScreeningService } from 'src/app/screening/screening.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, ScreeningPage],
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage {
  @Input() screenings?: ScreeningsByFilmResponse;
  @Output() screeningSelected = new EventEmitter<ScreeningResponse>();
  selectedScreening?: ScreeningResponse;
  seatsSelected?: SeatResponse[];
  booking?: Booking;
  currentIndex = 0;
  visibleScreenings = 3;

  constructor(
    private screeningService: ScreeningService,
    private bookingStateService: BookingStateService
  ) {
    addIcons({
      chevronBackSharp,
    });
  }

  ngOnInit() {
    const bookingState = localStorage.getItem('bookingState');
    if (bookingState) {
      this.booking = JSON.parse(bookingState) as Booking;
      this.seatsSelected = this.booking.seats;
    }
  }

  get totalScreenings() {
    return this.screenings?.screenings.length || 0;
  }

  next() {
    const screenings = this.screenings;
    if (
      screenings?.screenings.length &&
      this.currentIndex < screenings.screenings.length - this.visibleScreenings
    ) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  selectScreening(screening: ScreeningResponse) {
    if (this.booking) {
      this.booking.screening = screening;
      this.bookingStateService.setBookingState(this.booking);
    }
    if (this.screenings) {
      this.screenings.screeningSelected = screening;
      this.selectedScreening = screening;
    }

    this.screeningSelected.emit(screening);
  }
}
