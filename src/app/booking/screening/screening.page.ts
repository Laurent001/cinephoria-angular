import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ScreeningResponse } from 'src/app/film/film';
import { SeatResponse } from './screening';
@Component({
  selector: 'app-screening',
  standalone: true,
  templateUrl: './screening.page.html',
  styleUrls: ['./screening.page.scss'],
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreeningPage {
  readonly screening = input<ScreeningResponse>();
  readonly totalPrice = input<number>();
  readonly seatsSelected = input<SeatResponse[]>([]);

  constructor(private translate: TranslateService) {}
}
