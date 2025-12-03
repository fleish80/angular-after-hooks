# Angular "After Render" APIs - Complete Guide

## Overview

Angular provides several APIs for running code in response to rendering lifecycle events. This guide covers all the "after render" APIs available in Angular 20+.

## 🎯 The APIs

### 1. **afterNextRender** (Stable since Angular 20)
- **Purpose**: Run callbacks **once** after the next render cycle
- **Use Case**: One-time DOM initialization, measuring elements, third-party library setup
- **Package**: `@angular/core`

### 2. **afterEveryRender** (Stable since Angular 20)
- **Purpose**: Run callbacks **every time** the application finishes rendering
- **Use Case**: DOM synchronization, animations, analytics
- **Package**: `@angular/core`
- **Note**: Previously called `afterRender` (renamed in Angular 20)

### 3. **afterRenderEffect** (Stable since Angular 20)
- **Purpose**: Create reactive effects that run as part of the afterRender sequence
- **Use Case**: Reactive DOM updates based on signal changes
- **Package**: `@angular/core`

### 4. **effect** (Stable since Angular 20)
- **Purpose**: General-purpose signal effect (not specifically tied to rendering)
- **Use Case**: Side effects in response to signal changes
- **Package**: `@angular/core`

## 📚 Historical Context

### What We Used Before

#### Before Angular 16:
```typescript
// Old approach: lifecycle hooks + setTimeout/requestAnimationFrame
export class OldComponent implements AfterViewInit {
  @ViewChild('element') element!: ElementRef;
  
  ngAfterViewInit() {
    // Problem: This runs in Angular's change detection
    // Can cause ExpressionChangedAfterItHasBeenCheckedError
    this.element.nativeElement.focus();
    
    // Workaround needed:
    setTimeout(() => {
      this.element.nativeElement.focus();
    }, 0);
  }
}
```

#### Issues with Old Approach:
- ❌ Required manual `setTimeout()`/`requestAnimationFrame()`
- ❌ Could cause change detection errors
- ❌ No fine-grained control over render phases
- ❌ Not reactive to signal changes

### Angular 16-19 (Developer Preview):
- `afterRender` and `afterNextRender` introduced
- Available but in developer preview (unstable API)

### Angular 20+ (Current - Stable):
- ✅ `afterRender` → renamed to `afterEveryRender`
- ✅ `afterNextRender` - stable
- ✅ `afterRenderEffect` - new, stable
- ✅ All APIs are production-ready

## 🔧 Render Phases

All after render APIs support multiple phases for fine-grained control:

```typescript
enum AfterRenderPhase {
  EarlyRead,  // Read DOM before writes
  Write,      // Modify DOM
  MixedReadWrite, // Both read and write (default)
  Read        // Read DOM after writes
}
```

### Phase Order:
1. **EarlyRead** → Read layout before any writes
2. **Write** → Make DOM modifications
3. **MixedReadWrite** → Default, can do both
4. **Read** → Read final layout after all writes

## 🎨 API Details

### afterNextRender

**Signature:**
```typescript
afterNextRender(callback: AfterRenderCallback, options?: AfterRenderOptions): void
afterNextRender(phases: AfterRenderPhasesCallbacks, options?: AfterRenderOptions): void
```

**Use Cases:**
- Initialize third-party libraries
- Measure element dimensions
- Set up one-time DOM interactions
- Focus management

**Example:**
```typescript
import { Component, afterNextRender, ElementRef, viewChild } from '@angular/core';

@Component({...})
export class MyComponent {
  inputRef = viewChild<ElementRef>('input');
  
  constructor() {
    afterNextRender(() => {
      // Runs once after the next render
      this.inputRef()?.nativeElement.focus();
    });
  }
}
```

### afterEveryRender

**Signature:**
```typescript
afterEveryRender(callback: AfterRenderCallback, options?: AfterRenderOptions): void
afterEveryRender(phases: AfterRenderPhasesCallbacks, options?: AfterRenderOptions): void
```

**Use Cases:**
- Sync with external libraries
- Continuous animations
- Analytics tracking
- Canvas rendering

**Example:**
```typescript
import { Component, afterEveryRender } from '@angular/core';

@Component({...})
export class MyComponent {
  constructor() {
    afterEveryRender(() => {
      // Runs after every render cycle
      console.log('Component rendered');
    });
  }
}
```

### afterRenderEffect

**Signature:**
```typescript
afterRenderEffect(effectFn: () => void, options?: CreateEffectOptions): EffectRef
```

**Use Cases:**
- Reactive DOM updates based on signals
- Combining signal reactivity with DOM manipulation
- Automatic cleanup with effect lifecycle

