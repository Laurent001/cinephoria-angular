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
import { Observable } from 'rxjs';
import { SeatResponse, SeatsScreeningResponse } from '../booking/seat/seat';
import { SeatService } from '../booking/seat/seat.service';
import { ScreeningResponse } from './screening';

@Component({
  selector: 'app-screening',
  standalone: true,
  templateUrl: './screening.page.html',
  styleUrls: ['./screening.page.scss'],
  imports: [CommonModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }],
})
export class ScreeningPage implements OnInit {
  @Input() screening?: ScreeningResponse;
  @Input() seatsSelected?: SeatResponse[] = [];
  @Input() totalPrice?: number = 0;
  seatsScreening$?: Observable<SeatsScreeningResponse>;

  constructor(
    private translate: TranslateService,
    private seatService: SeatService
  ) {
    this.translate.setDefaultLang('fr');
    registerLocaleData(localeFr);
  }

  ngOnInit(): void {}
}
