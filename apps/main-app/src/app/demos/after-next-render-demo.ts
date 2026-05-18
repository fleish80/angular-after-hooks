import { Component, afterNextRender, ElementRef, viewChild, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

/**
 * Demonstrates afterNextRender API
 * - Runs ONCE after the next render cycle
 * - Perfect for one-time DOM initialization
 * - Browser-only (skipped during SSR)
 */
@Component({
  selector: 'app-after-next-render-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-card">
      <h2>🎯 afterNextRender Demo</h2>
      
      <div class="info-box">
        <h3>What is afterNextRender?</h3>
        <ul>
          <li>✅ Runs <strong>once</strong> after the next render</li>
          <li>✅ Perfect for one-time DOM setup</li>
          <li>✅ Browser-only (safe for SSR)</li>
          <li>✅ Replaces setTimeout hacks</li>
          <li>🧩 Accepts a single callback <em>or</em> a phase object —
            <code>earlyRead</code> / <code>write</code> / <code>mixedReadWrite</code> / <code>read</code>.
            <strong>The single-callback shorthand defaults to <code>mixedReadWrite</code></strong>,
            which is the safest-but-slowest phase. See the "Phases &amp; Options" section below
            for the full picture.</li>
        </ul>
      </div>

      <div class="example-section">
        <h3>Example 1: Auto-focus Input <span class="phase-tag">default → mixedReadWrite</span></h3>
        <p>
          This input is focused automatically after the first render. The bare-function
          shorthand below is equivalent to <code>&#123; mixedReadWrite: () => ... &#125;</code> —
          the safest default when you don't know whether the callback reads, writes, or both.
        </p>
        <input
          #focusInput
          type="text"
          placeholder="I will be auto-focused!"
          class="demo-input"
        />
        <p class="result">✓ Focus applied using afterNextRender()</p>
        <pre class="inline-code"><code>{{ codeFocus }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 2: Measure Element <span class="phase-tag">read</span></h3>
        <p>
          The <code>read</code> phase runs after all writes have flushed, so
          <code>getBoundingClientRect()</code> doesn't force an extra layout pass.
        </p>
        <div #measureBox class="measure-box">
          Measure me!
        </div>
        @if (dimensions()) {
          <p class="result">
            📏 Dimensions: {{ dimensions()?.width }}px × {{ dimensions()?.height }}px
          </p>
        }
        <pre class="inline-code"><code>{{ codeMeasure }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 3: Write to the DOM <span class="phase-tag">write</span></h3>
        <p>
          The <code>write</code> phase is the right home for DOM mutations that don't need
          to read layout first. Here we stamp <code>cdkFocusInitial</code> onto the primary
          action so a CDK dialog would auto-focus it:
        </p>
        <div class="tufin-dialog" #writeDialog>
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
        <h3>Example 4: Read-then-Write <span class="phase-tag">earlyRead → write</span></h3>
        <p>
          <code>earlyRead</code> exists for one specific reason: capture a layout value that
          a later <code>write</code> needs to consume, without paying for a forced reflow.
          Here we read the container's width in <code>earlyRead</code> and then write a
          matching <code>--container-width</code> CSS custom property in <code>write</code>:
        </p>
        <div #earlyReadBox class="early-read-box">
          My CSS variable is set to my own measured width.
        </div>
        @if (containerWidth() !== null) {
          <p class="result">
            ✓ Measured {{ containerWidth() }}px in <code>earlyRead</code>,
            wrote <code>--container-width: {{ containerWidth() }}px</code> in <code>write</code>.
          </p>
        }
        <pre class="inline-code"><code>{{ codeEarlyRead }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 5: Third-party Library Init <span class="phase-tag">default → mixedReadWrite</span></h3>
        <p>
          Third-party libraries typically read <em>and</em> write the DOM internally, so the
          default <code>mixedReadWrite</code> phase is the honest choice — the function
          shorthand picks it for us.
        </p>
        <div #chartContainer class="chart-container"></div>
        @if (chartInitialized()) {
          <p class="result">✓ Chart library initialized</p>
        }
        <pre class="inline-code"><code>{{ codeChart }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-card {
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
      margin-bottom: 2rem;
    }

    h2 {
      margin-top: 0;
      font-size: 2rem;
    }

    .info-box {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
    }

    .info-box h3 {
      margin-top: 0;
      color: #ffd700;
    }

    .info-box ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .info-box li {
      margin: 0.5rem 0;
      line-height: 1.6;
    }

    .example-section {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .example-section h3 {
      margin-top: 0;
      color: #ffd700;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .phase-tag {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.35);
      color: #fff8b0;
      font-family: 'Courier New', monospace;
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
      background: #ffd700;
      color: #1d1d1d;
    }

    .tufin-dialog-actions button[cdkFocusInitial] {
      outline: 3px solid #ff6b6b;
      outline-offset: 2px;
    }

    .early-read-box {
      --container-width: 100%;
      background: rgba(255, 215, 0, 0.18);
      border: 2px solid #ffd700;
      border-radius: 8px;
      padding: 1rem;
      margin-block: 1rem;
      text-align: center;
      font-weight: 600;
      inline-size: var(--container-width);
      transition: inline-size 0.4s ease;
    }

    .demo-input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 2px solid #ffd700;
      border-radius: 6px;
      margin: 1rem 0;
      background: rgba(255, 255, 255, 0.9);
    }

    .demo-input:focus {
      outline: none;
      border-color: #ff6b6b;
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.3);
    }

    .measure-box {
      background: rgba(255, 215, 0, 0.3);
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      font-weight: bold;
      font-size: 1.2rem;
      margin: 1rem 0;
      border: 2px dashed #ffd700;
    }

    .chart-container {
      background: rgba(255, 255, 255, 0.2);
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      margin: 1rem 0;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
    }

    .result {
      background: rgba(76, 175, 80, 0.3);
      padding: 0.75rem;
      border-radius: 6px;
      border-left: 4px solid #4caf50;
      margin: 1rem 0;
    }

    .inline-code {
      background: rgba(0, 0, 0, 0.35);
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0 0;
      overflow-x: auto;
    }

    pre {
      margin: 0;
      overflow-x: auto;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.55;
      color: #e0e0e0;
    }
  `]
})
export class AfterNextRenderDemoComponent {
  focusInput = viewChild<ElementRef<HTMLInputElement>>('focusInput');
  measureBox = viewChild<ElementRef<HTMLElement>>('measureBox');
  chartContainer = viewChild<ElementRef<HTMLElement>>('chartContainer');
  writeDialog = viewChild<ElementRef<HTMLElement>>('writeDialog');
  earlyReadBox = viewChild<ElementRef<HTMLElement>>('earlyReadBox');

  dimensions = signal<{ width: number; height: number } | null>(null);
  chartInitialized = signal(false);
  primaryActionTagged = signal<string | null>(null);
  containerWidth = signal<number | null>(null);

  codeFocus = `focusInput = viewChild<ElementRef<HTMLInputElement>>('focusInput');

constructor() {
  // Single-callback shorthand → runs in the 'mixedReadWrite' phase
  // (the safest default — Angular assumes worst-case layout invalidation).
  afterNextRender(() => {
    this.focusInput()?.nativeElement.focus();
  });
}`;

  codeMeasure = `measureBox = viewChild<ElementRef<HTMLElement>>('measureBox');
dimensions = signal<{ width: number; height: number } | null>(null);

constructor() {
  // Pure measurement → use the 'read' phase so getBoundingClientRect()
  // runs AFTER writes have flushed (no forced reflow).
  afterNextRender({
    read: () => {
      const rect = this.measureBox()?.nativeElement.getBoundingClientRect();
      if (rect) {
        this.dimensions.set({
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        });
      }
    },
  });
}`;

  codeWrite = `writeDialog = viewChild<ElementRef<HTMLElement>>('writeDialog');
primaryActionTagged = signal<string | null>(null);

constructor() {
  // Pure DOM write — never read layout inside 'write', it would force
  // a synchronous recalc and undo the whole point of phasing.
  afterNextRender({
    write: () => {
      const primaryAction = this.writeDialog()?.nativeElement
        .querySelector<HTMLElement>('[data-tufin-button-role="primary"]');
      primaryAction?.setAttribute('cdkFocusInitial', '');
      this.primaryActionTagged.set(
        primaryAction?.getAttribute('cdkFocusInitial') ?? '',
      );
    },
  });
}`;

  codeEarlyRead = `earlyReadBox = viewChild<ElementRef<HTMLElement>>('earlyReadBox');
containerWidth = signal<number | null>(null);

constructor() {
  let measuredWidth = 0;

  // 'earlyRead' fires FIRST — capture the layout value here so the
  // upcoming 'write' phase has it without forcing a second reflow.
  afterNextRender({
    earlyRead: () => {
      measuredWidth = Math.round(
        this.earlyReadBox()!.nativeElement.getBoundingClientRect().width,
      );
    },
    write: () => {
      this.earlyReadBox()!.nativeElement.style.setProperty(
        '--container-width',
        \`\${measuredWidth}px\`,
      );
      this.containerWidth.set(measuredWidth);
    },
  });
}`;

  codeChart = `chartContainer = viewChild<ElementRef<HTMLElement>>('chartContainer');
chartInitialized = signal(false);

constructor() {
  // Third-party libs read AND write the DOM internally, so 'mixedReadWrite'
  // (the function-shorthand default) is the honest phase choice.
  afterNextRender(() => {
    const container = this.chartContainer()?.nativeElement;
    if (container) {
      // In real code: new Chart(container, options)
      container.textContent = '📊 Chart Initialized!';
      this.chartInitialized.set(true);
    }
  });
}`;

  constructor() {
    // Example 1: function-shorthand → defaults to 'mixedReadWrite'
    afterNextRender(() => {
      this.focusInput()?.nativeElement.focus();
    });

    // Example 2: pure read in the 'read' phase
    afterNextRender({
      read: () => {
        const rect = this.measureBox()?.nativeElement.getBoundingClientRect();
        if (rect) {
          this.dimensions.set({
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          });
        }
      },
    });

    // Example 3: pure write in the 'write' phase — tag cdkFocusInitial
    afterNextRender({
      write: () => {
        const primaryAction = this.writeDialog()?.nativeElement
          .querySelector<HTMLElement>('[data-tufin-button-role="primary"]');
        primaryAction?.setAttribute('cdkFocusInitial', '');
        this.primaryActionTagged.set(
          primaryAction?.getAttribute('cdkFocusInitial') ?? '',
        );
      },
    });

    // Example 4: earlyRead → write — measure once, then apply
    let measuredWidth = 0;
    afterNextRender({
      earlyRead: () => {
        measuredWidth = Math.round(
          this.earlyReadBox()!.nativeElement.getBoundingClientRect().width,
        );
      },
      write: () => {
        this.earlyReadBox()!.nativeElement.style.setProperty(
          '--container-width',
          `${measuredWidth}px`,
        );
        this.containerWidth.set(measuredWidth);
      },
    });

    // Example 5: function-shorthand → defaults to 'mixedReadWrite'
    afterNextRender(() => {
      const container = this.chartContainer()?.nativeElement;
      if (container) {
        container.textContent = '📊 Chart Initialized!';
        this.chartInitialized.set(true);
      }
    });
  }
}

