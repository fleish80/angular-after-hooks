import {
  Component,
  ChangeDetectionStrategy,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';

/**
 * Demonstrates the full surface area of afterNextRender / afterEveryRender:
 *   - The four render phases (earlyRead, write, mixedReadWrite, read) and the order they run in.
 *   - The single-callback shorthand vs the phase-object form.
 *   - The `injector` option for calling these APIs outside an injection context.
 *
 * The "write" example mirrors a real-world pattern: tagging the primary action of a dialog
 * with `cdkFocusInitial` after the DOM exists.
 */
@Component({
  selector: 'app-phases-and-options-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-card">
      <h2>🧩 Render Phases & Options</h2>

      <div class="info-box">
        <h3>The four render phases</h3>
        <p>
          Both <code>afterNextRender</code> and <code>afterEveryRender</code> accept either a
          single callback (which defaults to the <code>mixedReadWrite</code> phase) or an object
          keyed by phase name. Phases run in this strict order per render:
        </p>
        <ol class="phase-list">
          <li>
            <strong>earlyRead</strong> — read layout values that a later <code>write</code> phase
            will need. Prefer <code>read</code> when possible; <code>earlyRead</code> exists
            specifically to let a <code>write</code> phase consume the result.
          </li>
          <li>
            <strong>write</strong> — write to the DOM. Reading layout here forces a synchronous
            recalc (layout thrash). The user's example below lives here.
          </li>
          <li>
            <strong>mixedReadWrite</strong> — default phase for the single-callback form. Use as
            a last resort: it can read and write but the browser must assume worst-case layout
            invalidation.
          </li>
          <li>
            <strong>read</strong> — read layout/geometry after writes have settled. Best phase
            for measurements like <code>getBoundingClientRect()</code>.
          </li>
        </ol>
      </div>

      <div class="example-section">
        <h3>Example 1: live phase-order log</h3>
        <p>
          One callback registered per phase in a single <code>afterNextRender(&#123;...&#125;)</code>
          call. Angular invokes them in the canonical order regardless of how we list them
          in the object:
        </p>
        <ol class="run-log">
          @for (entry of phaseLog(); track entry.phase) {
            <li class="run-log-entry">
              <span class="phase-name">{{ entry.phase }}</span>
              <span class="phase-detail">{{ entry.detail }}</span>
            </li>
          }
        </ol>
        <pre class="inline-code"><code>{{ codePhases }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 2: the <code>write</code> phase — focus the primary action</h3>
        <p>
          After the next render, the <code>write</code> phase stamps <code>cdkFocusInitial</code>
          onto the primary action button so a CDK dialog would pick it up as the
          initially-focused element. This is the exact snippet from the request:
        </p>
        <div class="tufin-dialog" #hostEl>
          <div class="tufin-dialog-body">Are you sure you want to continue?</div>
          <div class="tufin-dialog-actions">
            <button type="button" data-tufin-button-role="secondary">Cancel</button>
            <button type="button" data-tufin-button-role="primary">Confirm</button>
          </div>
        </div>
        @if (primaryActionTagged() !== null) {
          <p class="result">
            ✓ Primary action now carries
            <code>cdkFocusInitial="{{ primaryActionTagged() }}"</code>
          </p>
        }
        <pre class="inline-code"><code>{{ codeWrite }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 3: the <code>read</code> phase — measure without layout thrash</h3>
        <p>
          The <code>read</code> phase is the right home for measurements — it runs after all
          writes have flushed, so <code>getBoundingClientRect()</code> doesn't force an extra
          layout pass.
        </p>
        <div #measureMe class="measure-target">Measure me!</div>
        @if (measured()) {
          <p class="result">
            📏 {{ measured()?.width }}px × {{ measured()?.height }}px (read phase)
          </p>
        }
        <pre class="inline-code"><code>{{ codeRead }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 4: the <code>injector</code> option</h3>
        <p>
          <code>afterNextRender</code> normally has to be called from an injection context
          (constructor, factory, field initializer). To register it from anywhere else — for
          example inside an event handler or a method — pass an explicit
          <code>Injector</code> via the options bag.
        </p>
        <button type="button" class="demo-button" (click)="scheduleOutOfContext()">
          Schedule write callback from an event handler
        </button>
        @if (outOfContextCount() > 0) {
          <p class="result">
            ✓ Callback registered via <code>&#123; injector &#125;</code> ran
            {{ outOfContextCount() }} time(s)
          </p>
        }
        <pre class="inline-code"><code>{{ codeInjector }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 5: <code>afterEveryRender</code> accepts the same phases</h3>
        <p>
          Everything above applies identically to <code>afterEveryRender</code> — the same four
          phases, the same <code>injector</code> option, the same single-callback shorthand. The
          only difference is the registered callbacks run on <em>every</em> render, not just the
          next one.
        </p>
        <pre class="inline-code"><code>{{ codeEveryRender }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-card {
      padding: 2rem;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      border-radius: 12px;
      color: white;
      margin-bottom: 2rem;
    }

    h2 {
      margin-block-start: 0;
      font-size: 2rem;
    }

    .info-box,
    .example-section {
      background: rgba(255, 255, 255, 0.12);
      padding: 1.5rem;
      border-radius: 8px;
      margin-block-end: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .info-box h3,
    .example-section h3 {
      margin-block-start: 0;
      color: #fff8b0;
    }

    code {
      background: rgba(0, 0, 0, 0.3);
      padding: 0.15rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    .phase-list {
      margin: 0;
      padding-inline-start: 1.25rem;
    }

    .phase-list li {
      margin-block: 0.5rem;
      line-height: 1.55;
    }

    .run-log {
      list-style: none;
      margin: 0;
      padding: 0;
      counter-reset: phase;
    }

    .run-log-entry {
      counter-increment: phase;
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      padding: 0.6rem 0.9rem;
      margin-block: 0.4rem;
      background: rgba(0, 0, 0, 0.25);
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 0.95rem;
    }

    .run-log-entry::before {
      content: counter(phase);
      flex: 0 0 1.5rem;
      text-align: center;
      font-weight: bold;
      color: #fff8b0;
    }

    .phase-name {
      font-weight: bold;
      color: #fff8b0;
      min-inline-size: 9rem;
    }

    .phase-detail {
      opacity: 0.9;
    }

    .tufin-dialog {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 8px;
      padding: 1.25rem;
      margin-block: 1rem;
    }

    .tufin-dialog-body {
      margin-block-end: 1rem;
    }

    .tufin-dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }

    .tufin-dialog-actions button {
      padding: 0.55rem 1.1rem;
      border-radius: 6px;
      border: none;
      font-weight: 600;
      cursor: pointer;
    }

    .tufin-dialog-actions button[data-tufin-button-role="secondary"] {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .tufin-dialog-actions button[data-tufin-button-role="primary"] {
      background: #fff8b0;
      color: #1d1d1d;
    }

    .tufin-dialog-actions button[cdkFocusInitial] {
      outline: 3px solid #ff6b6b;
      outline-offset: 2px;
    }

    .measure-target {
      background: rgba(255, 248, 176, 0.25);
      border: 2px dashed #fff8b0;
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
    }

    .demo-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.85rem 1.5rem;
      font-size: 0.95rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 18px rgba(0, 0, 0, 0.3);
    }

    .result {
      background: rgba(76, 175, 80, 0.3);
      padding: 0.75rem;
      border-radius: 6px;
      border-inline-start: 4px solid #4caf50;
      margin-block: 1rem;
    }

    .inline-code {
      background: rgba(0, 0, 0, 0.35);
      padding: 1rem;
      border-radius: 8px;
      margin-block: 1rem 0;
      overflow-x: auto;
    }

    .inline-code code {
      background: none;
      font-size: 0.85rem;
      line-height: 1.55;
      color: #e0e0e0;
    }

    pre {
      margin: 0;
      overflow-x: auto;
    }
  `],
})
export class PhasesAndOptionsDemoComponent {
  private readonly injector = inject(Injector);

  hostEl = viewChild.required<ElementRef<HTMLElement>>('hostEl');
  measureMe = viewChild.required<ElementRef<HTMLElement>>('measureMe');

  phaseLog = signal<{ phase: string; detail: string }[]>([]);
  primaryActionTagged = signal<string | null>(null);
  measured = signal<{ width: number; height: number } | null>(null);
  outOfContextCount = signal(0);

  codePhases = `// All four phases registered in one call.
// Angular invokes them in this order regardless of the
// order the keys are written: earlyRead → write → mixedReadWrite → read.
afterNextRender({
  earlyRead:      () => { /* read layout that 'write' will consume */ },
  write:          () => { /* write to the DOM (no layout reads!) */ },
  mixedReadWrite: () => { /* default phase for the function shorthand */ },
  read:           () => { /* safe to measure here */ },
});

// Single-callback shorthand — equivalent to passing { mixedReadWrite }:
afterNextRender(() => { /* runs in mixedReadWrite */ });`;

  codeWrite = `// Tag the primary action with cdkFocusInitial after the
// dialog body has been rendered. Pure write — no layout read.
afterNextRender({
  write: () => {
    const primaryAction = this.hostEl().nativeElement.querySelector<HTMLElement>(
      '.tufin-dialog-actions [data-tufin-button-role="primary"]',
    );
    primaryAction?.setAttribute('cdkFocusInitial', '');
    // (this demo also surfaces the result for the UI below)
    this.primaryActionTagged.set(primaryAction?.getAttribute('cdkFocusInitial') ?? '');
  },
});`;

  codeRead = `// 'read' phase runs AFTER all writes have settled — so
// getBoundingClientRect() can't trigger a forced layout pass.
afterNextRender({
  read: () => {
    const rect = this.measureMe().nativeElement.getBoundingClientRect();
    this.measured.set({
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    });
  },
});`;

  codeInjector = `private readonly injector = inject(Injector);

// Event handlers are NOT an injection context, so we must
// hand afterNextRender an Injector via the options bag.
scheduleOutOfContext(): void {
  afterNextRender(
    {
      write: () => {
        this.outOfContextCount.update((n) => n + 1);
      },
    },
    { injector: this.injector },
  );
}`;

  codeEveryRender = `// Same phases, same options — just runs on every render:
afterEveryRender({
  read: () => {
    // measure on every render (use sparingly!)
  },
});

// And the same { injector } option works:
afterEveryRender(
  { write: () => { /* ... */ } },
  { injector: this.injector },
);`;

  constructor() {
    // ── Phase-order demo ────────────────────────────────────────────
    // All four phases registered in one call; Angular invokes them in
    // the canonical order regardless of how we list them in the object.
    afterNextRender({
      read: () => {
        this.phaseLog.update((log) => [
          ...log,
          { phase: 'read', detail: 'fired last — safe to measure here' },
        ]);
      },
      mixedReadWrite: () => {
        this.phaseLog.update((log) => [
          ...log,
          { phase: 'mixedReadWrite', detail: 'default phase for the function shorthand' },
        ]);
      },
      write: () => {
        this.phaseLog.update((log) => [
          ...log,
          { phase: 'write', detail: 'fired after earlyRead, before mixedReadWrite' },
        ]);
      },
      earlyRead: () => {
        this.phaseLog.update((log) => [
          ...log,
          { phase: 'earlyRead', detail: 'fired first — read what `write` will consume' },
        ]);
      },
    });

    // ── The user-supplied snippet, verbatim semantics ──────────────
    afterNextRender({
      write: () => {
        const primaryAction = this.hostEl().nativeElement.querySelector<HTMLElement>(
          '.tufin-dialog-actions [data-tufin-button-role="primary"]',
        );
        primaryAction?.setAttribute('cdkFocusInitial', '');
        this.primaryActionTagged.set(primaryAction?.getAttribute('cdkFocusInitial') ?? '');
      },
    });

    // ── Measure in `read` phase to avoid layout thrash ─────────────
    afterNextRender({
      read: () => {
        const rect = this.measureMe().nativeElement.getBoundingClientRect();
        this.measured.set({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      },
    });
  }

  scheduleOutOfContext(): void {
    // Event handlers are NOT an injection context, so we have to hand
    // afterNextRender an Injector explicitly via the options bag.
    afterNextRender(
      {
        write: () => {
          this.outOfContextCount.update((n) => n + 1);
        },
      },
      { injector: this.injector },
    );
  }
}
