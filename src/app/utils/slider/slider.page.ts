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
  ScreeningsByDayResponse,
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

    if (this.visibleDays.length > 0) {
      this.onDayClick(this.visibleDays[0]);
    }
  }

  updateVisibleDays() {
    if (this.screenings?.screenings) {
      const screeningsResponse: ScreeningsByFilmResponse = this.screenings;
      const uniqueDays: string[] = Array.from(
        new Set(
          screeningsResponse.screenings.flatMap(
            (screeningByDay: ScreeningsByDayResponse) =>
              screeningByDay.screeningsByDay.map(
                (screening: ScreeningResponse) => {
                  const date = new Date(screening.start_time);
                  return date.toISOString().split('T')[0];
                }
              )
          )
        )
      ).sort();

      this.visibleDays = uniqueDays
        .slice(this.currentIndex, this.currentIndex + this.visibleDaysCount)
        .map((day) => new Date(day + 'T00:00:00Z'));
    }

    this.onDayClick(this.visibleDays[0]);
  }

  isScreeningVisible(screening: ScreeningResponse): boolean {
    if (!this.selectedDay) return false;
    const screeningDate = new Date(screening.start_time);
    return this.visibleDays.some(
      (day) => day.toDateString() === screeningDate.toDateString()
    );
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

  next() {
    if (this.hasMoreDays) {
      const currentSelectedDay = this.selectedDay;
      this.currentIndex++;
      this.updateVisibleDays();

      if (currentSelectedDay) {
        const stillVisibleDay = this.visibleDays.find(
          (day) => day.toDateString() === currentSelectedDay.toDateString()
        );

        if (stillVisibleDay) {
          this.onDayClick(stillVisibleDay);
        } else {
          this.selectFirstVisibleDay();
        }
      } else {
        this.selectFirstVisibleDay();
      }
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      const currentSelectedDay = this.selectedDay;
      this.currentIndex--;
      this.updateVisibleDays();

      if (currentSelectedDay) {
        const stillVisibleDay = this.visibleDays.find(
          (day) => day.toDateString() === currentSelectedDay.toDateString()
        );

        if (stillVisibleDay) {
          this.onDayClick(stillVisibleDay);
        } else {
          this.selectLastVisibleDay();
        }
      } else {
        this.selectLastVisibleDay();
      }
    }
  }

  private selectLastVisibleDay() {
    if (this.visibleDays.length > 0) {
      this.onDayClick(this.visibleDays[this.visibleDays.length - 1]);
    }
  }

  private selectFirstVisibleDay() {
    if (this.visibleDays.length > 0) {
      this.onDayClick(this.visibleDays[0]);
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
