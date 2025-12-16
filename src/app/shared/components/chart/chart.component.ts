import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import Chart, { ChartConfiguration } from 'chart.js/auto';

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  tension?: number;
  hoverOffset?: number;
}

export interface ChartConfig {
  type: 'pie' | 'line';
  labels: (string | number)[];
  datasets: ChartDataset[];
  aspectRatio?: number;
  clickable?: boolean;
}

interface ChartStrategy {
  buildConfig(config: ChartConfig): ChartConfiguration;
}

class PieChartStrategy implements ChartStrategy {
  buildConfig(config: ChartConfig): ChartConfiguration<'pie'> {
    return {
      type: 'pie',
      data: {
        labels: config.labels as string[],
        datasets: config.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.backgroundColor || [
            '#0b868f',
            '#adc3de',
            '#7a3c53',
            '#8f6263',
            'orange',
            '#94819d',
          ],
          hoverOffset: ds.hoverOffset || 4,
        })),
      },
      options: {
        aspectRatio: config.aspectRatio || 2.5,
      },
    };
  }
}

class LineChartStrategy implements ChartStrategy {
  buildConfig(config: ChartConfig): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels: config.labels,
        datasets: config.datasets.map(ds => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.borderColor || '#0b868f',
          borderColor: ds.borderColor || '#0b868f',
          tension: ds.tension || 0.1,
        })),
      },
      options: {
        aspectRatio: config.aspectRatio || 2.5,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  }
}

class ChartStrategyFactory {
  private static readonly strategies: Record<string, ChartStrategy> = {
    pie: new PieChartStrategy(),
    line: new LineChartStrategy(),
  };

  static getStrategy(type: 'pie' | 'line'): ChartStrategy {
    const strategy = this.strategies[type];
    if (!strategy) {
      throw new Error(`Unsupported chart type: ${type}`);
    }
    return strategy;
  }
}

@Component({
  selector: 'chart',
  template: `<canvas #chartCanvas></canvas>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class ChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() config!: ChartConfig;
  @Output() chartClick = new EventEmitter<{ index: number; label: string | number }>();

  private chart: Chart | null = null;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.rebuildChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  private buildChart(): void {
    if (!this.config || !this.chartCanvas) {
      return;
    }

    const strategy = ChartStrategyFactory.getStrategy(this.config.type);
    const chartConfig = strategy.buildConfig(this.config);

    if (this.config.clickable) {
      chartConfig.options = {
        ...chartConfig.options,
        onClick: (e) => this.handleChartClick(e),
      };
    }

    this.chart = new Chart(this.chartCanvas.nativeElement, chartConfig);
  }

  private handleChartClick(e: any): void {
    if (!this.chart || !e.native) {
      return;
    }

    const points = this.chart.getElementsAtEventForMode(
      e.native,
      'point',
      { intersect: true },
      true
    );

    if (points.length) {
      const firstPoint = points[0];
      const label = this.chart.data.labels?.[firstPoint.index];
      if (label !== undefined) {
        this.chartClick.emit({ index: firstPoint.index, label: label as string | number });
      }
    }
  }

  private rebuildChart(): void {
    this.destroyChart();
    this.buildChart();
  }

  private destroyChart(): void {
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }
}

