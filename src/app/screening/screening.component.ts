import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  LOCALE_ID,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SeatResponse } from '../booking/seat/seat';
import { RemoveTrailingZerosPipe } from '../utils/pipes/removeTrailingZeros.pipe';
import { Screening } from './screening';

@Component({
  selector: 'app-screening',
  standalone: true,
  templateUrl: './screening.component.html',
  styleUrls: ['./screening.component.scss'],
  imports: [CommonModule, TranslateModule, RemoveTrailingZerosPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class ScreeningComponent {
  @Input() screening?: Screening;
  @Input() seatsSelected?: SeatResponse[] = [];
}
