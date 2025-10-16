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
    
    // For React controlled inputs, we need to set the value and trigger change events
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    
    for (let i = 0; i < text.length; i++) {
      const currentText = text.substring(0, i + 1);
      
      // Set value using native setter to bypass React
      nativeInputValueSetter.call(inputElement, currentText);
      
      // Dispatch both input and change events for React
      inputElement.dispatchEvent(new Event('input', { bubbles: true }));
      inputElement.dispatchEvent(new Event('change', { bubbles: true }));
      
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

  async waitForElement(selector, options = {}) {
    const { timeout = 5000, interval = 100 } = options;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const check = () => {
        let element;
        
        if (typeof selector === 'function') {
          element = selector();
        } else if (typeof selector === 'string') {
          element = document.querySelector(selector);
        } else {
          element = selector;
        }

        if (element) {
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          console.error(`Element not found after ${timeout}ms:`, selector);
          reject(new Error(`Timeout waiting for element: ${selector}`));
        } else {
          setTimeout(check, interval);
        }
      };
      check();
    });
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
      
      // Return to demo home after completion
      await this.wait(2000);
      window.location.hash = '#/demo';
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
      
      // Return to demo home after completion
      await this.wait(2000);
      window.location.hash = '#/demo';
    }
  }

  async engineerScene1() {
    this.showAnnotation('A Data Engineer needs to add a new production database. The DCL\'s guided wizard makes this a simple, code-free process in seconds.');
    await this.wait(1000);

    try {
      // Wait for and click the Add New Connection button
      const addButton = await this.waitForElement(() => 
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Add New Connection')
        )
      );
      await this.click(addButton);
      await this.wait(500);

      // Wait for and type connection name
      const nameInput = await this.waitForElement('input[placeholder*="Production"]');
      await this.click(nameInput);
      await this.type(nameInput, 'Production Analytics DB');
      await this.wait(500);

      // Wait for and click Next button
      const nextButton = await this.waitForElement(() =>
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Next')
        )
      );
      await this.click(nextButton);
      await this.wait(500);

      // Fill in connection details - wait for modal to be visible
      await this.wait(500);
      
      // Find inputs by their position in the modal
      const inputs = await this.waitForElement(() => {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
          const textInputs = Array.from(modal.querySelectorAll('input[type="text"]'));
          const passwordInput = modal.querySelector('input[type="password"]');
          if (textInputs.length >= 3 && passwordInput) {
            return { host: textInputs[0], db: textInputs[1], user: textInputs[2], password: passwordInput };
          }
        }
        return null;
      });

      // Type into host field
      await this.click(inputs.host);
      await this.type(inputs.host, 'analytics.company.com');
      await this.wait(300);

      // Type into database field
      await this.click(inputs.db);
      await this.type(inputs.db, 'analytics_prod');
      await this.wait(300);

      // Type into user field
      await this.click(inputs.user);
      await this.type(inputs.user, 'analytics_user');
      await this.wait(300);

      // Type into password field
      await this.click(inputs.password);
      await this.type(inputs.password, 'test_password');
      await this.wait(500);

      // Wait for and click Test Connection
      const testButton = await this.waitForElement(() =>
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Test Connection')
        )
      );
      await this.click(testButton);
      await this.wait(2000);

      // Wait for and click Save Connection
      const saveButton = await this.waitForElement(() =>
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Save Connection')
        )
      );
      await this.click(saveButton);
      await this.wait(1000);
      
    } catch (error) {
      console.error('Engineer Scene 1 failed:', error);
      this.showAnnotation('Demo failed to complete. Please refresh and try again.');
      await this.wait(3000);
    }
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
    this.showAnnotation('A Marketing Ops Manager needs to connect their team\'s tools. The DCL provides a simple, self-service catalog of common applications.');
    await this.wait(2000);

    try {
      // Click Add New Connection
      const addButton = await this.waitForElement(() => 
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Add New Connection')
        )
      );
      await this.click(addButton);
      await this.wait(500);

      // Type connection name
      const nameInput = await this.waitForElement('input[placeholder*="Production"]');
      await this.click(nameInput);
      await this.type(nameInput, 'HubSpot Marketing');
      await this.wait(500);

      // Click Next
      const nextButton = await this.waitForElement(() =>
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Next')
        )
      );
      await this.click(nextButton);
      await this.wait(500);
      
    } catch (error) {
      console.error('Business Scene 1 failed:', error);
    }
  }

  async businessScene2() {
    this.showAnnotation('Connecting is as simple as logging in with your HubSpot account. No need to manage API keys or file an IT ticket.');
    await this.wait(1000);

    try {
      // Find inputs and auto-fill with HubSpot-like credentials
      const inputs = await this.waitForElement(() => {
        const modal = document.querySelector('.fixed.inset-0');
        if (modal) {
          const textInputs = Array.from(modal.querySelectorAll('input[type="text"]'));
          const passwordInput = modal.querySelector('input[type="password"]');
          if (textInputs.length >= 3 && passwordInput) {
            return { host: textInputs[0], db: textInputs[1], user: textInputs[2], password: passwordInput };
          }
        }
        return null;
      });

      await this.click(inputs.host);
      await this.type(inputs.host, 'api.hubspot.com');
      await this.wait(300);

      await this.click(inputs.db);
      await this.type(inputs.db, 'hubspot_marketing');
      await this.wait(300);

      await this.click(inputs.user);
      await this.type(inputs.user, 'marketing_team');
      await this.wait(300);

      await this.click(inputs.password);
      await this.type(inputs.password, 'oauth_token_123');
      await this.wait(500);

      // Click Test Connection
      const testButton = await this.waitForElement(() =>
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Test Connection')
        )
      );
      await this.click(testButton);
      await this.wait(2000);

    } catch (error) {
      console.error('Business Scene 2 failed:', error);
    }
  }

  async businessScene3() {
    this.showAnnotation('Business users can trigger a manual refresh after important events, like a campaign launch, to get the freshest data into their reports.');
    await this.wait(1000);

    try {
      // Click Save Connection
      const saveButton = await this.waitForElement(() =>
        Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent.includes('Save Connection')
        )
      );
      await this.click(saveButton);
      await this.wait(2000);

      this.showAnnotation('HubSpot is now connected! Marketing data flows automatically into your reports.');
      await this.wait(3000);
      
    } catch (error) {
      console.error('Business Scene 3 failed:', error);
    }
  }
}

window.demoController = new DemoController();
