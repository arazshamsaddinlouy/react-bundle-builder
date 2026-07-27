# Frontend Take-Home – Bundle Builder

This project is my implementation of the Frontend Bundle Builder take-home assignment.

The application allows users to build a customizable home security package by selecting products, changing variants, adjusting quantities, reviewing pricing in real time, and saving their progress for later.

---

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- TanStack Query
- Tailwind CSS
- Sonner

---

## Getting Started

### Install dependencies

```bash
yarn
```

### Start development server

```bash
yarn dev
```

### Build for production

```bash
yarn build
```

### Run lint

```bash
yarn lint
```

---

## Project Structure

```
src
├── components
│   ├── bundle-builder
│   └── bundle-summary
├── constants
├── hooks
├── lib
├── pages
├── services
├── store
├── types
└── utils
```

The project is organized by responsibility rather than feature size, making it easy to extend and maintain.

---

## Main Features

- Multi-step bundle builder
- Product variant selection
- Quantity management
- Live pricing updates
- Discount calculation
- Monthly installment calculation
- Shipping summary
- Bundle persistence using Local Storage
- Restore previously saved bundle
- Responsive layout
- Type-safe implementation with TypeScript

---

## State Management

Global application state is managed with Zustand.

The store is intentionally kept small and focused. It is responsible only for:

- selected variants
- active variants
- quantity changes
- restoring saved bundles
- clearing bundle state

Business calculations remain outside the store to keep state management predictable.

---

## Data Fetching

Products are loaded using TanStack Query.

Although the project currently uses a local JSON file, the data layer was implemented as if it were consuming a real API. Replacing the mock endpoint with a backend service requires minimal changes.

---

## Local Storage

Users can save their bundle and restore it after refreshing the page.

Only the information required to rebuild the bundle is persisted:

- selected variants
- quantities
- save timestamp

Pricing is recalculated after restoration rather than trusted from storage.

---

## Design Decisions

A few implementation decisions were made intentionally:

- Business logic is separated from presentation components.
- Pricing calculations are extracted into reusable utility functions.
- Formatting utilities are isolated from calculation utilities.
- The data layer is separated from React components.
- Components remain focused on rendering rather than calculations.
- State updates avoid unnecessary mutations.
- Product quantities are tracked per variant to preserve selections when switching between variants.

---

## Assumptions

Since this is a prototype:

- Checkout only displays a confirmation message.
- No payment flow is implemented.
- Products are loaded from a mock endpoint.
- Authentication is not required.

---

## Future Improvements

If this project were continued beyond the assignment, I would consider adding:

- Unit tests
- Integration tests
- End-to-end testing
- Error boundaries
- Loading skeletons
- Better accessibility coverage
- Animations for bundle updates
- Backend integration
- Internationalization

---

## Notes

The goal of this implementation was not only to complete the requested functionality, but also to keep the codebase maintainable and easy to evolve.

Where possible, responsibilities have been separated, reusable logic extracted, and state kept minimal so future features can be added without significant refactoring.
