import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { OlympicService, Olympic } from '../../core';
import { ChartConfig } from '../../shared';
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy, OnInit {
  private readonly router = inject(Router);
  private readonly olympicService = inject(OlympicService);

  private readonly destroy$ = new Subject<void>();
  public chartConfig: ChartConfig | null = null;
  public totalCountries = 0;
  public totalJOs = 0;
  public error: string | null = null;
  public isLoading = true;
  public titlePage = 'Medals per Country';

  ngOnInit() {
    this.init();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private init() {
    this.olympicService.loadInitialData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Olympic[]) => {
          this.isLoading = false;
          if (data && data.length > 0) {
            this.totalJOs = this.olympicService.getTotalJOs();
            this.totalCountries = this.olympicService.getTotalCountries();
            const countries = this.olympicService.getCountryNames();
            const medalsPerCountry = this.olympicService.getMedalsPerCountry();
            this.buildChart(countries, medalsPerCountry);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.error = 'Impossible de charger les données olympiques.';
        }
      })
  }

  private buildChart(countries: string[], medalsPerCountry: number[]): void {
    this.chartConfig = {
      type: 'pie',
      labels: countries,
      datasets: [{
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
      }],
      aspectRatio: 2.5,
      clickable: true,
    };
  }

  onChartClick(event: { index: number; label: string | number }): void {
    this.router.navigate(['country', event.label]);
  }
}

