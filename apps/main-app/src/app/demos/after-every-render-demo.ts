import { Component, afterEveryRender, signal, computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

/**
 * Demonstrates afterEveryRender API (renamed from afterRender in Angular 20)
 * - Runs EVERY TIME after rendering completes
 * - Perfect for continuous synchronization
 * - Use sparingly (performance consideration)
 */
@Component({
  selector: 'app-after-every-render-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-card">
      <h2>🔄 afterEveryRender Demo</h2>
      
      <div class="info-box">
        <h3>What is afterEveryRender?</h3>
        <ul>
          <li>✅ Runs <strong>every time</strong> after rendering</li>
          <li>✅ Perfect for continuous DOM sync</li>
          <li>⚠️ Use sparingly (runs frequently)</li>
          <li>✅ Formerly called <code>afterRender</code> (renamed in Angular 20)</li>
        </ul>
      </div>

      <div class="history-box">
        <h3>📚 History</h3>
        <div class="timeline">
          <div class="timeline-item">
            <span class="badge">v16-19</span>
            <span>Called <code>afterRender</code> (developer preview)</span>
          </div>
          <div class="timeline-item">
            <span class="badge current">v20+</span>
            <span>Renamed to <code>afterEveryRender</code> (stable)</span>
          </div>
        </div>
      </div>

      <div class="example-section">
        <h3>Example 1: Render Counter</h3>
        <p>Tracks how many times the component has rendered:</p>

        <div class="counter-display">
          <div class="big-number">{{ renderCount() }}</div>
          <div class="label">Total Renders</div>
        </div>

        <button (click)="increment()" class="demo-button">
          Trigger Re-render (Count: {{ count() }})
        </button>

        <p class="hint">
          💡 Click the button to trigger a re-render.
          The counter above tracks every render via afterEveryRender.
        </p>
        <pre class="inline-code"><code>{{ codeCounter }}</code></pre>
      </div>

      <div class="example-section">
        <h3>Example 2: Analytics Tracking</h3>
        <p>Simulate sending analytics on every render:</p>

        <div class="analytics-log">
          @for (log of analyticsLogs(); track $index) {
            <div class="log-entry" [class.latest]="$index === analyticsLogs().length - 1">
              {{ log }}
            </div>
          }
        </div>
        <pre class="inline-code"><code>{{ codeAnalytics }}</code></pre>
      </div>

      <div class="warning-box">
        <h3>⚠️ Performance Warning</h3>
        <p>
          <code>afterEveryRender</code> runs frequently! Use it only when you need
          to synchronize with every render cycle. For one-time setup, use
          <code>afterNextRender</code> instead.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .demo-card {
      padding: 2rem;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      border-radius: 12px;
      color: white;
      margin-bottom: 2rem;
    }

    h2 {
      margin-top: 0;
      font-size: 2rem;
    }

    .info-box, .history-box {
      background: rgba(255, 255, 255, 0.1);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      backdrop-filter: blur(10px);
    }

    .info-box h3, .history-box h3 {
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

    code {
      background: rgba(0, 0, 0, 0.3);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .timeline-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
    }

    .badge {
      background: rgba(255, 255, 255, 0.3);
      padding: 0.3rem 0.6rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: bold;
      min-width: 60px;
      text-align: center;
    }

    .badge.current {
      background: #4caf50;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
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
    }

    .counter-display {
      background: rgba(0, 0, 0, 0.3);
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      margin: 1rem 0;
    }

    .big-number {
      font-size: 4rem;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 0 2px 10px rgba(255, 215, 0, 0.5);
    }

    .label {
      font-size: 1rem;
      margin-top: 0.5rem;
      opacity: 0.9;
    }

    .demo-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 1rem 2rem;
      font-size: 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: transform 0.2s, box-shadow 0.2s;
      width: 100%;
      margin: 1rem 0;
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
    }

    .demo-button:active {
      transform: translateY(0);
    }

    .hint {
      font-size: 0.9rem;
      opacity: 0.9;
      font-style: italic;
      margin: 1rem 0;
    }

    .analytics-log {
      background: rgba(0, 0, 0, 0.3);
      padding: 1rem;
      border-radius: 8px;
      max-height: 200px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
    }

    .log-entry {
      padding: 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      opacity: 0.7;
    }

    .log-entry.latest {
      opacity: 1;
      background: rgba(76, 175, 80, 0.3);
      border-radius: 4px;
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: translateX(-10px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .warning-box {
      background: rgba(255, 152, 0, 0.3);
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #ff9800;
      margin-bottom: 1.5rem;
    }

    .warning-box h3 {
      margin-top: 0;
      color: #ffd700;
    }

    .inline-code {
      background: rgba(0, 0, 0, 0.4);
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0 0;
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
  `]
})
export class AfterEveryRenderDemoComponent {
  // State
  count = signal(0);
  renderCount = signal(0);
  analyticsLogs = signal<string[]>([]);

  // Computed value (triggers re-render when count changes)
  doubledCount = computed(() => this.count() * 2);

  codeCounter = `count = signal(0);
renderCount = signal(0);

constructor() {
  afterEveryRender(() => {
    this.renderCount.update((c) => c + 1);
  });
}

increment(): void {
  this.count.update((c) => c + 1); // triggers a re-render
}`;

  codeAnalytics = `analyticsLogs = signal<string[]>([]);

constructor() {
  afterEveryRender(() => {
    const timestamp = new Date().toLocaleTimeString();
    const log = \`[\${timestamp}] render #\${this.renderCount()}\`;
    this.analyticsLogs.update((logs) => [...logs, log].slice(-10));
  });
}`;

  constructor() {
    // Example 1: bump the render counter every render
    afterEveryRender(() => {
      this.renderCount.update((c) => c + 1);
    });

    // Example 2: simulate analytics tracking every render
    afterEveryRender(() => {
      const timestamp = new Date().toLocaleTimeString();
      const log = `[${timestamp}] render #${this.renderCount()}`;
      this.analyticsLogs.update((logs) => [...logs, log].slice(-10));
    });
  }

  increment(): void {
    this.count.update((c) => c + 1); // triggers a re-render
  }
}

