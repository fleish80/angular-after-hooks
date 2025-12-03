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
  standalone: true,
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
      </div>

      <div class="example-section">
        <h3>Example 3: Color Animation</h3>
        <p>Color changes based on count value:</p>
        
        <div #colorBox class="color-box">
          Count: {{ count() }}
        </div>
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

      <div class="code-section">
        <h3>Code Example:</h3>
        <pre><code>{{ codeExample }}</code></pre>
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
export class AfterRenderEffectDemoComponent {
  // Refs
  canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  progressBar = viewChild<ElementRef>('progressBar');
  colorBox = viewChild<ElementRef>('colorBox');
  
  // State
  count = signal(0);
  progress = signal(50);

  codeExample = `constructor() {
  // Example 1: Reactive canvas drawing
  afterRenderEffect(() => {
    const ctx = this.canvas()?.nativeElement.getContext('2d');
    if (!ctx) return;
    
    // This re-runs whenever count() changes
    const value = this.count();
    
    // Clear and redraw
    ctx.clearRect(0, 0, 400, 200);
    ctx.fillStyle = '#667eea';
    ctx.fillRect(50, 50, value * 10, 100);
  });

  // Example 2: Reactive progress bar
  afterRenderEffect(() => {
    const bar = this.progressBar()?.nativeElement;
    if (!bar) return;
    
    // Updates when progress() changes
    bar.style.width = \`\${this.progress()}%\`;
  });
}`;

  constructor() {
    // Example 1: Reactive Canvas Drawing
    // Re-runs whenever count() changes AND after render
    afterRenderEffect(() => {
      const canvasEl = this.canvas()?.nativeElement;
      if (!canvasEl) return;
      
      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;

      const value = this.count(); // Track signal
      
      // Clear canvas
      ctx.clearRect(0, 0, 400, 200);
      
      // Draw background
      ctx.fillStyle = '#f5f5f5';
      ctx.fillRect(0, 0, 400, 200);
      
      // Draw bar based on count
      const barWidth = Math.min(value * 20, 350);
      const gradient = ctx.createLinearGradient(0, 0, barWidth, 0);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(25, 50, barWidth, 100);
      
      // Draw text
      ctx.fillStyle = '#333';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Count: ${value}`, 25, 35);
      
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.fillText('This canvas updates reactively via afterRenderEffect', 25, 180);
      
      console.log('⚡ Canvas redrawn via afterRenderEffect, count:', value);
    });

    // Example 2: Reactive Progress Bar
    afterRenderEffect(() => {
      const bar = this.progressBar()?.nativeElement;
      if (!bar) return;
      
      const progressValue = this.progress(); // Track signal
      bar.style.width = `${progressValue}%`;
      bar.textContent = `${progressValue}%`;
      
      console.log('⚡ Progress bar updated via afterRenderEffect:', progressValue);
    });

    // Example 3: Reactive Color Animation
    afterRenderEffect(() => {
      const box = this.colorBox()?.nativeElement;
      if (!box) return;
      
      const value = this.count(); // Track signal
      
      // Change color based on count
      const hue = (value * 30) % 360;
      box.style.backgroundColor = `hsl(${hue}, 70%, 60%)`;
      
      console.log('⚡ Color box updated via afterRenderEffect, hue:', hue);
    });

    console.log('⚡ AfterRenderEffectDemo: constructor called');
  }

  increment(): void {
    this.count.update(c => c + 1);
  }

  reset(): void {
    this.count.set(0);
  }

  incrementProgress(): void {
    this.progress.update(p => Math.min(p + 10, 100));
  }

  decrementProgress(): void {
    this.progress.update(p => Math.max(p - 10, 0));
  }
}

