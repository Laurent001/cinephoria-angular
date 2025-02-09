import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeatResponse } from './seat';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.page.html',
  styleUrls: ['./seat.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SeatPage implements OnInit {
  @Input() seat?: SeatResponse;
  @Input() isSelected?: boolean;

  constructor() {}

  ngOnInit() {}

  getSeatClass(): string {
    if (!this.seat) return '';

    return this.isSelected
      ? 'selected'
      : this.seat.is_available
      ? 'available'
      : 'booked';
  }
}
