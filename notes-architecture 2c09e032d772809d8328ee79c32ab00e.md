# notes-architecture

# Notes d’Architecture - Olympic Games Starter

---

## 🚨 Problèmes Critiques

### 1. **Absence de couche de services**

**Localisation :**
- `src/app/pages/home/home.component.ts`
- `src/app/pages/country/country.component.ts`

**Problème :**
- Les appels HTTP sont faits directement dans les composants

**Impact :**
- Violation du principe de responsabilité unique (SRP)
- Code non réutilisable et difficile à tester
- Les composants gèrent à la fois la logique de présentation et la logique métier

---

### 2. **Absence totale de typage**

**Localisation :**
- `src/app/pages/home/home.component.ts`
- `src/app/pages/country/country.component.ts`

**Problème :**

```tsx
this.http.get<any[]>(this.olympicUrl)
const selectedCountry = data.find((i: any) => i.country === countryName);medals.reduce((accumulator: any, item: any) => ...)
```

**Impact :**
- Perte des avantages de TypeScript (auto complétion, détection d’erreurs)
- Risques d’erreurs à l’exécution
- Code fragile et difficile à maintenir
- Impossible de détecter des erreurs de structure de données

### 3. **Absence de structure**

**Localisation :** Architecture générale du projet

**Problème :**
- Aucun dossier `core/` n’existe dans `src/app/`
- Aucun dossier `services/` ou `models/`
- 

**Impact :**
- Architecture non scalable
- Pas de séparation claire entre logique métier et framework

**Commentaire personnel :**

```
// Exemple de structure recommandée
e-commerce-app/
│
├── src/
│   ├── app/
│   │   ├── app.module.ts          # Module racine
│   │   ├── app.component.ts       # Composant racine
│   │   ├── app-routing.module.ts  # Configuration du routage principale
│   │   │
│   │   ├── core/                  # Module core pour les services singleton, les composants shell, etc.
│   │   │   ├── core.module.ts
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   └── ...
│   │   │
│   │   ├── shared/                # Module partagé pour les composants, directives, et pipes réutilisables
│   │   │   ├── shared.module.ts
│   │   │   ├── buttons/
│   │   │   ├── utilities/
│   │   │   └── ...
│   │   │
│   │   ├── products/             # Module de produits
│   │   │   ├── products.module.ts
│   │   │   ├── product-list/
│   │   │   ├── product-detail/
│   │   │   ├── product.service.ts
│   │   │   └── ...
│   │   │
│   │   ├── users/                # Module des utilisateurs
│   │   │   ├── users.module.ts
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── users.service.ts
│   │   │   └── ...
│   │   │
│   │   ├── cart/                 # Module du panier
│   │   │   ├── cart.module.ts
│   │   │   ├── cart-page/
│   │   │   ├── cart-summary/
│   │   │   ├── cart.service.ts
│   │   │   └── ...
│   │   │
│   │   └── orders/               # Module des commandes
│   │       ├── orders.module.ts
│   │       ├── order-list/
│   │       ├── order-detail/
│   │       ├── orders.service.ts
│   │       └── ...
│   │
│   ├── assets/
│   ├── environments/
│   └── ...
│
├── node_modules/
├── angular.json
├── package.json
└── ...
```

---

## ⚠️ Problèmes Majeurs

### 4. **Console.log en production**

**Localisation :**
- `src/app/pages/home/home.component.ts`

**Problème :**

```tsx
console.log(`Liste des données : ${JSON.stringify(data)}`);console.log(`erreur : ${error}`);
```

**Impact :**
- Pollution de la console
- Possibles fuites d’informations sensibles
- Non professionnel en production

**Commentaire personnel :**
Ces logs doivent être supprimés ou conditionnés à l’environnement de développement (`environment.ts`).

---

### 5. **Gestion d’erreur insuffisante**

**Localisation :**
- `home.component.ts`
- `country.component.ts`

**Problème :**
- Les erreurs HTTP sont capturées mais pas correctement gérées
- `this.error = error.message` dans `home.component.ts` mais jamais affiché dans le template
- Pas de redirection vers la page 404 en cas d’erreur
- Pas de message utilisateur

**Impact :**
- Mauvaise expérience utilisateur
- Difficile de debug en production

**Commentaire personnel :**

Il faudrait :
- Afficher les messages d’erreur dans les templates
- Utiliser un intercepteur HTTP global pour gérer les erreurs
- Rediriger vers `/not-found` si les données ne sont pas disponibles

---

### 6. **Mauvaise gestion des Observables**

**Localisation :**
- `home.component.ts`
- `country.component.ts`

**Problème :**

```tsx
this.http.get<any[]>(this.olympicUrl).pipe().subscribe(...)
```

**Impact :**
- Utilisation de `.pipe()` vide
- Pas de désabonnement explicite (risque de fuite mémoire)
- Pas d’opérateurs (`catchError`) ou transformation des données

**Commentaire personnel :**
Avec un service dédié, on pourrait utiliser des opérateurs comme `map`, `catchError`, `retry`, etc. De plus, il faudrait soit :
- Utiliser `async` dans les templates pour une gestion automatique

---

### 7. **Logique métier dans les composants**

**Localisation :**
- `home.component.ts`
- `country.component.ts`

**Problème :**

```tsx
this.totalJOs = Array.from(new Set(data.map((i: any) => i.participations.map((f: any) => f.year)).flat())).length;const sumOfAllMedalsYears = medals.map((i) => i.reduce((acc: any, i: any) => acc + i, 0));this.totalMedals = medals.reduce((accumulator: any, item: any) => accumulator + parseInt(item), 0);
```

**Impact :**
- Composants trop volumineux et difficiles à lire
- Logique non réutilisable
- Tests unitaires compliqués

---

### 8. Injection de dépendance

**Localisation :**
- `home.component.ts`
- `country.component.ts`

**Problème :**

```tsx
  constructor(private router: Router, private http:HttpClient) { }
```

**Impact :**
- Nécessite de définir un constructeur même si son seul but est d'injecter des dépendances

**Commentaire personnel :** 

```tsx
  private router = inject(Router);
  private http = inject(HttpClient);
```

---