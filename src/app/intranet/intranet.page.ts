import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-intranet',
  templateUrl: './intranet.page.html',
  styleUrls: ['./intranet.page.scss'],
  standalone: true,
  imports: [FormsModule, TranslateModule],
})
export class IntranetPage implements OnInit {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('fr');
  }

  ngOnInit() {}
}
