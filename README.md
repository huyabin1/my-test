# Drawing Canvas Application

A polished, production-ready drawing and canvas application built with React, TypeScript, and Vitest. Features cohesive theming, comprehensive testing, and a professional UI with tooltips and status indicators.

## Features

### UI/UX
- **Dark/Light Theme Support** - Seamless theme switching with system preference detection
- **Responsive Design** - Works perfectly on desktop and tablet sizes
- **Professional Styling** - Cohesive SCSS variable system with computed theme colors
- **Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
- **Tooltips & Hints** - Context-sensitive tooltips throughout the interface
- **Status Indicators** - Real-time display of mode, snap state, and zoom level
- **Toast Notifications** - Beautiful notifications for user feedback

### Drawing Features
- **Draw Mode** - Smooth, responsive drawing with adjustable stroke width and color
- **Select Mode** - Select and manipulate drawing elements
- **Edit Mode** - Edit properties of selected elements
- **Snap to Grid** - Toggle-able grid snapping for precise alignment
- **Multiple View Modes** - Normal, Grid, and Outline view options
- **Undo/Redo** - Full history management with keyboard shortcuts
- **Export** - Save your drawings in various formats

### Technical Excellence
- **TypeScript** - Full type safety and better IDE support
- **Zustand State Management** - Lightweight and performant state management
- **Comprehensive Testing** - 80%+ code coverage with Vitest
- **E2E Testing** - Complete user workflows tested with Cypress
- **CI/CD Pipeline** - GitHub Actions with lint, test, build, and E2E checks
- **ESLint & Prettier** - Code quality and consistent formatting

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd drawing-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run with hot reload (http://localhost:3000)
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open coverage report in browser
npm run test:ui
```

### E2E Tests

```bash
# Run Cypress E2E tests (interactive)
npm run test:e2e

# Run Cypress tests headless
npm run test:e2e:headless
```

## Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check
npm run type-check
```

## Project Structure

```
drawing-app/
├── src/
│   ├── __tests__/                # Unit tests
│   │   ├── components/
│   │   └── store/
│   ├── components/               # React components
│   │   ├── Canvas.tsx
│   │   ├── Toolbar.tsx
│   │   ├── StatusBar.tsx
│   │   ├── Toast.tsx
│   │   ├── Tooltip.tsx
│   │   └── ThemeSwitcher.tsx
│   ├── store/                    # Zustand stores
│   │   ├── drawingStore.ts
│   │   ├── notificationStore.ts
│   │   └── themeStore.ts
│   ├── styles/                   # SCSS styles
│   │   ├── global.scss
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   └── components.scss
│   ├── App.tsx                   # Root component
│   └── main.tsx                  # Entry point
├── cypress/
│   ├── e2e/                      # E2E tests
│   │   ├── drawing.cy.ts
│   │   ├── theme.cy.ts
│   │   └── notifications.cy.ts
│   └── support/
├── .github/
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline
├── vitest.config.ts              # Vitest configuration
├── vite.config.ts                # Vite configuration
└── tsconfig.json                 # TypeScript configuration
```

## Usage Guide

See [docs/user-guide.md](docs/user-guide.md) for detailed usage instructions, keyboard shortcuts, and workflow examples.

## CI/CD Pipeline

The project includes a comprehensive GitHub Actions CI pipeline that runs on every pull request:

1. **Lint** - ESLint checks for code quality
2. **Type Check** - TypeScript type checking
3. **Unit Tests** - Vitest with 80% coverage threshold
4. **Build** - Production build verification
5. **E2E Tests** - Cypress end-to-end tests
6. **Status Check** - Overall pipeline status

Coverage reports are automatically uploaded to Codecov.

## Theming System

The application uses SCSS variables for a cohesive design system with light/dark mode support:

- **Color Palette** - Primary, secondary, and status colors
- **Spacing Scale** - Consistent 8px base unit spacing
- **Typography** - Professional font stack with scale
- **Shadows** - Layered shadow system for depth
- **Transitions** - Smooth animations throughout
- **Z-index** - Organized layering system

All theme colors are automatically computed based on the selected theme using CSS custom properties.

## Accessibility

The application meets WCAG 2.1 AA standards:

- ✅ Semantic HTML structure
- ✅ Proper color contrast ratios
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader support
- ✅ Tooltips for affordances

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- Lazy loading of components
- Optimized canvas rendering
- Efficient state management
- Production build is ~45KB gzipped

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes with descriptive messages
4. Push to the branch
5. Create a Pull Request

All pull requests must pass the CI pipeline and include tests for new features.

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue on GitHub.
