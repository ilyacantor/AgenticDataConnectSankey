class DemoController {
  constructor() {
    this.cursorPosition = { x: 0, y: 0 };
    this.annotationText = '';
    this.isRunning = false;
    this.currentScene = 0;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener({
      cursorPosition: this.cursorPosition,
      annotationText: this.annotationText,
      isRunning: this.isRunning
    }));
  }

  async moveCursor(targetElement, options = {}) {
    const { duration = 1000, smooth = true } = options;
    
    if (typeof targetElement === 'string') {
      targetElement = document.querySelector(targetElement);
    }
    
    if (!targetElement) {
      console.warn('Target element not found');
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    if (smooth) {
      const startX = this.cursorPosition.x;
      const startY = this.cursorPosition.y;
      const startTime = Date.now();

      return new Promise(resolve => {
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = this.easeInOutCubic(progress);

          this.cursorPosition = {
            x: startX + (targetX - startX) * eased,
            y: startY + (targetY - startY) * eased
          };
          this.notify();

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };
        animate();
      });
    } else {
      this.cursorPosition = { x: targetX, y: targetY };
      this.notify();
      return Promise.resolve();
    }
  }

  async click(targetElement) {
    if (typeof targetElement === 'string') {
      targetElement = document.querySelector(targetElement);
    }
    
    if (!targetElement) {
      console.warn('Target element not found for click');
      return;
    }

    await this.moveCursor(targetElement);
    await this.wait(300);
    
    targetElement.click();
    await this.wait(200);
  }

  async type(inputElement, text, options = {}) {
    const { delay = 50 } = options;
    
    if (typeof inputElement === 'string') {
      inputElement = document.querySelector(inputElement);
    }
    
    if (!inputElement) {
      console.warn('Input element not found for typing');
      return;
    }

    inputElement.focus();
    
    for (let i = 0; i < text.length; i++) {
      const currentText = text.substring(0, i + 1);
      inputElement.value = currentText;
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      await this.wait(delay);
    }
  }

  showAnnotation(text) {
    this.annotationText = text;
    this.notify();
  }

  hideAnnotation() {
    this.annotationText = '';
    this.notify();
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  async runEngineerDemo() {
    this.isRunning = true;
    this.notify();

    try {
      await this.engineerScene1();
      await this.engineerScene2();
      await this.engineerScene3();
    } catch (error) {
      console.error('Demo error:', error);
    } finally {
      this.isRunning = false;
      this.hideAnnotation();
      this.notify();
    }
  }

  async runBusinessDemo() {
    this.isRunning = true;
    this.notify();

    try {
      await this.businessScene1();
      await this.businessScene2();
      await this.businessScene3();
    } catch (error) {
      console.error('Demo error:', error);
    } finally {
      this.isRunning = false;
      this.hideAnnotation();
      this.notify();
    }
  }

  async engineerScene1() {
    await this.wait(1000);
    
    this.showAnnotation('A Data Engineer needs to add a new production database. The DCL\'s guided wizard makes this a simple, code-free process in seconds.');
    await this.wait(2000);

    await this.click('button:contains("Add New Connection")');
    await this.wait(500);

    const nameInput = 'input[placeholder*="Production"]';
    await this.click(nameInput);
    await this.type(nameInput, 'Production Analytics DB');
    await this.wait(500);

    await this.click('button:contains("Next")');
    await this.wait(500);

    await this.type('input[placeholder*="localhost"]', 'analytics.company.com');
    await this.wait(300);
    await this.type('input[placeholder*="database_name"]', 'analytics_prod');
    await this.wait(300);
    await this.type('input[placeholder*="username"]', 'analytics_user');
    await this.wait(300);
    await this.type('input[type="password"]', 'secure_password_123');
    await this.wait(500);

    await this.click('button:contains("Test Connection")');
    await this.wait(2000);

    await this.click('button:contains("Save Connection")');
    await this.wait(1000);
  }

  async engineerScene2() {
    this.showAnnotation('All connections are monitored from a central dashboard, providing an instant health check of the entire data ecosystem.');
    await this.wait(3000);
  }

  async engineerScene3() {
    this.showAnnotation('When a sync fails, the right people are proactively alerted. No more discovering broken dashboards hours later.');
    await this.wait(3000);

    this.showAnnotation('Engineers can drill down into detailed logs directly in the UI to diagnose and resolve the issue fast, minimizing data downtime.');
    await this.wait(4000);
  }

  async businessScene1() {
    await this.wait(1000);
    
    this.showAnnotation('A Marketing Ops Manager needs to connect their team\'s tools. The DCL provides a simple, self-service catalog of common applications.');
    await this.wait(3000);
  }

  async businessScene2() {
    this.showAnnotation('Connecting is as simple as logging in with your HubSpot account. No need to manage API keys or file an IT ticket.');
    await this.wait(3000);
  }

  async businessScene3() {
    this.showAnnotation('Business users can trigger a manual refresh after important events, like a campaign launch, to get the freshest data into their reports.');
    await this.wait(4000);
  }
}

window.demoController = new DemoController();