**Example:**
```typescript
import { Component, afterRenderEffect, signal, ElementRef, viewChild } from '@angular/core';

@Component({...})
export class MyComponent {
  count = signal(0);
  canvas = viewChild<ElementRef>('canvas');
  
  constructor() {
    afterRenderEffect(() => {
      // Re-runs when count() changes AND after render
      const ctx = this.canvas()?.nativeElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 200, 200);
        ctx.fillText(`Count: ${this.count()}`, 10, 50);
      }
    });
  }
}
```

### effect (Standard Signal Effect)

**Signature:**
```typescript
effect(effectFn: () => void, options?: CreateEffectOptions): EffectRef
```

**Use Cases:**
- General reactive side effects
- Logging, analytics
- Non-DOM state synchronization

**Example:**
```typescript
import { Component, effect, signal } from '@angular/core';

@Component({...})
export class MyComponent {
  count = signal(0);
  
  constructor() {
    effect(() => {
      // Runs whenever count changes (not tied to render cycle)
      console.log('Count changed:', this.count());
      localStorage.setItem('count', String(this.count()));
    });
  }
}
```

## ⚖️ Comparison Table

| API | When It Runs | Frequency | Reactive to Signals | Best For |
|-----|-------------|-----------|---------------------|----------|
| `afterNextRender` | After next render | Once | No | One-time DOM setup |
| `afterEveryRender` | After every render | Every render | No | Continuous DOM sync |
| `afterRenderEffect` | After render when signals change | On signal changes | Yes | Reactive DOM updates |
| `effect` | When signals change | On signal changes | Yes | Non-DOM side effects |

## 🚨 Important Rules

### 1. Call in Injection Context
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

### 2. Avoid in Reactive Contexts
Don't call these inside `computed()` or other effects:

```typescript
❌ Bad:
computed(() => {
  afterNextRender(() => { /* ... */ }); // Error NG0602!
});

✅ Good:
constructor() {
  afterNextRender(() => { /* ... */ });
}
```

### 3. Browser-Only by Default
These APIs only run in the browser (not during SSR):

```typescript
// Automatically skipped during SSR
afterNextRender(() => {
  // Safe to access DOM here
  document.querySelector('.my-element');
});
```

## 🎯 Use Case Decision Tree

```
Need to run code after rendering?
│
├─ Runs only once?
│  └─ Use: afterNextRender
│
├─ Runs every render?
│  ├─ Reacts to signal changes?
│  │  └─ Use: afterRenderEffect
│  │
│  └─ Always runs regardless of signals?
│     └─ Use: afterEveryRender
│
└─ Not tied to rendering?
   └─ Use: effect
```

## 🔄 Migration Guide

### From Angular 19 to 20+

```typescript
// Angular 19 (deprecated name)
import { afterRender } from '@angular/core';

afterRender(() => {
  // ...
});

// Angular 20+ (new name)
import { afterEveryRender } from '@angular/core';

afterEveryRender(() => {
  // ...
});
```

### From Legacy Lifecycle Hooks

```typescript
// ❌ Old way
export class OldComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;
  
  ngAfterViewInit() {
    setTimeout(() => {
      const ctx = this.canvas.nativeElement.getContext('2d');
      // draw...
    }, 0);
  }
}

// ✅ New way
export class NewComponent {
  canvas = viewChild<ElementRef>('canvas');
  
  constructor() {
    afterNextRender(() => {
      const ctx = this.canvas()?.nativeElement.getContext('2d');
      // draw...
    });
  }
}
```

## 🎓 Best Practices

1. **Prefer `afterNextRender` for initialization** - It's more efficient than `afterEveryRender`
2. **Use `afterRenderEffect` for reactive DOM updates** - Combines signals with render lifecycle
3. **Use render phases for performance** - Batch reads and writes appropriately
4. **Clean up when needed** - Store the returned cleanup function if needed
5. **Avoid heavy computations** - These run frequently, keep them light

## 📝 Summary

- ✅ **Angular 20+** has stable, production-ready after render APIs
- ✅ **`afterEveryRender`** replaces the old `afterRender` name
- ✅ **`afterRenderEffect`** is new and combines signals with rendering
- ✅ All APIs work seamlessly with **SSR** (automatically skipped)
- ✅ No more manual `setTimeout()` hacks needed!

## 🔗 Resources

- [Official Angular Lifecycle Documentation](https://angular.dev/guide/components/lifecycle)
- [Signals Guide](https://angular.dev/guide/signals)
- [Angular 20 Release Notes](https://github.com/angular/angular/releases)

