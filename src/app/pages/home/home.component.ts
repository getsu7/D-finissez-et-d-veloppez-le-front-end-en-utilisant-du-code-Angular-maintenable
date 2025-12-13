import { Component, OnDestroy, inject} from '@angular/core';
import {Router} from '@angular/router';
import Chart from 'chart.js/auto';
import {OlympicService, Olympic} from '../../core';
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);

  public pieChart!: Chart<'pie', number[], string>;
  public totalCountries = 0;
  public totalJOs = 0;
  public error: string | null = null;
  public isLoading = true;
  public titlePage = 'Medals per Country';

  constructor() {
    this.olympicService.loadInitialData()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data: Olympic[]) => {
          this.isLoading = false;
          if (data && data.length > 0) {
            this.totalJOs = this.olympicService.getTotalJOs();
            this.totalCountries = this.olympicService.getTotalCountries();
            const countries = this.olympicService.getCountryNames();
            const medalsPerCountry = this.olympicService.getMedalsPerCountry();
            this.buildPieChart(countries, medalsPerCountry);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Impossible de charger les données olympiques.';
        }
      })
  }

  ngOnDestroy(): void {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
  }

  private buildPieChart(countries: string[], medalsPerCountry: number[]): void {
    const pieChart = new Chart('DashboardPieChart', {
      type: 'pie',
      data: {
        labels: countries,
        datasets: [
          {
            label: 'Medals',
            data: medalsPerCountry,
            backgroundColor: [
              '#0b868f',
              '#adc3de',
              '#7a3c53',
              '#8f6263',
              'orange',
              '#94819d',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        onClick: (e) => {
          if (e.native) {
            const points = pieChart.getElementsAtEventForMode(
              e.native,
              'point',
              { intersect: true },
              true
            );
            if (points.length) {
              const firstPoint = points[0];
              const countryName = pieChart.data.labels
                ? pieChart.data.labels[firstPoint.index]
                : '';
              this.router.navigate(['country', countryName]);
            }
          }
        },
      },
    });
    this.pieChart = pieChart;
  }
}

