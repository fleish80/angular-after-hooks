# Angular After Render APIs - Cheat Sheet

Quick reference for Angular 20/21 render lifecycle hooks.

## 📌 Import Statements

```typescript
import { 
  afterNextRender, 
  afterEveryRender, 
  afterRenderEffect, 
  effect 
} from '@angular/core';
```

## 🎯 afterNextRender

**Purpose**: Run callback once after the next render

```typescript
constructor() {
  afterNextRender(() => {
    // Runs once after next render
    this.inputRef()?.nativeElement.focus();
  });
}
```

**With phases**:
```typescript
import { AfterRenderPhase } from '@angular/core';

afterNextRender({
  [AfterRenderPhase.Write]: () => {
    // Write to DOM
    element.style.width = '100px';
  },
  [AfterRenderPhase.Read]: () => {
    // Read from DOM
    const height = element.offsetHeight;
  }
});
```

**Use cases**:
- ✅ Auto-focus inputs
- ✅ Measure element dimensions
- ✅ Initialize third-party libraries
- ✅ One-time DOM setup

## 🔄 afterEveryRender

**Purpose**: Run callback after every render

```typescript
constructor() {
  afterEveryRender(() => {
    // Runs after EVERY render
    console.log('Component rendered');
  });
}
```

**With options**:
```typescript
import { inject, Injector } from '@angular/core';

constructor() {
  const injector = inject(Injector);
  
  afterEveryRender(() => {
    // Your code
  }, { injector });
}
```

**Use cases**:
- ✅ Continuous DOM synchronization
- ✅ Analytics tracking
- ✅ Third-party library sync
- ⚠️ Use sparingly (performance)

**Migration from Angular 19**:
```typescript
// ❌ Angular 19 (deprecated)
import { afterRender } from '@angular/core';
afterRender(() => { /* ... */ });

// ✅ Angular 20+ (current)
import { afterEveryRender } from '@angular/core';
afterEveryRender(() => { /* ... */ });
```

## ⚡ afterRenderEffect

**Purpose**: Reactive effect that runs after render when signals change

```typescript
constructor() {
  afterRenderEffect(() => {
    // Tracks signal reads
    const value = this.mySignal();
    
    // Update DOM reactively
    this.canvas()?.nativeElement.draw(value);
  });
}
```

**With cleanup**:
```typescript
constructor() {
  afterRenderEffect((onCleanup) => {
    const subscription = setupSomething();
    
    onCleanup(() => {
      subscription.unsubscribe();
    });
  });
}
```

**Use cases**:
- ✅ Reactive canvas/SVG drawing
- ✅ DOM updates based on signals
- ✅ Combining signals with DOM
- ✅ Automatic effect cleanup

## 💫 effect

**Purpose**: General signal effect (not tied to rendering)

```typescript
constructor() {
  effect(() => {
    // Runs when signals change
    const username = this.username();
    localStorage.setItem('username', username);
  });
}
```

**With options**:
```typescript
import { effect } from '@angular/core';

constructor() {
  effect(() => {
    console.log(this.count());
  }, {
    allowSignalWrites: false // default
  });
}
```

**Use cases**:
- ✅ LocalStorage sync
- ✅ Analytics/logging
- ✅ API calls on state changes
- ✅ Non-DOM side effects

## 🆚 Quick Comparison

| API | Runs When | Frequency | Reactive | SSR | Use For |
|-----|-----------|-----------|----------|-----|---------|
| **afterNextRender** | After next render | Once | ❌ | Skip | One-time setup |
| **afterEveryRender** | After every render | Every time | ❌ | Skip | Continuous sync |
| **afterRenderEffect** | After render + signals | On change | ✅ | Skip | Reactive DOM |
| **effect** | When signals change | On change | ✅ | Runs | Non-DOM effects |

## 🎯 Decision Tree

```
Need to run code?
│
├─ After rendering?
│  ├─ Once? → afterNextRender
│  └─ Every render?
│     ├─ Reactive to signals? → afterRenderEffect
│     └─ Always? → afterEveryRender
│
└─ Not tied to rendering?
   └─ effect
```

## 📋 Render Phases

```typescript
import { AfterRenderPhase } from '@angular/core';

enum AfterRenderPhase {
  EarlyRead,      // Read before writes
  Write,          // Write to DOM
  MixedReadWrite, // Both (default)
  Read            // Read after writes
}
```

**Phase order**: EarlyRead → Write → MixedReadWrite → Read

**Example with multiple phases**:
```typescript
afterNextRender({
  [AfterRenderPhase.EarlyRead]: () => {
    // Read layout before changes
    const width = element.offsetWidth;
  },
  [AfterRenderPhase.Write]: () => {
    // Make DOM changes
    element.style.width = '200px';
  },
  [AfterRenderPhase.Read]: () => {
    // Read final layout
    const newWidth = element.offsetWidth;
  }
});
```

## ⚠️ Important Rules

### 1. Call in Injection Context
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

### 2. Don't Call in Reactive Context
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

### 3. SSR Considerations
```typescript
// After render APIs are automatically skipped during SSR
afterNextRender(() => {
  // Safe to access browser APIs
  document.querySelector('.element');
  window.localStorage.getItem('key');
});

// effect() RUNS during SSR - be careful!
effect(() => {
  // This runs on server too!
  if (typeof window !== 'undefined') {
    // Browser-only code
  }
});
```

## 💡 Common Patterns

### Auto-focus Input
```typescript
inputRef = viewChild<ElementRef>('input');

constructor() {
  afterNextRender(() => {
    this.inputRef()?.nativeElement.focus();
  });
}
```

### Canvas Drawing
```typescript
canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
count = signal(0);

constructor() {
  afterRenderEffect(() => {
    const ctx = this.canvas()?.nativeElement.getContext('2d');
    const value = this.count(); // Reactive!
    
    ctx?.clearRect(0, 0, 400, 200);
    ctx?.fillRect(0, 0, value * 10, 100);
  });
}
```

### LocalStorage Sync
```typescript
username = signal('');

constructor() {
  // Load initial
  const saved = localStorage.getItem('username');
  if (saved) this.username.set(saved);
  
  // Sync changes
  effect(() => {
    const name = this.username();
    if (name) {
      localStorage.setItem('username', name);
    } else {
      localStorage.removeItem('username');
    }
  });
}
```

### Third-party Library
```typescript
container = viewChild<ElementRef>('container');

constructor() {
  afterNextRender(() => {
    const el = this.container()?.nativeElement;
    if (el) {
      new ThirdPartyLib(el, { /* options */ });
    }
  });
}
```

## 🔗 Resources

- [Angular Lifecycle Docs](https://angular.dev/guide/components/lifecycle)
- [Signals Guide](https://angular.dev/guide/signals)
- [Error NG0602](https://angular.dev/errors/NG0602)

## 📅 Version History

- **Angular 16**: Developer preview (unstable)
- **Angular 17-19**: Developer preview
- **Angular 20**: 
  - `afterRender` → renamed to `afterEveryRender`
  - `afterRenderEffect` becomes stable
  - All APIs stable ✅
- **Angular 21**: All features continue to be stable

---

**Print this and keep it handy! 📄**

