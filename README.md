# Angular "After Render" APIs - Complete Presentation

> 🎯 **A comprehensive, interactive presentation about Angular's "after render" lifecycle APIs**

This project provides a complete guide to understanding and using Angular 20/21's render lifecycle APIs: `afterNextRender`, `afterEveryRender`, `afterRenderEffect`, and `effect`.

## 🌟 Features

- ✅ **Interactive Demos** - Live, working examples of each API
- ✅ **Comprehensive Documentation** - Detailed guides and comparisons
- ✅ **Real-World Examples** - Practical use cases you'll encounter
- ✅ **Migration Guide** - How to upgrade from Angular 19
- ✅ **Modern Angular** - Uses Angular 20/21 with signals, standalone components, and new control flow
- ✅ **Best Practices** - Follows all Angular best practices

## 🚀 Quick Start

### Installation & Running

```bash
# Install dependencies
npm install

# Start the development server
npm start
# or
npx nx serve main-app

# Open browser to http://localhost:4200
```

### Building for Production

```bash
# Build the app
npm run build
# or
npx nx build main-app
```

## 📚 What's Covered

### 1. afterNextRender
- Runs **once** after the next render
- Perfect for one-time DOM initialization
- Examples: auto-focus, measuring elements, third-party library setup

### 2. afterEveryRender
- Runs **every time** after rendering completes
- Previously called `afterRender` (renamed in Angular 20)
- Examples: continuous DOM sync, analytics tracking

### 3. afterRenderEffect
- **New in Angular 19/20** - Stable in 20
- Combines signal reactivity with render timing
- Examples: reactive canvas drawing, progress bars

### 4. effect
- General-purpose signal effect
- Not tied to render cycle
- Examples: localStorage sync, logging, API calls

### 5. Lifecycle Hooks Comparison
- Understanding traditional lifecycle hooks
- What "renderer" means in Angular
- Migration from old to new APIs
- Deprecation status and future

## 📖 Documentation

- **[AFTER_RENDER_APIS.md](./AFTER_RENDER_APIS.md)** - Complete written guide with code examples
- **[LIFECYCLE_HOOKS_AND_RENDERER.md](./LIFECYCLE_HOOKS_AND_RENDERER.md)** - Traditional hooks vs. modern APIs
- **[PRESENTATION_GUIDE.md](./PRESENTATION_GUIDE.md)** - Guide for presenting to your team
- **[CHEAT_SHEET.md](./CHEAT_SHEET.md)** - Quick reference guide
- **Interactive App** - Run the app to see live demos with explanations

## 🎯 Learning Path

1. **Read the overview** - Start with `AFTER_RENDER_APIS.md`
2. **Run the app** - See live demos and interactive examples
3. **Check the code** - All demos are in `apps/main-app/src/app/demos/`
4. **Present to your team** - Use `PRESENTATION_GUIDE.md` for tips

## 🛠️ Technical Stack

- **Angular 20/21** - Latest features
- **TypeScript** - Strict mode
- **Nx** - Monorepo tooling
- **Standalone Components** - No NgModules
- **Signals** - Modern reactivity
- **Modern Control Flow** - `@if`, `@for`, `@switch`
- **OnPush Change Detection** - Best performance

## 🆚 Quick API Comparison

| API | Timing | Frequency | Reactive | Best For |
|-----|--------|-----------|----------|----------|
| `afterNextRender` | After next render | Once | No | One-time setup |
| `afterEveryRender` | After every render | Every render | No | Continuous sync |
| `afterRenderEffect` | After render + signal | On signal change | Yes | Reactive DOM |
| `effect` | When signals change | On signal change | Yes | Non-DOM effects |

## 📂 Project Structure

```
angular-after-hooks/
├── AFTER_RENDER_APIS.md             # Detailed written guide
├── LIFECYCLE_HOOKS_AND_RENDERER.md  # Lifecycle hooks & renderer explained
├── PRESENTATION_GUIDE.md            # Presentation tips
├── CHEAT_SHEET.md                   # Quick reference
├── README.md                        # This file
└── apps/
    └── main-app/
        └── src/
            └── app/
                ├── demos/
                │   ├── presentation.ts                 # Main presentation component
                │   ├── after-next-render-demo.ts       # afterNextRender examples
                │   ├── after-every-render-demo.ts      # afterEveryRender examples
                │   ├── after-render-effect-demo.ts     # afterRenderEffect examples
                │   ├── effect-demo.ts                  # effect examples
                │   └── lifecycle-comparison-demo.ts    # Hooks comparison
                └── app.routes.ts                       # Routing configuration
```

## 🎓 Key Concepts

### Injection Context
All these APIs must be called in an injection context (constructor, field initializer):

```typescript
✅ Good:
constructor() {
  afterNextRender(() => { /* ... */ });
}

❌ Bad:
ngOnInit() {
  afterNextRender(() => { /* ... */ }); // Error!
}
```

### SSR Safety
After render APIs automatically skip during SSR:
- ✅ `afterNextRender` - skipped
- ✅ `afterEveryRender` - skipped
- ✅ `afterRenderEffect` - skipped
- ⚠️ `effect` - runs on server

### Migration from Angular 19

```typescript
// Angular 19 (deprecated)
import { afterRender } from '@angular/core';

afterRender(() => {
  // ...
});

// Angular 20+ (current)
import { afterEveryRender } from '@angular/core';

afterEveryRender(() => {
  // ...
});
```

## 💡 When to Use Each API

### Use `afterNextRender` when:
- ✅ Initializing third-party libraries
- ✅ Auto-focusing inputs
- ✅ Measuring element dimensions
- ✅ One-time DOM setup

### Use `afterEveryRender` when:
- ✅ Syncing with external libraries continuously
- ✅ Tracking renders for analytics
- ✅ Continuous DOM updates
- ⚠️ Use sparingly (runs often)

### Use `afterRenderEffect` when:
- ✅ Reactive canvas/SVG drawing
- ✅ DOM updates based on signal changes
- ✅ Combining signals with DOM manipulation
- ✅ Automatic cleanup needed

### Use `effect` when:
- ✅ Logging/analytics not tied to DOM
- ✅ LocalStorage synchronization
- ✅ API calls on state changes
- ✅ Non-DOM side effects

## 🔗 Resources

- [Official Angular Lifecycle Documentation](https://angular.dev/guide/components/lifecycle)
- [Signals Guide](https://angular.dev/guide/signals)
- [Angular 20 Release Notes](https://github.com/angular/angular/releases)

## 📝 Nx Workspace

This project was generated using [Nx](https://nx.dev).

### Useful Nx Commands

```sh
# Serve the application
npx nx serve main-app

# Build the application
npx nx build main-app

# Run tests
npx nx test main-app

# View project graph
npx nx graph

# List all projects
npx nx list
```

### Learn More About Nx

- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx)
- [Nx Documentation](https://nx.dev)
- [Nx Console for VSCode](https://nx.dev/getting-started/editor-setup)

## 🤝 Contributing

This is a learning resource. Feel free to:
- Add more examples
- Improve documentation
- Fix bugs
- Share with your team

## 📄 License

Use this presentation freely for team training and education!

---

**Made with ❤️ for the Angular community**

For detailed presentation instructions, see [PRESENTATION_GUIDE.md](./PRESENTATION_GUIDE.md)
