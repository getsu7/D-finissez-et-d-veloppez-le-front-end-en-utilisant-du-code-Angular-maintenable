import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private olympics$ = new BehaviorSubject<Olympic[] | null>(null);

  private error$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  loadInitialData(): Observable<Olympic[]> {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((data) => {
        this.olympics$.next(data);
        this.error$.next(null);
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des données olympiques:', error);
        this.error$.next('Impossible de charger les données olympiques.');
        this.olympics$.next(null);
        throw error;
      })
    );
  }

  getOlympics(): Observable<Olympic[] | null> {
    return this.olympics$.asObservable();
  }

  getError(): Observable<string | null> {
    return this.error$.asObservable();
  }

  getOlympicByCountry(countryName: string): Olympic | undefined {
    const olympics = this.olympics$.getValue();
    return olympics?.find((olympic) => olympic.country === countryName);
  }

  getTotalJOs(): number {
    const olympics = this.olympics$.getValue();
    if (!olympics) return 0;

    const years = new Set<number>();
    olympics.forEach((olympic) => {
      olympic.participations.forEach((participation) => {
        years.add(participation.year);
      });
    });
    return years.size;
  }

  getTotalCountries(): number {
    const olympics = this.olympics$.getValue();
    return olympics?.length ?? 0;
  }

  getTotalMedals(olympic: Olympic): number {
    return olympic.participations.reduce(
      (total, participation) => total + participation.medalsCount,
      0
    );
  }

  getTotalAthletes(olympic: Olympic): number {
    return olympic.participations.reduce(
      (total, participation) => total + participation.athleteCount,
      0
    );
  }

  getMedalsPerCountry(): number[] {
    const olympics = this.olympics$.getValue();
    if (!olympics) return [];

    return olympics.map((olympic) => this.getTotalMedals(olympic));
  }

  getCountryNames(): string[] {
    const olympics = this.olympics$.getValue();
    return olympics?.map((olympic) => olympic.country) ?? [];
  }
}

