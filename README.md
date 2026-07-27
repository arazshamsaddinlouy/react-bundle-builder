# Bundle Builder

A responsive multi-step product bundle builder built with React and TypeScript.

## Features

- Multi-category product selection
- Product variants and quantities
- Live bundle summary
- Discount and installment calculations
- Save-for-later using localStorage
- Responsive desktop, tablet, and mobile layouts
- Accessible interactive controls

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- TanStack Query
- Vitest
- React Testing Library

## Getting Started

yarn
yarn dev

## Quality Checks

yarn lint
yarn test
yarn build

## Architecture

Product data is fetched through TanStack Query. User selections are managed
with Zustand. `buildBundleSummary` converts normalized selection state into
renderable summary sections.
