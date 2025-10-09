# Development Guide

This guide helps developers set up and contribute to the Starknet Address Validator project.

## 🚀 Quick Setup

### Prerequisites

- **Node.js**: 20.19+ or 22.12+ (required for Vite 7)
- **npm**: 8+ or **yarn**: 3+ (package manager)
- **Git**: For version control
- **Code Editor**: VS Code recommended with TypeScript support

### Installation

```bash
# Clone the repository (or navigate if already cloned)
cd SNIPs/starknet-address-validator

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Verify Setup

```bash
# Check if build works
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## 🏗 Project Architecture

### Directory Structure

```
src/
├── components/              # React components
│   ├── ui/                 # Base UI components (shadcn/ui)
│   │   ├── button.tsx      # Reusable button component
│   │   ├── card.tsx        # Card container component
│   │   ├── textarea.tsx    # Text input component
│   │   └── badge.tsx       # Status/label badges
│   ├── AddressInput.tsx    # Main address input component
│   └── ValidationResult.tsx # Results display component
├── lib/                    # Core business logic
│   ├── starknet-validator.ts # Address validation engine
│   └── utils.ts            # Utility functions
├── index.css               # Global styles + Tailwind
├── App.tsx                 # Main application component
└── main.tsx               # Application entry point
```

### Key Architecture Decisions

1. **Component Separation**: UI components separate from business logic
2. **Type Safety**: Full TypeScript coverage with strict settings
3. **Client-Side Only**: No backend dependencies
4. **Modular Design**: Easy to extend and maintain
5. **Accessibility First**: WCAG 2.1 AA compliance

## 🧩 Core Components

### AddressInput Component

**Purpose**: Handles user input with validation feedback
**Key Features**:
- Real-time input processing
- Clipboard integration (paste/copy)
- Character count and validation
- Mobile-friendly interface

```typescript
// Usage example
<AddressInput
  value={address}
  onChange={setAddress}
  placeholder="Enter Starknet address..."
/>
```

### ValidationResult Component

**Purpose**: Displays validation results and parsed data
**Key Features**:
- Format type identification
- Detailed error messages
- Parsed component display
- Copy functionality for all data

```typescript
// Usage example
<ValidationResult
  result={validationResult}
  address={inputAddress}
/>
```

### Validation Engine

**File**: `src/lib/starknet-validator.ts`
**Purpose**: Core address validation logic

**Key Functions**:
```typescript
// Main validation function
validateStarknetAddress(input: string): ValidationResult

// Format detection
detectAddressFormat(input: string): AddressFormat

// Utility functions
bytesToHex(bytes: Uint8Array): string
copyToClipboard(text: string): Promise<boolean>
```

## 🛠 Development Workflow

### 1. Starting Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Start dev server with hot reload
npm run dev
```

### 2. Making Changes

- **Components**: Add new components in `src/components/`
- **Logic**: Extend validation logic in `src/lib/starknet-validator.ts`
- **Styles**: Use Tailwind classes, add custom styles to `src/index.css`
- **Types**: Define types inline or extend existing interfaces

### 3. Testing Changes

```bash
# Build to check for errors
npm run build

# Run linting
npm run lint

# Test in browser
npm run dev
```

### 4. Code Quality

```bash
# Fix linting issues
npm run lint --fix

# Type check
npx tsc --noEmit
```

## 📝 Code Style Guidelines

### TypeScript

```typescript
// Use explicit types for function parameters and returns
function validateAddress(input: string): ValidationResult {
  // Implementation
}

// Use interface for object types
interface ValidationResult {
  isValid: boolean;
  format: AddressFormat;
  error?: string;
  parsed?: ParsedData;
}

// Use type unions for constants
type AddressFormat = 'legacy' | 'public' | 'shielded' | 'unified';
```

### React Components

```typescript
// Use functional components with TypeScript
interface ComponentProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Component({ value, onChange, className }: ComponentProps) {
  // Component implementation
}
```

### CSS/Tailwind

```css
/* Use Tailwind utilities first */
.button {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}

