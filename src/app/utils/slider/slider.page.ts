import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
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
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage {
  @Input() screenings?: ScreeningsByFilmResponse;
  @Output() screeningSelected = new EventEmitter<ScreeningResponse>();
  selectedScreening?: ScreeningResponse;
  seatsSelected?: SeatResponse[];
  booking?: Booking;
  visibleDays: Date[] = [];
  currentIndex = 0;
  visibleDaysCount = 3;
  selectedDayScreenings: ScreeningResponse[] | null = null;
  selectedDay?: Date;

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

    this.updateVisibleDays();
  }

  onDayClick(day: Date) {
    const selectedScreeningByDay = this.screenings?.screenings.find(
      (screeningByDay) =>
        new Date(screeningByDay.day).toDateString() === day.toDateString()
    );

    this.selectedDayScreenings = selectedScreeningByDay
      ? selectedScreeningByDay.screeningsByDay
      : null;

    this.selectedDay = day;
  }

  updateVisibleDays() {
    if (this.screenings?.screenings) {
      const uniqueDays = [
        ...new Set(
          this.screenings.screenings.map((screeningByDay) => {
            const date = new Date(screeningByDay.day);
            return date.toISOString().split('T')[0];
          })
        ),
      ];
      this.visibleDays = uniqueDays
        .slice(this.currentIndex, this.currentIndex + this.visibleDaysCount)
        .map((day) => new Date(day));
    }
  }

  next() {
    if (this.hasMoreDays) {
      this.currentIndex++;
      this.updateVisibleDays();
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleDays();
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

  get hasMoreDays(): boolean {
    if (!this.screenings?.screenings) return false;
    const uniqueDays = [
      ...new Set(
        this.screenings.screenings.map((screeningByDay) => {
          const date = new Date(screeningByDay.day);
          return date.toISOString().split('T')[0];
        })
      ),
    ];
    return this.currentIndex + this.visibleDaysCount < uniqueDays.length;
  }
}
