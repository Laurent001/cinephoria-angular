import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-screening',
  standalone: true,
  templateUrl: './screening.page.html',
  styleUrls: ['./screening.page.scss'],
  imports: [CommonModule],
})
export class ScreeningPage {
  @Input() id!: number;
  @Input() auditorium_id!: number;
  @Input() start_time!: Date;
  @Input() end_time!: Date;
}
