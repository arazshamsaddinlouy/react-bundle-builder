# Bundle Builder

This project is my solution for the Bundle Builder frontend coding challenge.

The application allows users to create a custom home security bundle by selecting products, choosing variants, changing quantities, and reviewing the order summary in real time. The selected bundle is also persisted in local storage so it can be restored after a page refresh.

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- TanStack Query
- Tailwind CSS
- Sonner

## Running the Project

Install dependencies:

```bash
yarn
```

Start the development server:

```bash
yarn dev
```

Build the project:

```bash
yarn build
```

Run ESLint:

```bash
yarn lint
```

## Project Structure

```
src
├── components
├── constants
├── hooks
├── lib
├── pages
├── services
├── store
├── types
└── utils
```

The project is organized by responsibility. UI components, business logic, API services, state management and utility functions are separated to keep the codebase easier to maintain.

## Features

- Multi-step bundle builder
- Product variant selection
- Quantity management
- Real-time price updates
- Discount calculation
- Monthly payment calculation
- Shipping summary
- Local storage persistence
- Bundle restoration after refresh
- Responsive layout

## State Management

Zustand is used for global state management.

The store only contains the data required to manage the bundle, including selected variants, active variants and product quantities. Pricing and summary calculations are handled separately to keep the store focused on state rather than business logic.

## Data Layer

Products are loaded through TanStack Query.

The current implementation uses a local JSON file, but the data layer is structured so it can be replaced with a real API without changing the UI components.

## Local Storage

The application saves the current bundle automatically.

Only the information required to rebuild the bundle is stored:

- Selected variants
- Product quantities

Prices and totals are recalculated when the bundle is restored.

## Notes

The main goal of this implementation was to keep the code modular and easy to extend. Components are focused on rendering, calculations are extracted into reusable utilities, and business logic is separated from the UI wherever possible.
