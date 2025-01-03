import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutComponent } from '../layout/layout.component';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, LayoutComponent],
})
export class HomePage {
  message = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getHello().subscribe({
      next: (response) => {
        this.message = response.message;
      },
      error: (error) => {
        console.error('Erreur lors de la requête:', error);
      },
      complete: () => {
        console.log('Observable complété');
      },
    });
  }
}
