# QuantaMeasure — Angular Frontend

A precision-built measurement Angular 17 application that connects to the QuantaMeasure backend API.

## Prerequisites

- Node.js 18+
- npm 9+
- Angular CLI 17: `npm install -g @angular/cli@17`
- Backend running at `http://localhost:5001`

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
ng serve

# 3. Open browser
http://localhost:4200
```

## Backend API

The app connects to your backend at `http://localhost:5001/api`.

To change the API URL, edit:
```
src/environments/environment.ts       ← development
src/environments/environment.production.ts ← production
```

### Endpoints Used

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | /api/auth/register                | Register new user        |
| POST   | /api/auth/login                   | Login user               |
| POST   | /api/v1/quantities/convert        | Convert quantity         |
| POST   | /api/v1/quantities/compare        | Compare two quantities   |
| POST   | /api/v1/quantities/add            | Add quantities           |
| POST   | /api/v1/quantities/subtract       | Subtract quantities      |
| POST   | /api/v1/quantities/divide         | Divide quantities        |
| GET    | /api/v1/quantities/history        | Get operation history    |
| GET    | /api/v1/quantities/history/errored| Get errored operations   |
| GET    | /api/v1/quantities/count          | Get total operation count|

### Auth Flow

- JWT token is stored in `localStorage` under key `qm_token`
- Token is automatically attached to all protected requests via `AuthInterceptor`
- On 401 response, user is automatically logged out

### Request Payloads

**Convert:**
```json
{ "value": 100, "fromUnit": "celsius", "toUnit": "fahrenheit" }
```

**Compare:**
```json
{
  "quantity1": { "value": 1, "unit": "kg" },
  "quantity2": { "value": 1000, "unit": "g" }
}
```

**Add / Subtract:**
```json
{
  "quantity1": { "value": 2, "unit": "ft" },
  "quantity2": { "value": 6, "unit": "in" },
  "resultUnit": "ft"
}
```

**Divide:**
```json
{
  "quantity1": { "value": 1, "unit": "kg" },
  "quantity2": { "value": 500, "unit": "g" }
}
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── navbar/          ← Fixed navbar with History link
│   │   ├── home/            ← Landing page (3 sections)
│   │   ├── calculator/      ← Measurement calculator
│   │   ├── history/         ← Auth wall + history list
│   │   └── toast/           ← Global toast notifications
│   ├── services/
│   │   ├── auth.service.ts      ← JWT auth + session
│   │   ├── quantity.service.ts  ← All API calls
│   │   └── toast.service.ts     ← Toast notifications
│   ├── guards/
│   │   └── auth.interceptor.ts  ← Attaches Bearer token
│   ├── models/
│   │   └── models.ts            ← All TypeScript interfaces
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.ts
│   └── environment.production.ts
└── styles.scss              ← Global styles + CSS variables
```

## Features

- **Home Page** — Hero, features grid, 4 category cards (click → goes to calculator)
- **Calculator** — Sidebar category picker + 5 operations (Convert, Add, Subtract, Divide, Equality) with live API calls
- **History** — Auth wall when logged out; after login shows full history with category filters + errored ops tab
- **Navbar** — History link only; Sign In / user name + logout when authenticated
- **Animations** — Floating demo cards, staggered hero reveal, slide-up results, page transitions

## Build for Production

```bash
ng build --configuration production
```

Output goes to `dist/quantameasure/`.
