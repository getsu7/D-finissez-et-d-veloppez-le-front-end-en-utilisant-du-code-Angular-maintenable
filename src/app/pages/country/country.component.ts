import {Component, OnInit, inject, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService, Olympic } from '../../core';
import { ChartConfig } from '../../shared';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.scss'],
})
export class CountryComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);

  private readonly destroy$ = new Subject<void>();
  public chartConfig: ChartConfig | null = null;
  public titlePage = '';
  public totalEntries = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  public error: string | null = null;
  public isLoading = true;

  ngOnInit(): void {
    this.init();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private init(): void {
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

    this.buildChartConfig(years, medals);
  }

  private buildChartConfig(years: number[], medals: number[]): void {
    this.chartConfig = {
      type: 'line',
      labels: years,
      datasets: [{
        label: 'Medals',
        data: medals,
        borderColor: '#0b868f',
        tension: 0.1,
      }],
      aspectRatio: 2.5,
      clickable: false,
    };
  }
}
