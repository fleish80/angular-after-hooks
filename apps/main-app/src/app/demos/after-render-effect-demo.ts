import { Component, afterRenderEffect, signal, ElementRef, viewChild } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

/**
 * Demonstrates afterRenderEffect API (New in Angular 19/20)
 * - Combines signal reactivity with after-render timing
 * - Re-runs when tracked signals change AND after render
 * - Perfect for reactive DOM manipulation
 */
@Component({
  selector: 'app-after-render-effect-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-card">
      <h2>⚡ afterRenderEffect Demo</h2>
      
      <div class="info-box">
        <h3>What is afterRenderEffect?</h3>
        <ul>
          <li>✅ Combines <strong>signal reactivity</strong> with <strong>render timing</strong></li>
          <li>✅ Re-runs when tracked signals change</li>
          <li>✅ Executes after render completes</li>
          <li>✅ Perfect for reactive DOM updates</li>
          <li>🆕 New in Angular 19 (experimental) / 20 (stable)</li>
          <li>⚡ <strong>Angular 21:</strong> accepts the same 4-phase spec as
            <code>afterNextRender</code>, and each phase receives the previous phase's
            return value as a <strong>signal</strong> (see Example 4 below).</li>
        </ul>
      </div>

      <div class="example-section">
        <h3>Example 1: Reactive Canvas Drawing</h3>
        <p>Canvas updates automatically when count changes:</p>

        <canvas
          #canvas
          width="400"
          height="200"
          class="demo-canvas"
        ></canvas>

        <div class="controls">
          <button (click)="increment()" class="demo-button">
            Increment ({{ count() }})
          </button>
          <button (click)="reset()" class="demo-button secondary">
            Reset
          </button>
        </div>
        <pre class="inline-code"><code>{{ codeCanvas }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 2: Reactive Progress Bar</h3>
        <p>Progress bar width updates reactively:</p>

        <div class="progress-container">
          <div #progressBar class="progress-bar"></div>
        </div>

        <div class="controls">
          <button (click)="incrementProgress()" class="demo-button">
            +10%
          </button>
          <button (click)="decrementProgress()" class="demo-button">
            -10%
          </button>
          <button (click)="progress.set(0)" class="demo-button secondary">
            Reset ({{ progress() }}%)
          </button>
        </div>
        <pre class="inline-code"><code>{{ codeProgress }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 3: Color Animation</h3>
        <p>Color changes based on count value:</p>

        <div #colorBox class="color-box">
          Count: {{ count() }}
        </div>
        <pre class="inline-code"><code>{{ codeColor }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 4: 🆕 Angular 21 — phases with cascading signal values</h3>
        <p>
          Each phase callback returns a value; the next phase callback receives that value
          as a <strong>signal</strong>. So work flows
          <code>earlyRead → write → mixedReadWrite → read</code>, and downstream phases
          re-run only when the upstream signal changes. The example below measures the
          container in <code>earlyRead</code>, sizes a child to half that width in
          <code>write</code>, then reports the final geometry in <code>read</code>.
        </p>
        <div #cascadeHost class="cascade-host">
          <div #cascadeChild class="cascade-child">resized by the write phase</div>
        </div>
        <div class="controls">
          <button type="button" class="demo-button" (click)="cascadeNudge.update(v => v + 1)">
            Re-trigger ({{ cascadeNudge() }})
          </button>
        </div>
        @if (cascadeReport()) {
          <p class="result">
            📐 earlyRead measured {{ cascadeReport()?.measured }}px → write applied
            {{ cascadeReport()?.applied }}px → read confirms
            {{ cascadeReport()?.confirmed }}px
          </p>
        }
        <pre class="inline-code"><code>{{ codeCascade }}</code></pre>
      </div>

      <div class="comparison-box">
        <h3>🆚 afterRenderEffect vs effect</h3>
        <div class="comparison-grid">
          <div class="comparison-item">
            <h4>effect()</h4>
            <ul>
              <li>Runs when signals change</li>
              <li>Not tied to render cycle</li>
              <li>For general side effects</li>
            </ul>
          </div>
          <div class="comparison-item highlight">
            <h4>afterRenderEffect()</h4>
            <ul>
              <li>Runs when signals change</li>
              <li><strong>AND</strong> after render</li>
              <li>For DOM manipulation</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .demo-card {
      padding: 2rem;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      border-radius: 12px;
      color: #333;
      margin-bottom: 2rem;
    }

    h2 {
      margin-top: 0;
      font-size: 2rem;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .info-box {
      background: rgba(255, 255, 255, 0.9);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .info-box h3 {
      margin-top: 0;
      color: #e91e63;
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
      background: rgba(255, 255, 255, 0.9);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .example-section h3 {
      margin-top: 0;
      color: #e91e63;
    }

    .demo-canvas {
      width: 100%;
      border: 3px solid #e91e63;
      border-radius: 8px;
      background: white;
      display: block;
      margin: 1rem 0;
    }

    .controls {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
      flex-wrap: wrap;
    }

    .demo-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
      flex: 1;
      min-width: 150px;
    }

    .demo-button.secondary {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }

    .demo-button:active {
      transform: translateY(0);
    }

    .progress-container {
      background: #e0e0e0;
      border-radius: 8px;
      height: 40px;
      overflow: hidden;
      margin: 1rem 0;
    }

    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .color-box {
      background: #667eea;
      padding: 3rem;
      border-radius: 8px;
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
      color: white;
      margin: 1rem 0;
      transition: background-color 0.5s ease;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .cascade-host {
      background: rgba(102, 126, 234, 0.15);
      border: 2px dashed #667eea;
      border-radius: 8px;
      padding: 1rem;
      margin-block: 1rem;
    }

    .cascade-child {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0.75rem;
      border-radius: 6px;
      font-weight: bold;
      text-align: center;
      transition: inline-size 0.25s ease;
    }

    .comparison-box {
      background: rgba(255, 255, 255, 0.9);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .comparison-box h3 {
      margin-top: 0;
      color: #e91e63;
    }

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .comparison-grid {
        grid-template-columns: 1fr;
      }
    }

    .comparison-item {
      background: rgba(0, 0, 0, 0.05);
      padding: 1rem;
      border-radius: 8px;
    }

    .comparison-item.highlight {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
      border: 2px solid #667eea;
    }

    .comparison-item h4 {
      margin-top: 0;
      color: #333;
    }

    .comparison-item ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .comparison-item li {
      margin: 0.5rem 0;
    }

    .inline-code {
      background: rgba(0, 0, 0, 0.85);
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
export class AfterRenderEffectDemoComponent {
  // Refs
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  progressBar = viewChild<ElementRef>('progressBar');
  colorBox = viewChild<ElementRef>('colorBox');
  cascadeHost = viewChild<ElementRef<HTMLElement>>('cascadeHost');
  cascadeChild = viewChild<ElementRef<HTMLElement>>('cascadeChild');

  // State
  count = signal(0);
  progress = signal(50);
  cascadeNudge = signal(0);
  lastMeasured = signal(0);
  cascadeReport = signal<{
    measured: number;
    applied: number;
    confirmed: number;
  } | null>(null);

  codeCanvas = `canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
count  = signal(0);

constructor() {
  // Re-runs whenever count() changes AND after render commits:
  afterRenderEffect(() => {
    const ctx = this.canvas()?.nativeElement.getContext('2d');
    if (!ctx) return;
    const value = this.count();

    // background
    ctx.clearRect(0, 0, 400, 200);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, 400, 200);

    // bar
    const barWidth = Math.min(value * 20, 350);
    const gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(25, 50, barWidth, 100);

    // labels
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(\`Count: \${value}\`, 25, 35);
  });
}`;

  codeProgress = `progressBar = viewChild<ElementRef>('progressBar');
progress    = signal(50);

constructor() {
  afterRenderEffect(() => {
    const bar = this.progressBar()?.nativeElement;
    if (!bar) return;
    const value = this.progress();
    bar.style.width = \`\${value}%\`;
    bar.textContent = \`\${value}%\`;
  });
}`;

  codeColor = `colorBox = viewChild<ElementRef>('colorBox');

constructor() {
  afterRenderEffect(() => {
    const box = this.colorBox()?.nativeElement;
    if (!box) return;
    const hue = (this.count() * 30) % 360;
    box.style.backgroundColor = \`hsl(\${hue}, 70%, 60%)\`;
  });
}`;

  codeCascade = `// Angular 21 — afterRenderEffect accepts a phase spec.
// Each phase returns a value that the next phase receives
// AS A SIGNAL, so downstream phases only re-run when their
// upstream input changes.
afterRenderEffect({
  earlyRead: () => {
    this.cascadeNudge(); // re-trigger the chain on button click
    const host = this.cascadeHost()?.nativeElement;
    const width = host ? Math.round(host.getBoundingClientRect().width) : 0;
    this.lastMeasured.set(width);
    return width;
  },
  write: (hostWidth) => {
    // hostWidth is Signal<number> from earlyRead
    const child = this.cascadeChild()?.nativeElement;
    const target = Math.round(hostWidth() / 2);
    if (child) {
      child.style.inlineSize = \`\${target}px\`;
    }
    return target;
  },
  read: (applied) => {
    // applied is Signal<number> from write
    const child = this.cascadeChild()?.nativeElement;
    const confirmed = child ? Math.round(child.getBoundingClientRect().width) : 0;
    this.cascadeReport.set({
      measured: this.lastMeasured(),
      applied: applied(),
      confirmed,
    });
  },
});`;

  constructor() {
    // Example 1: Reactive canvas drawing
    afterRenderEffect(() => {
      const ctx = this.canvas()?.nativeElement.getContext('2d');
      if (!ctx) return;
      const value = this.count();

      // background
      ctx.clearRect(0, 0, 400, 200);
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, 400, 200);

      // bar
      const barWidth = Math.min(value * 20, 350);
      const gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(25, 50, barWidth, 100);

      // labels
      ctx.fillStyle = '#333';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Count: ${value}`, 25, 35);
    });

    // Example 2: Reactive progress bar
    afterRenderEffect(() => {
      const bar = this.progressBar()?.nativeElement;
      if (!bar) return;
      const value = this.progress();
      bar.style.width = `${value}%`;
      bar.textContent = `${value}%`;
    });

    // Example 3: Reactive color animation
    afterRenderEffect(() => {
      const box = this.colorBox()?.nativeElement;
      if (!box) return;
      const hue = (this.count() * 30) % 360;
      box.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
    });

    // Example 4 (Angular 21+): afterRenderEffect with a phase spec.
    // Each phase's return value flows into the next phase as a Signal,
    // so downstream phases only re-run when their upstream input changes.
    afterRenderEffect({
      earlyRead: () => {
        this.cascadeNudge(); // re-trigger the chain on button click
        const host = this.cascadeHost()?.nativeElement;
        const width = host ? Math.round(host.getBoundingClientRect().width) : 0;
        this.lastMeasured.set(width);
        return width;
      },
      write: (hostWidth) => {
        // hostWidth is Signal<number> from earlyRead
        const child = this.cascadeChild()?.nativeElement;
        const target = Math.round(hostWidth() / 2);
        if (child) {
          child.style.inlineSize = `${target}px`;
        }
        return target;
      },
      read: (applied) => {
        // applied is Signal<number> from write
        const child = this.cascadeChild()?.nativeElement;
        const confirmed = child ? Math.round(child.getBoundingClientRect().width) : 0;
        this.cascadeReport.set({
          measured: this.lastMeasured(),
          applied: applied(),
          confirmed,
        });
      },
    });
  }

  increment(): void {
    this.count.update((c) => c + 1);
  }

  reset(): void {
    this.count.set(0);
  }

  incrementProgress(): void {
    this.progress.update((p) => Math.min(p + 10, 100));
  }

  decrementProgress(): void {
    this.progress.update((p) => Math.max(p - 10, 0));
  }
}

