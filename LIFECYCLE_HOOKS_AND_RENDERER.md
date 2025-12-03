# Angular Lifecycle Hooks & Renderer Explained

## 📚 Table of Contents
1. [What is "Renderer" in Angular?](#what-is-renderer-in-angular)
2. [Traditional Lifecycle Hooks](#traditional-lifecycle-hooks)
3. [Deprecated Hooks](#deprecated-hooks)
4. [Modern After-Render APIs](#modern-after-render-apis)
5. [Migration Guide](#migration-guide)
6. [Comparison Table](#comparison-table)

---

## What is "Renderer" in Angular?

### Understanding the Render Cycle

**"Renderer"** in Angular refers to the **rendering engine** that updates the DOM (Document Object Model) based on your component's state and template.

### The Rendering Process

```
Component State Change
    ↓
Change Detection Runs
    ↓
Template Re-evaluation
    ↓
DOM Updates (Rendering)
    ↓
After Render Phase ← You can hook into here!
```

### Key Concepts

#### 1. **Change Detection**
- Angular checks if component data has changed
- Compares current values with previous values
- Determines what needs to be updated

#### 2. **Template Evaluation**
- Angular evaluates your template expressions (`{{ }}`, `*ngIf`, etc.)
- Creates/updates virtual DOM structure
- Calculates what DOM elements need to be created, updated, or removed

#### 3. **DOM Rendering**
- Angular updates the actual browser DOM
- Creates new elements
- Updates existing elements
- Removes deleted elements
- Applies CSS classes and styles

#### 4. **After Render Phase**
- **This is where the new APIs run!**
- DOM is fully updated and stable
- Safe to read DOM measurements
- Safe to manipulate DOM
- Safe to initialize third-party libraries

### Why "After Render" Matters

**Before After-Render APIs:**
```typescript
// ❌ Problem: DOM might not be ready yet
ngAfterViewInit() {
  // This runs DURING change detection
  // DOM might still be updating!
  this.element.nativeElement.focus(); // Could fail!
  
  // Workaround: Delay with setTimeout
  setTimeout(() => {
    this.element.nativeElement.focus(); // Works, but hacky
  }, 0);
}
```

**With After-Render APIs:**
```typescript
// ✅ Solution: Runs AFTER render is complete
constructor() {
  afterNextRender(() => {
    // DOM is guaranteed to be ready!
    this.element()?.nativeElement.focus(); // Always works!
  });
}
```

---

## Traditional Lifecycle Hooks

### Overview

Angular has provided lifecycle hooks since the beginning. These hooks run at specific points during a component's lifecycle.

### The Complete Lifecycle Sequence

```
1. constructor()           ← Component instantiated
2. ngOnChanges()          ← Inputs changed
3. ngOnInit()             ← Component initialized
4. ngDoCheck()            ← Custom change detection
5. ngAfterContentInit()   ← Content projection initialized
6. ngAfterContentChecked() ← Content projection checked
7. ngAfterViewInit()      ← View initialized
8. ngAfterViewChecked()   ← View checked
9. ngAfterRender()        ← NEW: After render (Angular 16+)
10. ngOnDestroy()         ← Component destroyed
```

### Traditional Hooks Explained

#### 1. **ngOnInit()**
```typescript
export class MyComponent implements OnInit {
  ngOnInit() {
    // Runs once after first ngOnChanges()
    // Good for: Initialization logic, API calls
  }
}
```

**When it runs:** After the first change detection cycle
**Use case:** Component initialization

#### 2. **ngAfterViewInit()**
```typescript
export class MyComponent implements AfterViewInit {
  @ViewChild('element') element!: ElementRef;
  
  ngAfterViewInit() {
    // Runs once after view is initialized
    // ⚠️ Problem: Runs DURING change detection
    // ⚠️ DOM might not be fully stable
    this.element.nativeElement.focus();
  }
}
```

**When it runs:** After Angular initializes the component's views and child views
**Use case:** Accessing ViewChild elements
**Problem:** Runs during change detection, DOM might not be ready

#### 3. **ngAfterViewChecked()**
```typescript
export class MyComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    // Runs after EVERY change detection check
    // ⚠️ Performance concern: Runs very frequently!
    console.log('View checked');
  }
}
```

**When it runs:** After every change detection check of component's views
**Use case:** Rarely needed, mostly for debugging
**Problem:** Runs too frequently, can hurt performance

#### 4. **ngAfterContentInit()**
```typescript
export class MyComponent implements AfterContentInit {
  @ContentChild('projected') projected!: ElementRef;
  
  ngAfterContentInit() {
    // Runs after content projection is initialized
    // Access to projected content
  }
}
```

**When it runs:** After Angular projects external content into the component
**Use case:** Working with content projection (`<ng-content>`)

#### 5. **ngAfterContentChecked()**
```typescript
export class MyComponent implements AfterContentChecked {
  ngAfterContentChecked() {
    // Runs after every check of projected content
    // ⚠️ Performance concern: Runs very frequently!
  }
}
```

**When it runs:** After every change detection check of projected content
**Use case:** Rarely needed
**Problem:** Runs too frequently

---

## Deprecated Hooks

### ⚠️ Important: None are Officially Deprecated (Yet)

**Current Status (Angular 20):**
- ✅ **Traditional hooks are still supported** (`ngAfterViewInit`, `ngOnInit`, etc.)
- ✅ **They are NOT deprecated** - you can still use them
- ⚠️ **But they have limitations** - which is why new APIs were created

### Why New APIs Were Created

The traditional hooks have these problems:

#### 1. **Timing Issues**
```typescript
// ❌ Problem: Runs during change detection
ngAfterViewInit() {
  // DOM might not be fully updated
  // Can cause ExpressionChangedAfterItHasBeenCheckedError
  this.element.nativeElement.focus();
  
  // Need workaround:
  setTimeout(() => {
    this.element.nativeElement.focus();
  }, 0);
}
```

#### 2. **No Signal Integration**
```typescript
// ❌ Problem: Not reactive to signals
ngAfterViewInit() {
  // This only runs once
  // Won't react to signal changes
  this.updateCanvas();
}
```

#### 3. **Performance Concerns**
```typescript
// ❌ Problem: Runs too frequently
ngAfterViewChecked() {
  // Runs after EVERY change detection
  // Can hurt performance
  this.syncWithExternalLibrary();
}
```

#### 4. **SSR Issues**
```typescript
// ❌ Problem: Runs during SSR (server-side rendering)
ngAfterViewInit() {
  // This runs on server too!
  // Can cause errors if accessing DOM
  document.querySelector('.element'); // Error on server!
}
```

### Future Deprecation Path

While not deprecated yet, Angular is moving toward:
- ✅ **Functional APIs** (like `afterNextRender()`)
- ✅ **Signal-based reactivity**
- ✅ **Better SSR support**
- ⚠️ **Class-based hooks may be deprecated in future versions**

---

## Modern After-Render APIs

### The New Approach (Angular 16-20)

Angular introduced new APIs that solve the problems of traditional hooks:

### 1. **afterNextRender()** (Stable in Angular 20)

**Replaces:** `ngAfterViewInit()` for one-time DOM access

```typescript
// ✅ New way
constructor() {
  afterNextRender(() => {
    // Runs ONCE after next render
    // DOM is guaranteed ready
    // SSR-safe (skips on server)
    this.element()?.nativeElement.focus();
  });
}
```

**Advantages:**
- ✅ Runs AFTER render completes
- ✅ SSR-safe (automatically skipped)
- ✅ No setTimeout needed
- ✅ Works with signals

**Migration:**
```typescript
// ❌ Old way
export class OldComponent implements AfterViewInit {
  @ViewChild('input') input!: ElementRef;
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.input.nativeElement.focus();
    }, 0);
  }
}

// ✅ New way
export class NewComponent {
  input = viewChild<ElementRef>('input');
  
  constructor() {
    afterNextRender(() => {
      this.input()?.nativeElement.focus();
    });
  }
}
```

### 2. **afterEveryRender()** (Stable in Angular 20)

**Replaces:** `ngAfterViewChecked()` for continuous DOM sync

```typescript
// ✅ New way
constructor() {
  afterEveryRender(() => {
    // Runs after EVERY render
    // DOM is guaranteed ready
    // SSR-safe
    this.syncWithExternalLibrary();
  });
}
```

**Note:** Previously called `afterRender()` in Angular 16-19, renamed in Angular 20.

**Advantages:**
- ✅ Runs AFTER render completes
- ✅ SSR-safe
- ✅ Better performance than `ngAfterViewChecked()`
- ✅ Can use render phases for optimization

**Migration:**
```typescript
// ❌ Old way
export class OldComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    // Runs during change detection
    // Performance concern
    this.syncWithExternalLibrary();
  }
}

// ✅ New way
export class NewComponent {
  constructor() {
    afterEveryRender(() => {
      // Runs after render
      // Better performance
      this.syncWithExternalLibrary();
    });
  }
}
```

### 3. **afterRenderEffect()** (Stable in Angular 20)

**New API:** Combines signals with render timing

```typescript
// ✅ New way - Reactive!
constructor() {
  count = signal(0);
  
  afterRenderEffect(() => {
    // Re-runs when count() changes
    // AND after render completes
    const value = this.count();
    this.updateCanvas(value);
  });
}
```

**Advantages:**
- ✅ Reactive to signal changes
- ✅ Runs after render
- ✅ Automatic cleanup
- ✅ SSR-safe

**No direct replacement:** This is a new capability that wasn't possible with traditional hooks!

### 4. **effect()** (Stable in Angular 16)

**Not specifically for rendering:** General signal effect

```typescript
// ✅ For non-DOM side effects
constructor() {
  count = signal(0);
  
  effect(() => {
    // Runs when count() changes
    // Not tied to render cycle
    localStorage.setItem('count', String(this.count()));
  });
}
```

**Use case:** Side effects not related to DOM

---

## Migration Guide

### From ngAfterViewInit → afterNextRender

```typescript
// ❌ Before
export class MyComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;
  
  ngAfterViewInit() {
    setTimeout(() => {
      const ctx = this.canvas.nativeElement.getContext('2d');
      this.draw(ctx);
    }, 0);
  }
}

// ✅ After
export class MyComponent {
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  
  constructor() {
    afterNextRender(() => {
      const ctx = this.canvas()?.nativeElement.getContext('2d');
      if (ctx) {
        this.draw(ctx);
      }
    });
  }
}
```

### From ngAfterViewChecked → afterEveryRender

```typescript
// ❌ Before
export class MyComponent implements AfterViewChecked {
  ngAfterViewChecked() {
    // Runs during change detection
    this.syncChart();
  }
}

// ✅ After
export class MyComponent {
  constructor() {
    afterEveryRender(() => {
      // Runs after render
      this.syncChart();
    });
  }
}
```

### From ngAfterViewInit + Manual Signal Tracking → afterRenderEffect

```typescript
// ❌ Before
export class MyComponent implements AfterViewInit {
  count = signal(0);
  @ViewChild('canvas') canvas!: ElementRef;
  
  ngAfterViewInit() {
    setTimeout(() => {
      this.updateCanvas();
    }, 0);
  }
  
  increment() {
    this.count.update(c => c + 1);
    // Need to manually call updateCanvas()
    setTimeout(() => {
      this.updateCanvas();
    }, 0);
  }
  
  updateCanvas() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    ctx.fillText(`Count: ${this.count()}`, 10, 50);
  }
}

// ✅ After
export class MyComponent {
  count = signal(0);
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  
  constructor() {
    afterRenderEffect(() => {
      // Automatically re-runs when count() changes!
      const ctx = this.canvas()?.nativeElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 200, 200);
        ctx.fillText(`Count: ${this.count()}`, 10, 50);
      }
    });
  }
  
  increment() {
    this.count.update(c => c + 1);
    // Canvas updates automatically!
  }
}
```

---

## Comparison Table

| Feature | Traditional Hooks | After-Render APIs |
|---------|------------------|-------------------|
| **Timing** | During change detection | After render completes |
| **DOM Ready** | ❌ Might not be ready | ✅ Guaranteed ready |
| **setTimeout Needed** | ❌ Often required | ✅ Never needed |
| **SSR Support** | ❌ Runs on server | ✅ Automatically skipped |
| **Signal Integration** | ❌ Not reactive | ✅ Fully reactive (afterRenderEffect) |
| **Performance** | ⚠️ Can be slow | ✅ Optimized |
| **Render Phases** | ❌ Not available | ✅ Fine-grained control |
| **Cleanup** | ⚠️ Manual | ✅ Automatic |

### Hook-by-Hook Comparison

| Traditional Hook | Modern Replacement | When to Use |
|-----------------|-------------------|-------------|
| `ngOnInit()` | Still use it! | Component initialization |
| `ngAfterViewInit()` | `afterNextRender()` | One-time DOM access |
| `ngAfterViewChecked()` | `afterEveryRender()` | Continuous DOM sync |
| `ngAfterContentInit()` | Still use it! | Content projection |
| `ngAfterContentChecked()` | Rarely needed | Content projection checks |
| Manual signal tracking | `afterRenderEffect()` | Reactive DOM updates |

---

## Key Takeaways

### What is "Renderer"?

**Renderer** = Angular's process of updating the DOM based on component state and templates.

**Render Cycle:**
1. Change detection runs
2. Templates are evaluated
3. DOM is updated
4. **After render phase** ← New APIs hook here!

### Deprecation Status

- ✅ **Traditional hooks are NOT deprecated** (as of Angular 20)
- ⚠️ **But they have limitations** that new APIs solve
- 🔮 **Future versions may deprecate them** in favor of functional APIs

### When to Use What

**Use Traditional Hooks:**
- `ngOnInit()` - Component initialization
- `ngAfterContentInit()` - Content projection
- `ngOnDestroy()` - Cleanup

**Use After-Render APIs:**
- `afterNextRender()` - One-time DOM access (replaces `ngAfterViewInit`)
- `afterEveryRender()` - Continuous DOM sync (replaces `ngAfterViewChecked`)
- `afterRenderEffect()` - Reactive DOM updates (new capability!)

**Use effect():**
- Non-DOM side effects
- LocalStorage sync
- API calls
- Logging

### Best Practices

1. ✅ **Prefer after-render APIs** for DOM manipulation
2. ✅ **Use afterNextRender** instead of `ngAfterViewInit` + `setTimeout`
3. ✅ **Use afterRenderEffect** for reactive DOM updates
4. ✅ **Keep traditional hooks** for initialization (`ngOnInit`)
5. ⚠️ **Avoid ngAfterViewChecked** - use `afterEveryRender` instead

---

## Summary

### The Evolution

```
Angular < 16:
  ngAfterViewInit + setTimeout() hacks
    ↓
Angular 16-19:
  afterRender() (preview)
  afterNextRender() (preview)
    ↓
Angular 20+:
  afterEveryRender() (stable, renamed)
  afterNextRender() (stable)
  afterRenderEffect() (stable, new!)
```

### What Changed

- ✅ **Timing:** APIs run AFTER render, not during
- ✅ **SSR:** Automatically skipped during server-side rendering
- ✅ **Signals:** Full integration with reactive signals
- ✅ **Performance:** Better optimized than traditional hooks
- ✅ **No Hacks:** No more `setTimeout()` workarounds needed

### What Stayed

- ✅ Traditional hooks still work
- ✅ `ngOnInit()` still recommended for initialization
- ✅ `ngOnDestroy()` still needed for cleanup
- ✅ Content projection hooks still useful

---

## Resources

- [Angular Lifecycle Documentation](https://angular.dev/guide/components/lifecycle)
- [After Render APIs Guide](./AFTER_RENDER_APIS.md)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular 20 Release Notes](https://github.com/angular/angular/releases)

---

*Last updated: December 2024*
*Angular Version: 20+*

