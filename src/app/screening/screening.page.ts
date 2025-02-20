import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  LOCALE_ID,
  OnInit,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SeatResponse } from '../booking/seat/seat';
import { SeatService } from '../booking/seat/seat.service';
import { RemoveTrailingZerosPipe } from '../utils/pipes/removeTrailingZeros.pipe';
import { ScreeningResponse } from './screening';

@Component({
  selector: 'app-screening',
  standalone: true,
  templateUrl: './screening.page.html',
  styleUrls: ['./screening.page.scss'],
  imports: [CommonModule, TranslateModule, RemoveTrailingZerosPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class ScreeningPage implements OnInit {
  @Input() screening?: ScreeningResponse;
  @Input() seatsSelected?: SeatResponse[] = [];

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit(): void {}
}
