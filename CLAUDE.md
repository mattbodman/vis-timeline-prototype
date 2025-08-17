You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Goals

- This repo is to prototype the possibility of adding a custom groupTemplate to a vis-timeline
- The vis-timeline must be wrapped in a component called "VisTimelineWrapperComponent"
- The wrapper should take DataItem[] and DataGroup as required signal inputs
- The vis-timeline options object should also be an option signal input
- The custom group template must be able to correctly render Angular Material Components - button and icon
- The prototype should be tested with headless Cypress component testing

## ✅ Project Status: COMPLETED + ENHANCED

**Successfully implemented vis-timeline integration with Angular Material components AND flexible custom group template support!**

### Key Achievements:
- ✅ **VisTimelineWrapperComponent** created with full vis-timeline integration
- ✅ **Angular Material Integration** - Dynamic creation of Material buttons and icons within timeline group templates
- ✅ **Dynamic Color & Icon Support** - Customizable colors (primary/accent/warn) and icons per group
- ✅ **Angular v19 + TypeScript** - Modern Angular architecture with signals and standalone components
- ✅ **Cypress Component Testing** - Full test suite (16/16 tests passing)
- ✅ **Material Design Theme** - Indigo/pink theme with proper Material styling
- ✅ **ENHANCED: Flexible GroupTemplate Support** - Optional signal input for custom group templates
- ✅ **ENHANCED: Custom Material Template** - Demonstration of custom templates using Angular Material components

### Technical Implementation:
- **Dynamic Component Creation**: Uses Angular's `createComponent` API to dynamically render Material components
- **Custom Group Templates**: Successfully renders Material buttons (`mat-raised-button`) and icons (`mat-icon`) within vis-timeline groups  
- **Lifecycle Management**: Proper cleanup of Angular components to prevent memory leaks
- **Material Design**: Full indigo/pink theme with elevation, typography, and interaction states
- **ENHANCED: Generic GroupTemplate Support**: Wrapper accepts optional `GroupTemplateFunction` signal input
- **ENHANCED: Template Flexibility**: Supports both default Material templates and custom user-provided templates
- **ENHANCED: Backward Compatibility**: All existing functionality preserved when no custom template provided

### Key Features Implemented

#### 1. Dynamic Color Support
- CustomGroupButton component accepts `color` input: `'primary' | 'accent' | 'warn'`
- Default value: `'primary'`
- Automatic color assignment based on group ID (round-robin)

#### 2. Dynamic Icon Support  
- CustomGroupButton component accepts `iconName` as required input
- Template uses `{{ iconName() }}` for dynamic icon rendering
- Three test icons: `'add'`, `'edit'`, `'star'` assigned by group ID

#### 3. Component Architecture
```typescript
// Default Material Template Components (built-in)
CustomGroupButton {
  readonly groupId = input.required<string | number>();
  readonly color = input<'primary' | 'accent' | 'warn'>('primary');
  readonly iconName = input.required<string>();
}

CustomGroupIcon {
  readonly groupId = input.required<string | number>();
  // No custom styles - uses default Material Design
}

// ENHANCED: Wrapper Component with Optional Custom Template
VisTimelineWrapperComponent {
  readonly items = input.required<VisDataItem[]>();
  readonly groups = input.required<VisDataGroup[]>();
  readonly options = input<TimelineOptions>({});
  readonly groupTemplate = input<GroupTemplateFunction>(); // NEW: Optional custom template
}

// ENHANCED: Custom Template Component (demo implementation)
CustomGroupTemplateComponent {
  readonly groupId = input.required<string | number>();
  readonly groupContent = input.required<string>();
  // Uses mat-raised-button and mat-icon components
}
```

#### 4. ENHANCED: GroupTemplate Type System
```typescript
export type GroupTemplateFunction = (group: VisDataGroup) => HTMLElement;

// Usage Examples:
// Default behavior (no custom template)
<app-vis-timeline-wrapper [items]="items" [groups]="groups" [options]="options">

// With custom template
<app-vis-timeline-wrapper 
  [items]="items" 
  [groups]="groups" 
  [options]="options"
  [groupTemplate]="customGroupTemplate">
```

### Dependencies Fixed:
- Downgraded from Angular v20 to v19 for Cypress compatibility
- Fixed `@cypress/angular` version conflicts (using v3.0.1)
- Added explicit `@angular/platform-browser-dynamic@19.2.14` to resolve version warnings

### Test Coverage:
- Timeline container rendering and dimensions
- Material button rendering and styling with multiple colors
- Material icon rendering (both in buttons and standalone) with multiple icons
- Event handling for buttons and icons
- Theme colors and accessibility attributes
- Timeline functionality with custom templates
- **ENHANCED: Custom template rendering and functionality**
- **ENHANCED: Custom template Material component integration**
- **ENHANCED: Custom template button click handling**
- **ENHANCED: Fallback to default template when no custom template provided**
- **16 comprehensive Cypress component tests passing** (11 original + 5 new custom template tests)

### Commands:
```bash
# Run component tests
npx cypress run --component

# Start development server
npm start

# TypeScript compilation check
npx tsc --noEmit

# Open interactive Cypress test runner
npm run cypress:open
```

### Implementation Notes
- Group template creation uses `createComponent` API for Angular Material integration
- Color and icon assignment uses modulo operation for round-robin distribution  
- Tests focus on functionality over styling for maintainability
- All Material Design components use authentic theming (no CSS overrides)
- Updated tests accommodate style changes (removed custom icon styling)
- **ENHANCED: Generic template system supports any custom GroupTemplateFunction**
- **ENHANCED: Custom template service demonstrates proper Angular Material integration**
- **ENHANCED: App component includes toggle interface for switching between default and custom templates**

### NEW: Additional Components Created
- `CustomGroupTemplateComponent` - Example custom template using Angular Material components
- `CustomGroupTemplateService` - Service for creating custom templates with proper lifecycle management
- Enhanced test suite with comprehensive custom template coverage

**Proof of Concept Complete**: Angular Material components with dynamic colors and icons successfully render and function within vis-timeline group templates! **ENHANCED**: Generic custom template system allows any user-defined templates while maintaining full backward compatibility.