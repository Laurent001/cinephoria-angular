import { CommonModule } from '@angular/common';
import { Component, OnInit, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeatResponse } from '../screening/screening';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.page.html',
  styleUrls: ['./seat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SeatPage implements OnInit {
  readonly seat = input<SeatResponse>();
  readonly isSelected = input<boolean>(false);

  constructor() {}

  ngOnInit() {}

  getSeatClass(): string {
    const seat = this.seat();
    if (!seat) return '';

    return this.isSelected()
      ? 'selected'
      : seat.is_available
      ? 'available'
      : 'booked';
  }
}
