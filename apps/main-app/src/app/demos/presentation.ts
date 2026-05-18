import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { AfterNextRenderDemoComponent } from './after-next-render-demo';
import { AfterEveryRenderDemoComponent } from './after-every-render-demo';
import { AfterRenderEffectDemoComponent } from './after-render-effect-demo';
import { EffectDemoComponent } from './effect-demo';
import { LifecycleComparisonDemoComponent } from './lifecycle-comparison-demo';
import { PhasesAndOptionsDemoComponent } from './phases-and-options-demo';

/**
 * Main presentation component that combines all "after render" API demos
 * Perfect for team presentations about Angular's render lifecycle APIs
 */
@Component({
  selector: 'app-presentation',
  imports: [
    AfterNextRenderDemoComponent,
    AfterEveryRenderDemoComponent,
    AfterRenderEffectDemoComponent,
    EffectDemoComponent,
    LifecycleComparisonDemoComponent,
    PhasesAndOptionsDemoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="presentation-container">
      <header class="presentation-header">
        <h1>⚡ Angular "After Render" APIs</h1>
        <p class="subtitle">Complete Guide to Angular's Render Lifecycle Hooks</p>
        <div class="version-badge">Angular 21 — current stable</div>
      </header>

      <nav class="quick-nav">
        <h3>📑 Quick Navigation</h3>
        <div class="nav-links">
          <a href="#after-next-render" class="nav-link">
            <span class="icon">🎯</span>
            <span>afterNextRender</span>
          </a>
          <a href="#after-every-render" class="nav-link">
            <span class="icon">🔄</span>
            <span>afterEveryRender</span>
          </a>
          <a href="#after-render-effect" class="nav-link">
            <span class="icon">⚡</span>
            <span>afterRenderEffect</span>
          </a>
          <a href="#phases-and-options" class="nav-link">
            <span class="icon">🧩</span>
            <span>Phases &amp; Options</span>
          </a>
          <a href="#effect" class="nav-link">
            <span class="icon">💫</span>
            <span>effect</span>
          </a>
          <a href="#lifecycle-comparison" class="nav-link">
            <span class="icon">🔄</span>
            <span>Lifecycle Hooks</span>
          </a>
          <a href="#comparison" class="nav-link">
            <span class="icon">🆚</span>
            <span>Comparison</span>
          </a>
        </div>
      </nav>

      <section class="intro-section">
        <h2>🎯 What Are These APIs?</h2>
        <div class="intro-grid">
          <div class="intro-card">
            <h3>🎯 afterNextRender</h3>
            <p>Runs <strong>once</strong> after the next render</p>
            <span class="status stable">Stable in v20+</span>
          </div>
          <div class="intro-card">
            <h3>🔄 afterEveryRender</h3>
            <p>Runs <strong>every time</strong> after rendering</p>
            <span class="status renamed">Renamed from afterRender in v20</span>
          </div>
          <div class="intro-card">
            <h3>⚡ afterRenderEffect</h3>
            <p>
              Reactive effect that runs after render. <strong>Angular 21</strong> added a
              phase spec — values flow between phases as signals.
            </p>
            <span class="status new">Phase spec new in v21</span>
          </div>
          <div class="intro-card">
            <h3>💫 effect</h3>
            <p>General signal effect (not render-specific)</p>
            <span class="status stable">Stable in v20+</span>
          </div>
          <div class="intro-card">
            <h3>🧩 Phases &amp; Options</h3>
            <p>
              The four render phases — <code>earlyRead</code>, <code>write</code>,
              <code>mixedReadWrite</code>, <code>read</code> — plus the <code>injector</code> option.
            </p>
            <span class="status new">Full API surface</span>
          </div>
        </div>
      </section>

      <section class="key-points">
        <h2>🔑 Key Points</h2>
        <div class="points-grid">
          <div class="point">
            <div class="point-icon">✅</div>
            <div class="point-content">
              <h4>Production Ready</h4>
              <p>All APIs are stable in Angular 20+</p>
            </div>
          </div>
          <div class="point">
            <div class="point-icon">🚀</div>
            <div class="point-content">
              <h4>No More Hacks</h4>
              <p>Replaces setTimeout/requestAnimationFrame workarounds</p>
            </div>
          </div>
          <div class="point">
            <div class="point-icon">🌐</div>
            <div class="point-content">
              <h4>SSR Safe</h4>
              <p>After render APIs automatically skip during SSR</p>
            </div>
          </div>
          <div class="point">
            <div class="point-icon">📊</div>
            <div class="point-content">
              <h4>Reactive</h4>
              <p>afterRenderEffect combines signals with render timing</p>
            </div>
          </div>
        </div>
      </section>

      <section id="after-next-render" class="demo-section">
        <app-after-next-render-demo />
      </section>

      <section id="after-every-render" class="demo-section">
        <app-after-every-render-demo />
      </section>

      <section id="after-render-effect" class="demo-section">
        <app-after-render-effect-demo />
      </section>

      <section id="phases-and-options" class="demo-section">
        <app-phases-and-options-demo />
      </section>

      <section id="effect" class="demo-section">
        <app-effect-demo />
      </section>

      <section id="lifecycle-comparison" class="demo-section">
        <app-lifecycle-comparison-demo />
      </section>

      <section id="comparison" class="comparison-section">
        <h2>🆚 Complete Comparison</h2>
        
        <div class="comparison-table-container">
          <table class="main-comparison-table">
            <thead>
              <tr>
                <th>API</th>
                <th>Timing</th>
                <th>Frequency</th>
                <th>Reactive</th>
                <th>SSR</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>afterNextRender</strong></td>
                <td>After next render</td>
                <td>Once</td>
                <td>❌ No</td>
                <td>✅ Skipped</td>
                <td>One-time DOM setup</td>
              </tr>
              <tr>
                <td><strong>afterEveryRender</strong></td>
                <td>After every render</td>
                <td>Every render</td>
                <td>❌ No</td>
                <td>✅ Skipped</td>
                <td>Continuous DOM sync</td>
              </tr>
              <tr>
                <td><strong>afterRenderEffect</strong></td>
                <td>After render + signal change</td>
                <td>On signal change</td>
                <td>✅ Yes</td>
                <td>✅ Skipped</td>
                <td>Reactive DOM updates</td>
              </tr>
              <tr>
                <td><strong>effect</strong></td>
                <td>When signals change</td>
                <td>On signal change</td>
                <td>✅ Yes</td>
                <td>⚠️ Runs</td>
                <td>Non-DOM side effects</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="decision-tree">
          <h3>🎯 Decision Tree: Which API to Use?</h3>
          <div class="tree-content">
            <div class="tree-question">
              <strong>Need to run code after rendering?</strong>
              <div class="tree-branches">
                <div class="tree-branch">
                  <div class="branch-label">Runs only once?</div>
                  <div class="branch-result">→ <code>afterNextRender</code></div>
                </div>
                <div class="tree-branch">
                  <div class="branch-label">Runs every render?</div>
                  <div class="tree-sub-branches">
                    <div class="tree-branch">
                      <div class="branch-label">Reacts to signals?</div>
                      <div class="branch-result">→ <code>afterRenderEffect</code></div>
                    </div>
                    <div class="tree-branch">
                      <div class="branch-label">Always runs?</div>
                      <div class="branch-result">→ <code>afterEveryRender</code></div>
                    </div>
                  </div>
                </div>
                <div class="tree-branch">
                  <div class="branch-label">Not tied to rendering?</div>
                  <div class="branch-result">→ <code>effect</code></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="migration-guide">
          <h3>🔄 Migration from Angular 19 to 20</h3>
          <div class="migration-example">
            <div class="migration-before">
              <h4>❌ Angular 19 (Old)</h4>
              <pre><code>import &#123; afterRender &#125; from '&#64;angular/core';

afterRender(() => &#123;
  // ...
&#125;);</code></pre>
            </div>
            <div class="migration-arrow">→</div>
            <div class="migration-after">
              <h4>✅ Angular 20+ (New)</h4>
              <pre><code>import &#123; afterEveryRender &#125; from '&#64;angular/core';

afterEveryRender(() => &#123;
  // ...
&#125;);</code></pre>
            </div>
          </div>
        </div>
      </section>

      <footer class="presentation-footer">
        <h3>📚 Resources</h3>
        <ul>
          <li><a href="https://angular.dev/guide/components/lifecycle" target="_blank">Official Angular Lifecycle Documentation</a></li>
          <li><a href="https://angular.dev/guide/signals" target="_blank">Signals Guide</a></li>
          <li><a href="https://github.com/angular/angular/releases" target="_blank">Angular Release Notes</a></li>
        </ul>
        <p class="footer-note">
          💡 All examples use Angular 20+ features: standalone components, signals, 
          modern control flow (&#64;if, &#64;for), and OnPush change detection.
        </p>
      </footer>
    </div>
  `,
  styles: [`
    .presentation-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .presentation-header {
      text-align: center;
      padding: 3rem 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 16px;
      color: white;
      margin-bottom: 2rem;
      position: relative;
      overflow: hidden;
    }

    .presentation-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.1)"/></svg>');
      opacity: 0.1;
    }

    .presentation-header h1 {
      margin: 0;
      font-size: 3rem;
      position: relative;
      z-index: 1;
    }

    .subtitle {
      font-size: 1.3rem;
      margin: 1rem 0;
      opacity: 0.95;
      position: relative;
      z-index: 1;
    }

    .version-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-weight: bold;
      margin-top: 1rem;
      position: relative;
      z-index: 1;
    }

    .quick-nav {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .quick-nav h3 {
      margin-top: 0;
      color: #667eea;
    }

    .nav-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      border-radius: 8px;
      text-decoration: none;
      color: #333;
      font-weight: 600;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .nav-link:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .nav-link .icon {
      font-size: 1.5rem;
    }

    .intro-section {
      margin-bottom: 3rem;
    }

    .intro-section h2 {
      font-size: 2rem;
      color: #333;
      margin-bottom: 1.5rem;
    }

    .intro-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .intro-card {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-top: 4px solid #667eea;
    }

    .intro-card h3 {
      margin-top: 0;
      color: #667eea;
      font-size: 1.5rem;
    }

    .intro-card p {
      color: #666;
      margin: 1rem 0;
    }

    .status {
      display: inline-block;
      padding: 0.4rem 0.8rem;
      border-radius: 16px;
      font-size: 0.85rem;
      font-weight: bold;
    }

    .status.stable {
      background: rgba(76, 175, 80, 0.2);
      color: #2e7d32;
    }

    .status.renamed {
      background: rgba(255, 152, 0, 0.2);
      color: #e65100;
    }

    .status.new {
      background: rgba(33, 150, 243, 0.2);
      color: #0d47a1;
    }

    .key-points {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 3rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .key-points h2 {
      margin-top: 0;
      color: #667eea;
    }

    .points-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .point {
      display: flex;
      gap: 1rem;
      align-items: start;
    }

    .point-icon {
      font-size: 2.5rem;
      flex-shrink: 0;
    }

    .point-content h4 {
      margin: 0 0 0.5rem 0;
      color: #333;
    }

    .point-content p {
      margin: 0;
      color: #666;
      font-size: 0.95rem;
    }

    .demo-section {
      margin-bottom: 2rem;
      scroll-margin-top: 2rem;
    }

    .comparison-section {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      margin-top: 3rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      scroll-margin-top: 2rem;
    }

    .comparison-section h2 {
      margin-top: 0;
      color: #667eea;
      font-size: 2rem;
    }

    .comparison-table-container {
      overflow-x: auto;
      margin: 2rem 0;
    }

    .main-comparison-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    .main-comparison-table th,
    .main-comparison-table td {
      padding: 1rem;
      text-align: left;
      border-bottom: 2px solid #f0f0f0;
    }

    .main-comparison-table th {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-weight: bold;
    }

    .main-comparison-table tbody tr:hover {
      background: rgba(102, 126, 234, 0.05);
    }

    .main-comparison-table code {
      background: rgba(102, 126, 234, 0.1);
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }

    .decision-tree {
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem 0;
    }

    .decision-tree h3 {
      margin-top: 0;
      color: #667eea;
    }

    .tree-content {
      margin-top: 1.5rem;
    }

    .tree-question {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .tree-branches {
      margin-top: 1rem;
      padding-left: 1rem;
      border-left: 2px solid #e0e0e0;
    }

    .tree-branch {
      margin: 1rem 0;
      padding-left: 1rem;
    }

    .branch-label {
      font-weight: 600;
      color: #555;
      margin-bottom: 0.5rem;
    }

    .branch-result {
      padding: 0.75rem;
      background: rgba(76, 175, 80, 0.1);
      border-radius: 6px;
      border-left: 3px solid #4caf50;
      font-weight: 600;
      margin-top: 0.5rem;
    }

    .branch-result code {
      background: rgba(102, 126, 234, 0.2);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      color: #667eea;
    }

    .tree-sub-branches {
      margin-left: 1rem;
      padding-left: 1rem;
      border-left: 2px solid #e0e0e0;
      margin-top: 0.5rem;
    }

    .migration-guide {
      background: rgba(255, 152, 0, 0.1);
      padding: 2rem;
      border-radius: 12px;
      margin: 2rem 0;
      border-left: 4px solid #ff9800;
    }

    .migration-guide h3 {
      margin-top: 0;
      color: #e65100;
    }

    .migration-example {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 1rem;
      align-items: center;
      margin-top: 1rem;
    }

    @media (max-width: 768px) {
      .migration-example {
        grid-template-columns: 1fr;
      }
      .migration-arrow {
        text-align: center;
        transform: rotate(90deg);
      }
    }

    .migration-before,
    .migration-after {
      background: white;
      padding: 1rem;
      border-radius: 8px;
    }

    .migration-before h4 {
      margin-top: 0;
      color: #d32f2f;
    }

    .migration-after h4 {
      margin-top: 0;
      color: #388e3c;
    }

    .migration-arrow {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .migration-example pre {
      margin: 0;
      overflow-x: auto;
    }

    .migration-example code {
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .presentation-footer {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-top: 3rem;
    }

    .presentation-footer h3 {
      margin-top: 0;
    }

    .presentation-footer ul {
      list-style: none;
      padding: 0;
    }

    .presentation-footer li {
      margin: 0.75rem 0;
    }

    .presentation-footer a {
      color: white;
      text-decoration: none;
      border-bottom: 2px solid rgba(255, 255, 255, 0.5);
      transition: border-color 0.2s;
    }

    .presentation-footer a:hover {
      border-color: white;
    }

    .footer-note {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      font-size: 0.95rem;
    }

    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
  `]
})
export class PresentationComponent {
  constructor() {
    console.log('🎉 Presentation Component loaded');
    console.log('📚 This presentation covers all Angular "after render" APIs');
  }
}

