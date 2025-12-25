# Bank Statement Generator

AI-assisted Expo React Native application for producing realistic bank statements tailored for salaried and self-employed profiles.

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the Expo development server
   ```bash
   npm run start
   ```
3. Launch on a device
   - Android: `npm run android`
   - iOS: `npm run ios`

## Key Features

- Guided flows for salaried and self-employed users
- AI-style transaction synthesis with realistic balances and reference IDs
- Bank template selector (PNB, SBI, HDFC, ICICI, AXIS, KOTAK)
- OCR intake (PDF upload with Tesseract.js) for auto-filling account details
- PDF export with sharing support
- Persistent storage of generated statements with regenerate/export actions
- Modern theming with light/dark support scaffolding

## Project Structure

- `app/` – Expo Router navigation (tabs + modals)
- `src/components/` – Reusable UI kit and layout primitives
- `src/features/` – Feature-specific modules (generation, saved statements)
- `src/services/` – OCR, PDF, and template utilities
- `src/store/` – Zustand-powered global state
- `src/theme/` – Design system tokens

## Scripts

- `npm run lint` – Lint using ESLint
- `npm run typecheck` – TypeScript project check
- `npm run test` – Component and unit tests with Jest

## Testing

Unit tests target generator utilities and hooks. Extend coverage by adding suites under `tests/` or alongside feature folders and run `npm run test`.

## Roadmap

- Expand PDF layout to use authentic SVG templates per bank.
- Integrate dark mode toggle and admin diagnostics panel.
- Add Detox end-to-end coverage for critical journeys.
