import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LayoutComponent],
})
export class HomePage implements OnInit {
  protected message = 'angular content';

  constructor(private http: HttpClient, private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getHello().subscribe({
      next: (data) => {
        this.message = data.message;
      },
      error: (error) => {
        console.error('An error occurred:', error);
      },
    });
  }
}