/* Custom CSS only when necessary */
.custom-animation {
  animation: fadeIn 0.2s ease-in-out;
}
```

## 🧪 Testing Strategy

### Manual Testing Checklist

**Address Formats**:
- [ ] Legacy addresses (0x...)
- [ ] SNIP-42 public (strk1...)
- [ ] SNIP-42 shielded (strkx1...)
- [ ] SNIP-43 unified (strku1...)
- [ ] Invalid formats
- [ ] Edge cases (empty, too long, invalid characters)

**User Interactions**:
- [ ] Paste functionality
- [ ] Copy buttons
- [ ] Mobile responsiveness
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

**Error Handling**:
- [ ] Network offline
- [ ] Clipboard permissions denied
- [ ] Invalid input handling
- [ ] Browser compatibility

### Test Cases to Add

```typescript
// Example test cases for validation logic
describe('validateStarknetAddress', () => {
  test('validates legacy addresses', () => {
    const result = validateStarknetAddress('0x1234...');
    expect(result.isValid).toBe(true);
    expect(result.format).toBe('legacy');
  });

  test('rejects invalid formats', () => {
    const result = validateStarknetAddress('invalid');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Unknown address format');
  });
});
```

## 🔧 Adding New Features

### Adding a New Address Format

1. **Update Types**:
```typescript
// In starknet-validator.ts
type AddressFormat = 'legacy' | 'public' | 'shielded' | 'unified' | 'new-format';
```

2. **Add Detection Logic**:
```typescript
export function detectAddressFormat(input: string): AddressFormat {
  // Add new format detection
  if (input.startsWith('new-prefix')) return 'new-format';
  // ... existing logic
}
```

3. **Implement Validation**:
```typescript
function validateNewFormat(input: string): ValidationResult {
  // Validation logic for new format
}
```

4. **Update UI Components**:
```typescript
// Add new format to UI displays
const formatDescriptions = {
  'new-format': 'Description of new format'
};
```

### Adding New UI Components

1. **Create Component File**:
```typescript
// src/components/NewComponent.tsx
interface NewComponentProps {
  // Define props
}

export function NewComponent(props: NewComponentProps) {
  // Component implementation
}
```

2. **Add to Main App**:
```typescript
// In App.tsx
import { NewComponent } from './components/NewComponent';
```

3. **Style with Tailwind**:
```tsx
<div className="p-4 bg-white rounded-lg shadow">
  {/* Component content */}
</div>
```

## 🐛 Troubleshooting

### Common Issues

**1. Node.js Version Error**
```bash
Error: Vite requires Node.js version 20.19+ or 22.12+
```
**Solution**: Upgrade Node.js or use nvm:
```bash
nvm install 20.19.0
nvm use 20.19.0
```

**2. Build Errors**
```bash
Error: Cannot resolve module
```
**Solution**: Check imports and install missing dependencies:
```bash
npm install
npm run build
```

**3. TypeScript Errors**
```bash
Error: Type 'X' is not assignable to type 'Y'
```
**Solution**: Fix type definitions or add type assertions:
```typescript
const value = someValue as ExpectedType;
```

**4. Tailwind Classes Not Working**
**Solution**: Ensure Tailwind is properly configured:
```bash
# Check if build includes Tailwind
npm run build
# Check browser dev tools for CSS
```

### Development Server Issues

**Hot Reload Not Working**:
1. Check if files are saved
2. Restart dev server: `npm run dev`
3. Clear browser cache

**Port Already in Use**:
```bash
Error: Port 5173 is already in use
```
**Solution**: 
- Kill process using port: `lsof -ti:5173 | xargs kill -9`
- Or specify different port: `npm run dev -- --port 3000`

## 📦 Dependencies

### Core Dependencies

```json
{
  "react": "^19.1.1",           // UI framework
  "react-dom": "^19.1.1",      // DOM renderer
  "bech32": "^2.0.0",          // Bitcoin Bech32m library
  "lucide-react": "^0.545.0",  // Icon library
  "clsx": "^2.1.1",            // Conditional classes
  "tailwind-merge": "^3.3.1"   // Tailwind class merging
}
```

### Development Dependencies

```json
{
  "@vitejs/plugin-react": "^5.0.4", // Vite React plugin
  "tailwindcss": "^3.4.0",          // CSS framework
  "typescript": "~5.9.3",           // Type checking
  "vite": "^7.1.7"                  // Build tool
}
```

### Adding New Dependencies

```bash
# Runtime dependency
npm install package-name

