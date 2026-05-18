import { Component, ElementRef, viewChild, signal, afterNextRender, afterEveryRender, ChangeDetectionStrategy } from '@angular/core';

/**
 * Demonstrates the comparison between traditional lifecycle hooks and new after-render APIs
 * Shows the evolution, problems with old approach, and benefits of new APIs
 */
@Component({
  selector: 'app-lifecycle-comparison-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="demo-card">
      <h2>🔄 Traditional Lifecycle Hooks vs After-Render APIs</h2>
      
      <div class="info-box renderer-explanation">
        <h3>💡 What is "Renderer" in Angular?</h3>
        <div class="renderer-flow">
          <div class="flow-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <strong>Component State Changes</strong>
              <p>User clicks button, data updates, etc.</p>
            </div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <strong>Change Detection Runs</strong>
              <p>Angular checks what changed</p>
            </div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <strong>Template Re-evaluation</strong>
              <p>{{ '{{' }} expressions {{ '}}' }}, *ngIf, etc.</p>
            </div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step highlight">
            <div class="step-number">4</div>
            <div class="step-content">
              <strong>DOM Rendering</strong>
              <p>Browser updates actual DOM elements</p>
            </div>
          </div>
          <div class="flow-arrow">↓</div>
          <div class="flow-step success">
            <div class="step-number">5</div>
            <div class="step-content">
              <strong>After Render Phase</strong>
              <p>✅ New APIs hook here!</p>
            </div>
          </div>
        </div>
        <p class="explanation">
          <strong>Renderer</strong> = Angular's process of updating the DOM based on your component's state and template.
        </p>
      </div>

      <div class="comparison-section">
        <h3>⚠️ The Problem with Traditional Hooks</h3>
        
        <div class="problem-box">
          <h4>Old Way: ngAfterViewInit() + setTimeout()</h4>
          <pre><code>{{ oldWayCode }}</code></pre>
          <div class="problems-list">
            <div class="problem-item">❌ Runs during change detection</div>
            <div class="problem-item">❌ DOM might not be ready</div>
            <div class="problem-item">❌ Needs setTimeout() workaround</div>
            <div class="problem-item">❌ Can cause ExpressionChangedAfterItHasBeenCheckedError</div>
            <div class="problem-item">❌ Runs on server during SSR</div>
          </div>
        </div>

        <div class="solution-box">
          <h4>New Way: afterNextRender()</h4>
          <pre><code>{{ newWayCode }}</code></pre>
          <div class="benefits-list">
            <div class="benefit-item">✅ Runs AFTER render completes</div>
            <div class="benefit-item">✅ DOM is guaranteed ready</div>
            <div class="benefit-item">✅ No setTimeout() needed</div>
            <div class="benefit-item">✅ No change detection errors</div>
            <div class="benefit-item">✅ SSR-safe (auto-skipped)</div>
          </div>
        </div>
      </div>

      <div class="live-demo-section">
        <h3>🎮 Live Comparison Demo</h3>
        
        <div class="demo-grid">
          <!-- Traditional Hook Demo -->
          <div class="demo-box old-way">
            <h4>❌ Traditional Hook (Simulated)</h4>
            <p>ngAfterViewInit would run during change detection</p>
            <div #oldBox class="demo-box-content">
              Count: {{ count() }}
            </div>
            <p class="demo-note">
              Execution count: {{ oldHookCount() }}<br>
              <small>Would need setTimeout() to safely access DOM</small>
            </p>
          </div>

          <!-- New API Demo -->
          <div class="demo-box new-way">
            <h4>✅ afterNextRender()</h4>
            <p>Runs AFTER render is complete</p>
            <div #newBox class="demo-box-content">
              Count: {{ count() }}
            </div>
            <p class="demo-note">
              Execution count: {{ newApiCount() }}<br>
              <small>DOM is guaranteed ready!</small>
            </p>
          </div>
        </div>

        <div class="controls">
          <button (click)="increment()" class="demo-button">
            Trigger Re-render ({{ count() }})
          </button>
          <button (click)="reset()" class="demo-button secondary">
            Reset
          </button>
        </div>
      </div>

      <div class="migration-section">
        <h3>🔄 Migration Guide</h3>
        
        <div class="migration-grid">
          <div class="migration-item">
            <h4>ngAfterViewInit → afterNextRender</h4>
            <div class="migration-code">
              <div class="code-before">
                <strong>Before:</strong>
                <pre><code>{{ migrationExample1Before }}</code></pre>
              </div>
              <div class="migration-arrow">→</div>
              <div class="code-after">
                <strong>After:</strong>
                <pre><code>{{ migrationExample1After }}</code></pre>
              </div>
            </div>
          </div>

          <div class="migration-item">
            <h4>ngAfterViewChecked → afterEveryRender</h4>
            <div class="migration-code">
              <div class="code-before">
                <strong>Before:</strong>
                <pre><code>{{ migrationExample2Before }}</code></pre>
              </div>
              <div class="migration-arrow">→</div>
              <div class="code-after">
                <strong>After:</strong>
                <pre><code>{{ migrationExample2After }}</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hooks-table-section">
        <h3>📊 Lifecycle Hooks Comparison</h3>
        
        <div class="table-container">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>Traditional Hook</th>
                <th>When It Runs</th>
                <th>Modern Replacement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>ngOnInit()</code></td>
                <td>Component initialization</td>
                <td>Still use it! ✅</td>
                <td class="status-active">Active</td>
              </tr>
              <tr class="highlight-row">
                <td><code>ngAfterViewInit()</code></td>
                <td>After view initialized</td>
                <td><code>afterNextRender()</code></td>
                <td class="status-replaced">Use new API</td>
              </tr>
              <tr class="highlight-row">
                <td><code>ngAfterViewChecked()</code></td>
                <td>After every view check</td>
                <td><code>afterEveryRender()</code></td>
                <td class="status-replaced">Use new API</td>
              </tr>
              <tr>
                <td><code>ngAfterContentInit()</code></td>
                <td>After content projected</td>
                <td>Still use it! ✅</td>
                <td class="status-active">Active</td>
              </tr>
              <tr>
                <td><code>ngOnDestroy()</code></td>
                <td>Before component destroyed</td>
                <td>Still use it! ✅</td>
                <td class="status-active">Active</td>
              </tr>
              <tr class="new-row">
                <td>—</td>
                <td>Reactive DOM updates</td>
                <td><code>afterRenderEffect()</code></td>
                <td class="status-new">New in v20!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="deprecation-info">
        <h3>⚠️ Deprecation Status</h3>
        <div class="deprecation-grid">
          <div class="deprecation-card active">
            <div class="card-icon">✅</div>
            <h4>NOT Deprecated</h4>
            <ul>
              <li><code>ngOnInit()</code></li>
              <li><code>ngAfterContentInit()</code></li>
              <li><code>ngOnDestroy()</code></li>
            </ul>
            <p>Still recommended for their use cases</p>
          </div>

          <div class="deprecation-card replaced">
            <div class="card-icon">⚠️</div>
            <h4>Has Better Alternative</h4>
            <ul>
              <li><code>ngAfterViewInit()</code></li>
              <li><code>ngAfterViewChecked()</code></li>
            </ul>
            <p>Not deprecated but prefer new APIs</p>
          </div>

          <div class="deprecation-card new">
            <div class="card-icon">🆕</div>
            <h4>Modern APIs (v20+)</h4>
            <ul>
              <li><code>afterNextRender()</code></li>
              <li><code>afterEveryRender()</code></li>
              <li><code>afterRenderEffect()</code></li>
            </ul>
            <p>Production-ready and recommended</p>
          </div>
        </div>
      </div>

      <div class="key-takeaways">
        <h3>🎯 Key Takeaways</h3>
        <div class="takeaway-grid">
          <div class="takeaway-item">
            <div class="takeaway-icon">🔧</div>
            <strong>Renderer Explained</strong>
            <p>Angular's process of updating the DOM based on component state</p>
          </div>
          <div class="takeaway-item">
            <div class="takeaway-icon">⏱️</div>
            <strong>Timing Matters</strong>
            <p>Old hooks run during change detection; new APIs run after render</p>
          </div>
          <div class="takeaway-item">
            <div class="takeaway-icon">✨</div>
            <strong>No More Hacks</strong>
            <p>No setTimeout() workarounds needed anymore!</p>
          </div>
          <div class="takeaway-item">
            <div class="takeaway-icon">🚀</div>
            <strong>Migration Path</strong>
            <p>Simple migration from old hooks to new APIs</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-card {
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

    h3 {
      color: #fff;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }

    .renderer-explanation {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .renderer-explanation h3 {
      color: #667eea;
      margin-top: 0;
    }

    .renderer-flow {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 1.5rem 0;
    }

    .flow-step {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
    }

    .flow-step.highlight {
      border-color: #ffd700;
      background: #fffbeb;
    }

    .flow-step.success {
      border-color: #4caf50;
      background: #f1f8f4;
    }

    .step-number {
      background: #667eea;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    .step-content {
      flex: 1;
    }

    .step-content strong {
      display: block;
      color: #333;
      margin-bottom: 0.25rem;
    }

    .step-content p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .flow-arrow {
      text-align: center;
      color: #667eea;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0.25rem 0;
    }

    .explanation {
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
      border-left: 4px solid #667eea;
    }

    .comparison-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .comparison-section h3 {
      color: #e91e63;
      margin-top: 0;
    }

    .problem-box, .solution-box {
      margin: 1.5rem 0;
      padding: 1.5rem;
      border-radius: 8px;
    }

    .problem-box {
      background: #fff5f5;
      border: 2px solid #ef5350;
    }

    .solution-box {
      background: #f1f8f4;
      border: 2px solid #4caf50;
    }

    .problem-box h4 {
      margin-top: 0;
      color: #c62828;
    }

    .solution-box h4 {
      margin-top: 0;
      color: #2e7d32;
    }

    pre {
      background: rgba(0, 0, 0, 0.8);
      padding: 1rem;
      border-radius: 6px;
      overflow-x: auto;
      margin: 1rem 0;
    }

    pre code {
      color: #e0e0e0;
    }

    code {
      font-family: 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.6;
    }

    .problems-list, .benefits-list {
      display: grid;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .problem-item, .benefit-item {
      padding: 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .problem-item {
      background: rgba(239, 83, 80, 0.1);
    }

    .benefit-item {
      background: rgba(76, 175, 80, 0.1);
    }

    .live-demo-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .live-demo-section h3 {
      color: #667eea;
      margin-top: 0;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin: 1.5rem 0;
    }

    @media (max-width: 768px) {
      .demo-grid {
        grid-template-columns: 1fr;
      }
    }

    .demo-box {
      border-radius: 8px;
      padding: 1.5rem;
    }

    .demo-box.old-way {
      background: #fff5f5;
      border: 2px solid #ef5350;
    }

    .demo-box.new-way {
      background: #f1f8f4;
      border: 2px solid #4caf50;
    }

    .demo-box h4 {
      margin-top: 0;
      font-size: 1.1rem;
    }

    .demo-box-content {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 1rem 0;
    }

    .demo-note {
      font-size: 0.85rem;
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .demo-note small {
      color: #999;
    }

    .controls {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
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

    .migration-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .migration-section h3 {
      color: #667eea;
      margin-top: 0;
    }

    .migration-grid {
      display: grid;
      gap: 2rem;
      margin-top: 1.5rem;
    }

    .migration-item h4 {
      color: #333;
      margin-bottom: 1rem;
    }

    .migration-code {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 1rem;
      align-items: center;
    }

    @media (max-width: 968px) {
      .migration-code {
        grid-template-columns: 1fr;
      }
      
      .migration-arrow {
        text-align: center;
        transform: rotate(90deg);
      }
    }

    .migration-arrow {
      font-size: 2rem;
      color: #667eea;
      font-weight: bold;
    }

    .code-before strong, .code-after strong {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
    }

    .hooks-table-section {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .hooks-table-section h3 {
      color: #667eea;
      margin-top: 0;
    }

    .table-container {
      overflow-x: auto;
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .comparison-table thead {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .comparison-table th {
      padding: 1rem;
      text-align: left;
      font-weight: bold;
    }

    .comparison-table td {
      padding: 1rem;
      border-bottom: 1px solid #e0e0e0;
    }

    .comparison-table tr:last-child td {
      border-bottom: none;
    }

    .comparison-table .highlight-row {
      background: #fffbeb;
    }

    .comparison-table .new-row {
      background: #f1f8f4;
    }

    .status-active {
      color: #4caf50;
      font-weight: bold;
    }

    .status-replaced {
      color: #ff9800;
      font-weight: bold;
    }

    .status-new {
      color: #667eea;
      font-weight: bold;
    }

    .deprecation-info {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }

    .deprecation-info h3 {
      color: #667eea;
      margin-top: 0;
    }

    .deprecation-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    @media (max-width: 968px) {
      .deprecation-grid {
        grid-template-columns: 1fr;
      }
    }

    .deprecation-card {
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
    }

    .deprecation-card.active {
      background: #f1f8f4;
      border: 2px solid #4caf50;
    }

    .deprecation-card.replaced {
      background: #fff8e1;
      border: 2px solid #ff9800;
    }

    .deprecation-card.new {
      background: rgba(102, 126, 234, 0.1);
      border: 2px solid #667eea;
    }

    .card-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .deprecation-card h4 {
      color: #333;
      margin: 1rem 0;
    }

    .deprecation-card ul {
      list-style: none;
      padding: 0;
      margin: 1rem 0;
    }

    .deprecation-card li {
      padding: 0.5rem;
      margin: 0.5rem 0;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
    }

    .deprecation-card p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }

    .key-takeaways {
      background: rgba(255, 255, 255, 0.95);
      padding: 2rem;
      border-radius: 12px;
    }

    .key-takeaways h3 {
      color: #667eea;
      margin-top: 0;
    }

    .takeaway-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    @media (max-width: 768px) {
      .takeaway-grid {
        grid-template-columns: 1fr;
      }
    }

    .takeaway-item {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .takeaway-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .takeaway-item strong {
      display: block;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .takeaway-item p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.6;
    }
  `]
})
export class LifecycleComparisonDemoComponent {
  // Refs for live demo
  oldBox = viewChild<ElementRef>('oldBox');
  newBox = viewChild<ElementRef>('newBox');

  // State
  count = signal(0);
  oldHookCount = signal(0);
  newApiCount = signal(0);

  // Code examples
  oldWayCode = `export class OldComponent implements AfterViewInit {
  @ViewChild('element') element!: ElementRef;
  
  ngAfterViewInit() {
    // ❌ Problem: Runs DURING change detection
    // DOM might not be fully ready
    this.element.nativeElement.focus();
    
    // Workaround: Use setTimeout
    setTimeout(() => {
      this.element.nativeElement.focus(); // Now it works
    }, 0);
  }
}`;

  newWayCode = `export class NewComponent {
  element = viewChild<ElementRef>('element');
  
  constructor() {
    afterNextRender(() => {
      // ✅ Solution: Runs AFTER render completes
      // DOM is guaranteed ready!
      this.element()?.nativeElement.focus(); // Always works
    });
  }
}`;

  migrationExample1Before = `ngAfterViewInit() {
  setTimeout(() => {
    const ctx = this.canvas
      .nativeElement.getContext('2d');
    this.draw(ctx);
  }, 0);
}`;

  migrationExample1After = `constructor() {
  afterNextRender(() => {
    const ctx = this.canvas()
      ?.nativeElement.getContext('2d');
    if (ctx) this.draw(ctx);
  });
}`;

  migrationExample2Before = `ngAfterViewChecked() {
  // Runs during change detection
  // Performance concern
  this.syncWithLibrary();
}`;

  migrationExample2After = `constructor() {
  afterEveryRender(() => {
    // Runs after render
    // Better performance
    this.syncWithLibrary();
  });
}`;

  constructor() {
    // Simulate traditional hook behavior
    // In real code, this would be ngAfterViewChecked
    afterEveryRender(() => {
      this.oldHookCount.update(c => c + 1);
      console.log('❌ Traditional hook would run here (simulated)');
    });

    // New API behavior
    afterNextRender(() => {
      this.newApiCount.set(1);
      console.log('✅ afterNextRender: Runs once after initial render');
      
      const newBoxEl = this.newBox()?.nativeElement;
      if (newBoxEl) {
        newBoxEl.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.5)';
        console.log('✅ DOM is ready, applied styles safely');
      }
    });

    console.log('🔄 LifecycleComparisonDemo: constructor called');
  }

  increment(): void {
    this.count.update(c => c + 1);
    console.log('🔄 State updated, triggering re-render');
  }

  reset(): void {
    this.count.set(0);
    this.oldHookCount.set(0);
    this.newApiCount.set(0);
    console.log('🔄 Reset all counters');
  }
}

