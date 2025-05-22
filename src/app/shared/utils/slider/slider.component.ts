import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
import { Booking } from 'src/app/booking/booking';
import { BookingStateService } from 'src/app/booking/bookingState/booking-state.service';
import { SeatResponse } from 'src/app/booking/seat/seat';
import {} from 'src/app/film/film';
import {
  Screening,
  ScreeningsByDayResponse,
  ScreeningsByFilmResponse,
} from 'src/app/screening/screening';
import { ScreeningComponent } from 'src/app/screening/screening.component';
import { ScreeningService } from 'src/app/screening/screening.service';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, ScreeningComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent {
  @Input() screenings?: ScreeningsByFilmResponse;
  @Output() screeningSelected = new EventEmitter<Screening>();
  selectedScreening?: Screening;
  seatsSelected?: SeatResponse[];
  booking?: Booking;
  visibleDays: Date[] = [];
  currentIndex = 0;
  visibleDaysCount = 3;
  selectedDayScreenings: Screening[] | null = null;
  selectedDay?: Date;

  constructor(
    private screeningService: ScreeningService,
    private bookingStateService: BookingStateService
  ) {}

  ngOnInit() {
    const bookingState = localStorage.getItem('bookingState');
    if (bookingState) {
      this.booking = JSON.parse(bookingState) as Booking;
      this.seatsSelected = this.booking.seats;
    }

    const selectedScreening =
      this.booking?.screening || this.screenings?.screeningSelected;

    if (this.screenings?.screenings) {
      const allDays: string[] = Array.from(
        new Set(
          this.screenings.screenings.flatMap(
            (screeningByDay: ScreeningsByDayResponse) =>
              screeningByDay.screeningsByDay.map((screening: Screening) => {
                const date = new Date(screening.start_time);
                return date.toISOString().split('T')[0];
              })
          )
        )
      ).sort();

      if (selectedScreening) {
        const selectedDateStr = new Date(selectedScreening.start_time)
          .toISOString()
          .split('T')[0];
        const selectedIndex = allDays.findIndex(
          (day) => day === selectedDateStr
        );

        if (selectedIndex !== -1) {
          this.currentIndex = Math.max(
            0,
            Math.min(selectedIndex, allDays.length - this.visibleDaysCount)
          );
        }
      }

      this.updateVisibleDays();
      const selectedDay = selectedScreening
        ? new Date(new Date(selectedScreening.start_time).toDateString())
        : new Date(allDays[0] + 'T00:00:00Z');

      this.onDayClick(selectedDay);
    }
  }

  updateVisibleDays() {
    if (!this.screenings?.screenings) return;

    const allDays: string[] = Array.from(
      new Set(
        this.screenings.screenings.flatMap(
          (screeningByDay: ScreeningsByDayResponse) =>
            screeningByDay.screeningsByDay.map((screening: Screening) => {
              const date = new Date(screening.start_time);
              return date.toISOString().split('T')[0];
            })
        )
      )
    ).sort();

    this.visibleDays = allDays
      .slice(this.currentIndex, this.currentIndex + this.visibleDaysCount)
      .map((day) => new Date(day + 'T00:00:00Z'));
  }

  isScreeningVisible(screening: Screening): boolean {
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

  selectScreening(screening: Screening) {
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
        this.screenings.screenings.map((screening) => {
          const date = new Date(screening.day);
          return date.toISOString().split('T')[0];
        })
      ),
    ];
    return this.currentIndex + this.visibleDaysCount < uniqueDays.length;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
