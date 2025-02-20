import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.component.html',
  styleUrls: ['./intranet.component.scss'],
  standalone: true,
  imports: [FormsModule, TranslateModule],
})
export class IntranetComponent implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {}
}
