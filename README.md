# Bundle Builder

This project is my solution to the Bundle Builder frontend coding challenge.

It allows users to build a custom home security bundle by selecting products, choosing product variants, adjusting quantities, and reviewing pricing in real time. The current bundle is automatically persisted in local storage so it can be restored after refreshing the page.

## Demo

Start the application locally:

```bash
yarn
yarn dev
```

The application will be available at:

```
http://localhost:5173
```

---

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- TanStack Query
- Tailwind CSS
- Sonner
- Vitest
- React Testing Library

---

## Available Scripts

Install dependencies:

```bash
yarn
```

Start the development server:

```bash
yarn dev
```

Create a production build:

```bash
yarn build
```

Preview the production build:

```bash
yarn preview
```

Run ESLint:

```bash
yarn lint
```

Run unit tests:

```bash
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

Generate test coverage:

```bash
yarn test:coverage
```

---

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
├── styles
├── types
├── utils
└── assets
```

The project is organized by responsibility rather than by feature size. UI components, state management, services, utilities, and shared types are kept separate to make the codebase easier to navigate and maintain.

---

## Features

- Multi-step bundle builder
- Product variant selection
- Quantity management
- Support for single-select and multi-quantity products
- Live bundle summary
- Automatic price calculations
- Discount display
- Monthly payment calculation
- Shipping summary
- Local storage persistence
- Bundle restoration after page refresh
- Responsive layout for mobile and desktop
- Error handling for missing product images

---

## State Management

Global state is managed with Zustand.

The store only contains the minimum data required to represent the current bundle:

- Selected products
- Active variants
- Product quantities

Derived values such as totals, discounts, financing information, and summary sections are calculated outside the store to keep business logic separate from application state.

---

## Data Fetching

Product data is loaded using TanStack Query.

The current implementation reads from a local JSON file, but the data layer is isolated behind a service so it can easily be replaced with a REST or GraphQL API without changing the UI.

---

## Local Storage

The bundle is automatically persisted in Local Storage.

Only the information required to restore the bundle is stored:

- Selected variants
- Selected quantities

Pricing information is intentionally not persisted. All totals are recalculated whenever the application is loaded.

---

## Testing

The project includes unit tests covering the core business logic and UI behaviour.

Areas covered include:

- Bundle summary generation
- Currency formatting
- Price calculations
- Product cards
- Bundle summary components
- Quantity controls
- User interactions

Tests are written using Vitest together with React Testing Library.

---

## Design Decisions

Some implementation decisions made during development:

- Business logic is extracted into reusable utility functions where possible.
- Presentation components are kept focused on rendering.
- State management only stores user selections, while calculated values remain derived.
- Product variants and quantity handling are designed to support future product types with minimal changes.
- The data layer is independent from the UI, making it straightforward to replace the current mock data source.

---

## Future Improvements

Given more time, some possible improvements would include:

- Animation between builder steps
- Optimistic updates for API-backed data
- End-to-end tests with Playwright
- Storybook for isolated component development
- Internationalization (i18n)
- Accessibility improvements and keyboard navigation refinements

---

## Notes

The primary focus of this implementation was maintainability and scalability.

The application is structured so that components remain reusable, business logic is easy to test, and future features can be added without significant changes to the existing architecture.
