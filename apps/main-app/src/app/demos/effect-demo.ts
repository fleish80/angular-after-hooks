import { Component, effect, signal, computed } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

/**
 * Demonstrates the standard effect() API
 * - NOT specifically tied to rendering
 * - Runs when tracked signals change
 * - Perfect for general side effects (logging, storage, etc.)
 */
@Component({
  selector: 'app-effect-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-card">
      <h2>💫 effect() Demo</h2>
      
      <div class="info-box">
        <h3>What is effect()?</h3>
        <ul>
          <li>✅ Runs when tracked <strong>signals change</strong></li>
          <li>✅ NOT tied to render cycle</li>
          <li>✅ Perfect for side effects (logging, storage, API calls)</li>
          <li>✅ Different from afterRenderEffect (no render timing)</li>
        </ul>
      </div>

      <div class="comparison-box">
        <h3>🆚 effect() vs afterRenderEffect()</h3>
        <table class="comparison-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th>effect()</th>
              <th>afterRenderEffect()</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Timing</td>
              <td>When signals change</td>
              <td>When signals change <strong>+ after render</strong></td>
            </tr>
            <tr>
              <td>DOM Access</td>
              <td>⚠️ Not guaranteed</td>
              <td>✅ Safe</td>
            </tr>
            <tr>
              <td>Use For</td>
              <td>Logging, storage, API calls</td>
              <td>DOM manipulation</td>
            </tr>
            <tr>
              <td>SSR</td>
              <td>⚠️ Runs during SSR</td>
              <td>✅ Skipped during SSR</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="example-section">
        <h3>Example 1: LocalStorage Sync</h3>
        <p>Automatically saves to localStorage when value changes:</p>
        
        <input 
          type="text" 
          [value]="username()" 
          (input)="updateUsername($event)"
          placeholder="Enter your name..."
          class="demo-input"
        />
        
        <p class="result">
          💾 Saved to localStorage: <strong>{{ username() || '(empty)' }}</strong>
        </p>
        
        <button (click)="clearUsername()" class="demo-button secondary">
          Clear
        </button>
      </div>

      <div class="example-section">
        <h3>Example 2: Analytics Logging</h3>
        <p>Logs all state changes automatically:</p>
        
        <div class="counter-controls">
          <button (click)="increment()" class="demo-button">
            Increment ({{ counter() }})
          </button>
          <button (click)="decrement()" class="demo-button">
            Decrement
          </button>
        </div>
        
        <div class="analytics-panel">
          <h4>📊 Analytics Log:</h4>
          <div class="log-container">
            @for (log of analyticsLog(); track $index) {
              <div class="log-entry" [class.latest]="$index === analyticsLog().length - 1">
                {{ log }}
              </div>
            }
          </div>
        </div>
      </div>

      <div class="example-section">
        <h3>Example 3: Computed Value with Effect</h3>
        <p>Effect reacts to computed signals:</p>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ counter() }}</div>
            <div class="stat-label">Counter</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ doubled() }}</div>
            <div class="stat-label">Doubled (computed)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ squared() }}</div>
            <div class="stat-label">Squared (computed)</div>
          </div>
        </div>
        
        <p class="hint">
          💡 The effect below logs all computed values automatically
        </p>
      </div>

      <div class="lifecycle-box">
        <h3>🔄 Effect Lifecycle</h3>
        <div class="lifecycle-info">
          <p><strong>Effect runs:</strong> {{ effectRunCount() }} times</p>
          <p><strong>Last run:</strong> {{ lastEffectRun() }}</p>
        </div>
      </div>

      <div class="code-section">
        <h3>Code Example:</h3>
        <pre><code>{{ codeExample }}</code></pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-card {
      padding: 2rem;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
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

    .info-box, .comparison-box, .lifecycle-box {
      background: rgba(255, 255, 255, 0.95);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }

    .info-box h3, .comparison-box h3, .lifecycle-box h3 {
      margin-top: 0;
      color: #0288d1;
    }

    .info-box ul {
      margin: 0;
      padding-left: 1.5rem;
    }

    .info-box li {
      margin: 0.5rem 0;
      line-height: 1.6;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    .comparison-table th,
    .comparison-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .comparison-table th {
      background: rgba(2, 136, 209, 0.1);
      font-weight: bold;
      color: #0288d1;
    }

    .comparison-table tbody tr:hover {
      background: rgba(2, 136, 209, 0.05);
    }

    .example-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }

    .example-section h3 {
      margin-top: 0;
      color: #0288d1;
    }

    .demo-input {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      border: 2px solid #0288d1;
      border-radius: 6px;
      margin: 1rem 0;
      box-sizing: border-box;
    }

    .demo-input:focus {
      outline: none;
      border-color: #ff6b6b;
      box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
    }

    .result {
      background: rgba(76, 175, 80, 0.2);
      padding: 0.75rem;
      border-radius: 6px;
      border-left: 4px solid #4caf50;
      margin: 1rem 0;
    }

    .counter-controls {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
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
    }

    .demo-button.secondary {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .demo-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    }

    .demo-button:active {
      transform: translateY(0);
    }

    .analytics-panel {
      margin-top: 1rem;
    }

    .analytics-panel h4 {
      margin: 0 0 0.5rem 0;
      color: #0288d1;
    }

    .log-container {
      background: rgba(0, 0, 0, 0.8);
      padding: 1rem;
      border-radius: 8px;
      max-height: 200px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      color: #e0e0e0;
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      color: white;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .hint {
      font-size: 0.9rem;
      opacity: 0.8;
      font-style: italic;
      margin: 1rem 0 0 0;
    }

    .lifecycle-info {
      background: rgba(2, 136, 209, 0.1);
      padding: 1rem;
      border-radius: 6px;
    }

    .lifecycle-info p {
      margin: 0.5rem 0;
      font-size: 1rem;
    }

    .code-section {
      background: rgba(0, 0, 0, 0.8);
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
      color: white;
    }

    .code-section h3 {
      margin-top: 0;
      color: #ffd700;
    }

    pre {
      margin: 0;
      overflow-x: auto;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
      color: #e0e0e0;
    }
  `]
})
export class EffectDemoComponent {
  // State
  username = signal('');
  counter = signal(0);
  analyticsLog = signal<string[]>([]);
  effectRunCount = signal(0);
  lastEffectRun = signal('Not yet run');
  
  // Computed values
  doubled = computed(() => this.counter() * 2);
  squared = computed(() => this.counter() ** 2);

  codeExample = `constructor() {
  // Example 1: LocalStorage sync
  effect(() => {
    const name = this.username();
    if (name) {
      localStorage.setItem('username', name);
    } else {
      localStorage.removeItem('username');
    }
  });

  // Example 2: Analytics logging
  effect(() => {
    const count = this.counter();
    console.log('📊 Counter changed:', count);
    // Send to analytics service...
  });

  // Example 3: Computed values
  effect(() => {
    console.log('Values:', {
      counter: this.counter(),
      doubled: this.doubled(),
      squared: this.squared()
    });
  });
}`;

  constructor() {
    // Load initial username from localStorage
    const saved = localStorage.getItem('username');
    if (saved) {
      this.username.set(saved);
    }

    // Example 1: Sync username to localStorage
    effect(() => {
      const name = this.username();
      if (name) {
        localStorage.setItem('username', name);
        console.log('💾 Saved to localStorage:', name);
      } else {
        localStorage.removeItem('username');
        console.log('💾 Removed from localStorage');
      }
    });

    // Example 2: Analytics logging for counter
    effect(() => {
      const count = this.counter();
      const timestamp = new Date().toLocaleTimeString();
      const log = `[💫 ${timestamp}] Counter: ${count}, Doubled: ${this.doubled()}, Squared: ${this.squared()}`;
      
      this.analyticsLog.update(logs => {
        const newLogs = [...logs, log];
        return newLogs.slice(-10); // Keep last 10
      });
      
      console.log('📊 Analytics:', log);
    });

    // Example 3: Track effect lifecycle
    effect(() => {
      // Track any signal to demonstrate effect runs
      const _ = this.counter();
      const __ = this.username();
      
      this.effectRunCount.update(c => c + 1);
      this.lastEffectRun.set(new Date().toLocaleTimeString());
      
      console.log('💫 Effect run count:', this.effectRunCount());
    });

    console.log('💫 EffectDemo: constructor called');
  }

  updateUsername(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.username.set(input.value);
  }

  clearUsername(): void {
    this.username.set('');
  }

  increment(): void {
    this.counter.update(c => c + 1);
  }

  decrement(): void {
    this.counter.update(c => c - 1);
  }
}

