import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ChartDataset, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { FilmResponse } from 'src/app/film/film';
import { FilmService } from 'src/app/film/film.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [BaseChartDirective, CommonModule, TranslateModule],
})
export class DashboardComponent {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: string[] = this.getLastSevenDaysLabels();
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public selectedFilm: number = 1;

  public films: FilmResponse[] = [];

  public barChartData: ChartDataset[] = [{ data: [], label: 'Bookings' }];

  constructor(
    private translateService: TranslateService,
    private dashboardService: DashboardService,
    private filmService: FilmService
  ) {
    this.updateChartData();
  }

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms() {
    this.filmService.getFilms().subscribe(
      (films: FilmResponse[]) => {
        this.films = films;
        if (this.films.length > 0) {
          this.selectedFilm = this.films[0].id!;
          this.updateChartData();
        }
      },
      (error) => console.error('Error loading films:', error)
    );
  }

  getLastSevenDaysLabels(): string[] {
    const labels = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      labels.push(date.toLocaleDateString());
    }
    return labels;
  }

  updateChartData(): void {
    this.dashboardService
      .getLast7DaysBookingsByFilmId(this.selectedFilm)
      .subscribe(
        (bookings) => {
          const bookingCounts = this.calculateBookingCounts(bookings);
          const selectedFilmTitle =
            this.films.find((f) => f.id === this.selectedFilm)?.title || '';
          this.barChartData = [
            {
              data: bookingCounts,
              label: `${this.translateService.instant(
                'dashboard-booking'
              )} ${selectedFilmTitle}`,
            },
          ];
        },
        (error) => console.error('Error updating chart data:', error)
      );
  }

  calculateBookingCounts(bookings: any[]): number[] {
    const counts = Array(7).fill(0);
    const today = new Date();
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.timestamp);
      const daysAgo = Math.floor(
        (today.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24)
      );
      if (daysAgo >= 0 && daysAgo < 7) {
        counts[6 - daysAgo]++;
      }
    });
    return counts;
  }

  onFilmSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedFilm = Number(selectElement.value);
    this.updateChartData();
  }
}