# Development dependency
npm install -D package-name

# Check for updates
npm outdated
npm update
```

## 🚀 Performance Optimization

### Bundle Size Analysis

```bash
# Analyze bundle size
npm run build

# Check chunk sizes in dist folder
ls -la dist/assets/
```

### Code Splitting

```typescript
// Lazy load components
const LazyComponent = lazy(() => import('./components/LazyComponent'));

// Use suspense
<Suspense fallback={<div>Loading...</div>}>
  <LazyComponent />
</Suspense>
```

### Performance Best Practices

1. **Avoid Unnecessary Re-renders**:
```typescript
// Use useMemo for expensive calculations
const expensiveValue = useMemo(() => 
  expensiveCalculation(data), [data]
);

// Use useCallback for functions
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

2. **Optimize Images**:
- Use appropriate formats (WebP, AVIF)
- Implement lazy loading
- Provide proper alt text

3. **Minimize Bundle Size**:
- Import only needed functions
- Use dynamic imports for large dependencies
- Configure Vite for optimal chunking

## 📖 Documentation

### Code Documentation

```typescript
/**
 * Validates a Starknet address across all supported formats
 * @param input - The address string to validate
 * @returns ValidationResult with success/failure and parsed data
 */
export function validateStarknetAddress(input: string): ValidationResult {
  // Implementation
}
```

### Component Documentation

```typescript
/**
 * AddressInput - Input component for Starknet addresses
 * 
 * Features:
 * - Real-time validation
 * - Clipboard integration
 * - Character counting
 * - Mobile responsive
 */
interface AddressInputProps {
  /** Current address value */
  value: string;
  /** Callback when address changes */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
}
```

## 🤝 Contributing

### Pull Request Process

1. **Fork & Branch**:
```bash
git checkout -b feature/description
```

2. **Make Changes**:
- Follow code style guidelines
- Add tests for new features
- Update documentation

3. **Test**:
```bash
npm run build
npm run lint
# Manual testing in browser
```

4. **Commit**:
```bash
git commit -m "feat: add feature description"
```

5. **Submit PR**:
- Clear description of changes
- Screenshots for UI changes
- Link to related issues

### Code Review Checklist

**Functionality**:
- [ ] Feature works as described
- [ ] No breaking changes
- [ ] Error handling included
- [ ] Edge cases considered

**Code Quality**:
- [ ] TypeScript types correct
- [ ] No linting errors
- [ ] Consistent code style
- [ ] Performance optimized

**Documentation**:
- [ ] README updated if needed
- [ ] Code comments added
- [ ] Type definitions clear

## 🔮 Future Development

### Planned Enhancements

1. **Testing Framework**:
   - Jest for unit testing
   - Testing Library for component testing
   - Cypress for E2E testing

2. **Advanced Features**:
   - PWA capabilities
   - Offline support
   - Better error boundaries

3. **Developer Experience**:
   - Storybook for component development
   - Husky for git hooks
   - Automated testing pipeline

### Architecture Evolution

- **State Management**: Consider Zustand for complex state
- **API Layer**: Add if server features needed
- **Micro-frontends**: Split into smaller applications if needed

## 📞 Support

### Getting Help

1. **Check Documentation**: README.md, this file
2. **Search Issues**: Look for similar problems
3. **Ask Questions**: Create discussion or issue
4. **Community**: Starknet Discord/Forum

### Reporting Bugs

Include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Console errors (if any)
- Screenshots (for UI issues)

---

**Happy coding! 🚀**

This development guide should help you understand, extend, and contribute to the Starknet Address Validator project. The codebase is designed to be maintainable, extensible, and developer-friendly.