import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeatResponse } from './seat';

@Component({
  selector: 'app-seat',
  templateUrl: './seat.component.html',
  styleUrls: ['./seat.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SeatComponent implements OnInit {
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
