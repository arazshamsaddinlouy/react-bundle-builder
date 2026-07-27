# Bundle Builder

This project is my solution for the Bundle Builder frontend coding challenge.

The application allows users to build a custom home security bundle by selecting products, choosing product variants, adjusting quantities, and reviewing the bundle summary in real time. The current bundle can also be saved to Local Storage and restored after refreshing the page.

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

## Getting Started

Install dependencies:

```bash
yarn
```

Start the development server:

```bash
yarn dev
```

The application will be available at:

```
http://localhost:5173
```

## Available Scripts

Run the development server:

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

Run tests:

```bash
yarn test
```

Run tests with coverage:

```bash
yarn test:coverage
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
├── utils
└── assets
```

The project is organized by responsibility to keep UI, business logic, state management, services, and utilities separated and easy to maintain.

## Features

- Multi-step bundle builder
- Product variant selection
- Quantity management
- Support for both single-select and quantity-based products
- Automatic dependency handling
- Live bundle summary
- Real-time price calculation
- Discount calculation
- Monthly payment calculation
- Shipping summary
- Local Storage save and restore
- Responsive layout
- Unit tests for business logic and UI components

## State Management

Global state is managed with Zustand.

The store is responsible only for user selections, including:

- Selected products
- Active product variants
- Product quantities

Calculated values such as totals, discounts, financing, and summary rows are derived outside the store to keep business logic separate from application state.

## Data Fetching

Products are loaded using TanStack Query.

The current implementation reads from a local JSON file, but the data access layer is isolated behind a service so it can easily be replaced with a real API in the future without affecting the UI.

## Local Storage

Users can save their current bundle and restore it later.

The following information is stored:

- Selected variants
- Product quantities

Prices and calculated totals are intentionally not stored. They are recalculated whenever the bundle is restored.

## Testing

Unit tests are written using Vitest and React Testing Library.

The tests cover both business logic and user interface behaviour, including:

- Bundle summary generation
- Currency formatting
- Quantity controls
- Product cards
- Bundle summary components
- User interactions

## Design Decisions

Some implementation decisions made during development:

- Business logic is extracted into reusable utility functions.
- Components focus on rendering and user interaction.
- Derived values are calculated outside the global store.
- The data layer is independent from the UI.
- Product dependencies are handled centrally inside the store.
- The project structure is designed to make future features easier to add.

## Future Improvements

With additional time, some possible improvements would include:

- End-to-end tests
- Storybook for component documentation
- Internationalization (i18n)
- Additional accessibility improvements
- Loading skeletons
- Better image placeholders

## Notes

The main focus of this implementation was maintainability, scalability, and separation of concerns. The application is structured so that UI components remain reusable, business logic stays testable, and new functionality can be added without significant changes to the existing architecture.
