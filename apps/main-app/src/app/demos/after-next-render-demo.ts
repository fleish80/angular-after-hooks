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
  standalone: true,
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
        </ul>
      </div>

      <div class="example-section">
        <h3>Example: Auto-focus Input</h3>
        <p>This input will be focused automatically after first render:</p>
        <input 
          #focusInput 
          type="text" 
          placeholder="I will be auto-focused!"
          class="demo-input"
        />
        <p class="result">✓ Focus applied using afterNextRender()</p>
      </div>

      <div class="example-section">
        <h3>Example: Measure Element</h3>
        <div #measureBox class="measure-box">
          Measure me!
        </div>
        @if (dimensions()) {
          <p class="result">
            📏 Dimensions: {{ dimensions()?.width }}px × {{ dimensions()?.height }}px
          </p>
        }
      </div>

      <div class="example-section">
        <h3>Example: Third-party Library Init</h3>
        <div #chartContainer class="chart-container"></div>
        @if (chartInitialized()) {
          <p class="result">✓ Chart library initialized</p>
        }
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

    .code-section {
      background: rgba(0, 0, 0, 0.3);
      padding: 1.5rem;
      border-radius: 8px;
      margin-top: 2rem;
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
export class AfterNextRenderDemoComponent {
  // ViewChild signals (new Angular API)
  focusInput = viewChild<ElementRef>('focusInput');
  measureBox = viewChild<ElementRef>('measureBox');
  chartContainer = viewChild<ElementRef>('chartContainer');
  
  // State signals
  dimensions = signal<{ width: number; height: number } | null>(null);
  chartInitialized = signal(false);

  codeExample = `constructor() {
  // Example 1: Auto-focus input
  afterNextRender(() => {
    this.focusInput()?.nativeElement.focus();
  });

  // Example 2: Measure element dimensions
  afterNextRender(() => {
    const el = this.measureBox()?.nativeElement;
    if (el) {
      const rect = el.getBoundingClientRect();
      this.dimensions.set({
        width: rect.width,
        height: rect.height
      });
    }
  });

  // Example 3: Initialize third-party library
  afterNextRender(() => {
    const container = this.chartContainer()?.nativeElement;
    if (container) {
      // Simulate chart library initialization
      container.textContent = '📊 Chart Initialized!';
      this.chartInitialized.set(true);
    }
  });
}`;

  constructor() {
    // Example 1: Auto-focus the input after first render
    afterNextRender(() => {
      const input = this.focusInput()?.nativeElement;
      if (input) {
        input.focus();
        console.log('✓ Input focused via afterNextRender');
      }
    });

    // Example 2: Measure element dimensions
    afterNextRender(() => {
      const box = this.measureBox()?.nativeElement;
      if (box) {
        const rect = box.getBoundingClientRect();
        this.dimensions.set({
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
        console.log('✓ Element measured via afterNextRender:', rect);
      }
    });

    // Example 3: Initialize a "third-party library" (simulated)
    afterNextRender(() => {
      const container = this.chartContainer()?.nativeElement;
      if (container) {
        // In real app: new Chart(container, options)
        container.textContent = '📊 Chart Initialized Successfully!';
        this.chartInitialized.set(true);
        console.log('✓ Chart library initialized via afterNextRender');
      }
    });

    console.log('🎯 AfterNextRenderDemo: constructor called');
    console.log('   Note: afterNextRender callbacks will run AFTER the next render');
  }
}

