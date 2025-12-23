# Architecture du Projet Olympic Games Starter

## Vue d'ensemble

Ce projet Angular suit une architecture modulaire et maintenable, basée sur les meilleures pratiques Angular. L'application permet de visualiser les données des Jeux Olympiques avec des graphiques interactifs.

---

## Organisation des Dossiers

```
src/
├── app/
│   ├── core/                    # Module central (singleton)
│   │   ├── models/              # Interfaces TypeScript
│   │   └── services/            # Services métier
│   ├── pages/                   # Composants de pages (routing)
│   │   ├── home/                # Page d'accueil
│   │   ├── country/             # Page détail pays
│   │   └── not-found/           # Page 404
│   └── shared/                  # Module partagé
│       └── components/          # Composants réutilisables
│           └── chart/           # Composant graphique
├── assets/
│   ├── images/                  # Images statiques
│   └── mock/                    # Données JSON simulées
└── environments/                # Configuration d'environnement
```

---

## Choix d'Architecture

### 1. Architecture Modulaire

Le projet est divisé en trois modules principaux :

#### **CoreModule** (`/core`)
- **Rôle** : Contient la logique métier centralisée
- **Singleton** : Importé uniquement dans `AppModule`
- **Contenu** :
  - `OlympicService` : Service principal pour la gestion des données olympiques
  - Interfaces `Olympic` et `Participation`

#### **SharedModule** (`/shared`)
- **Rôle** : Composants, directives et pipes réutilisables
- **Exporté** : Disponible pour tous les modules qui l'importent
- **Contenu** : `ChartComponent` - composant de visualisation graphique

#### **Pages** (`/pages`)
- **Rôle** : Composants utilisés pour le routing
- **Pattern** : Un dossier par page avec ses fichiers associés

---

### 2. Gestion d'État avec BehaviorSubject

```typescript
private olympics$ = new BehaviorSubject<Olympic[] | null>(null);
private error$ = new BehaviorSubject<string | null>(null);
```

**Avantages :**
- État réactif et observable
- Accès synchrone via `getValue()` quand nécessaire
- Gestion centralisée des erreurs

---

### 3. Pattern Strategy pour les Graphiques

Le composant `ChartComponent` utilise le **pattern Strategy** pour gérer différents types de graphiques :

```typescript
interface ChartStrategy {
  buildConfig(config: ChartConfig): ChartConfiguration;
}

class PieChartStrategy implements ChartStrategy { ... }
class LineChartStrategy implements ChartStrategy { ... }

class ChartStrategyFactory {
  static getStrategy(type: 'pie' | 'line'): ChartStrategy { ... }
}
```

**Avantages :**
- Extensibilité facile pour de nouveaux types de graphiques
- Séparation des responsabilités
- Code plus maintenable et testable

---

### 4. Modèles de Données (Interfaces)

#### Olympic
```typescript
interface Olympic {
  id: number;
  country: string;
  participations: Participation[];
}
```

#### Participation
```typescript
interface Participation {
  id: number;
  year: number;
  city: string;
  medalsCount: number;
  athleteCount: number;
}
```

---

### 5. Routing

Configuration des routes dans `app-routing.module.ts` :

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `HomeComponent` | Page d'accueil avec graphique circulaire |
| `/country/:countryName` | `CountryComponent` | Détails d'un pays avec graphique linéaire |
| `/not-found` | `NotFoundComponent` | Page d'erreur 404 |
| `**` | `NotFoundComponent` | Wildcard - redirige vers 404 |

---

### 6. Gestion du Cycle de Vie

Utilisation du pattern **Subject pour le unsubscribe** :

```typescript
private readonly destroy$ = new Subject<void>();

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}

// Dans les subscriptions
.pipe(takeUntil(this.destroy$))
.subscribe(...)
```

**Avantages :**
- Évite les fuites mémoire
- Pattern cohérent à travers l'application
- Nettoyage automatique des subscriptions

---

### 7. Injection de Dépendances

Utilisation du pattern moderne avec `inject()` :

```typescript
private readonly router = inject(Router);
private readonly olympicService = inject(OlympicService);
```

**Avantages :**
- Syntaxe plus concise
- Meilleure inférence de types
- Compatible avec les fonctions standalone

---

## Flux de Données

```
┌─────────────────┐
│  olympic.json   │ ─── Données mockées
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ OlympicService  │ ─── Chargement HTTP + BehaviorSubject
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Components    │ ─── Subscription aux observables
│  (Home/Country) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ChartComponent  │ ─── Affichage Chart.js
└─────────────────┘
```

