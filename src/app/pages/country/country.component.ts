import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Chart from 'chart.js/auto';
import { OlympicService, Olympic} from '../../core';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);

  // Subject pour gérer le désabonnement automatique
  private readonly destroy$ = new Subject<void>();

  public lineChart!: Chart<'line', number[], number>;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error: string | null = null;
  public isLoading = true;

  ngOnInit(): void {
    this.loadCountryData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.lineChart) {
      this.lineChart.destroy();
    }
  }

  private loadCountryData(): void {
    const countryName = this.route.snapshot.paramMap.get('countryName');

    if (!countryName) {
      this.router.navigate(['/not-found']);
      return;
    }

    this.olympicService
      .loadInitialData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading = false;
          const selectedCountry = this.olympicService.getOlympicByCountry(countryName);

          if (!selectedCountry) {
            this.router.navigate(['/not-found']);
            return;
          }

          this.displayCountryData(selectedCountry);
        },
        error: () => {
          this.isLoading = false;
          this.error = 'Impossible de charger les données du pays.';
        },
      });
  }

  private displayCountryData(olympic: Olympic): void {
    this.titlePage = olympic.country;
    this.totalEntries = olympic.participations.length;
    this.totalMedals = this.olympicService.getTotalMedals(olympic);
    this.totalAthletes = this.olympicService.getTotalAthletes(olympic);

    const years = olympic.participations.map((p) => p.year);
    const medals = olympic.participations.map((p) => p.medalsCount);

    this.buildChart(years, medals);
  }

  private buildChart(years: number[], medals: number[]): void {
    const lineChart = new Chart('countryChart', {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: 'Medals',
            data: medals,
            backgroundColor: '#0b868f',
            borderColor: '#0b868f',
            tension: 0.1,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    this.lineChart = lineChart;
  }
}
