// Core Browser Engine
class BrowserEngine {
  constructor() {
    this.currentUrl = '';
    this.history = [];
    this.bookmarks = [];
    this.tabs = [];
    this.activeTabIndex = 0;
    this.quantumLayer = null;
  }

  async initialize() {
    console.log('Initializing Browser Engine...');
    
    // Create an initial tab
    this.createNewTab('about:blank');
    
    return this;
  }

  // Navigate to a URL
  async navigateTo(url, tabId = this.getActiveTab().id) {
    console.log(`Navigating to ${url} in tab ${tabId}...`);
    
    const tab = this.tabs.find(t => t.id === tabId);
    if (!tab) {
      throw new Error(`Tab with ID ${tabId} not found`);
    }
    
    // Add current URL to history before navigating
    if (tab.url && tab.url !== 'about:blank') {
      this.history.push({
        url: tab.url,
        title: tab.title,
        timestamp: Date.now()
      });
    }
    
    // Update tab with new URL
    tab.url = url;
    tab.loading = true;
    
    try {
      // Simulate page loading
      const pageContent = await this.fetchPageContent(url);
      
      tab.content = pageContent;
      tab.title = this.extractTitle(pageContent) || url;
      tab.loading = false;
      
      return {
        success: true,
        url,
        title: tab.title
      };
    } catch (error) {
      console.error(`Failed to load ${url}:`, error);
      
      tab.content = `<h1>Error loading ${url}</h1><p>${error.message}</p>`;
      tab.title = 'Error';
      tab.loading = false;
      
      return {
        success: false,
        url,
        error: error.message
      };
    }
  }

  // Simulate fetching page content
  async fetchPageContent(url) {
    // In a real implementation, this would use fetch or a similar API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (url.startsWith('http') || url.startsWith('https')) {
          resolve(`
            <html>
              <head>
                <title>Page at ${url}</title>
              </head>
              <body>
                <h1>Welcome to ${url}</h1>
                <p>This is a simulated page content for demonstration purposes.</p>
              </body>
            </html>
          `);
        } else if (url === 'about:blank') {
          resolve(`
            <html>
              <head>
                <title>New Tab</title>
              </head>
              <body>
                <h1>New Tab</h1>
                <p>Welcome to the Quantum-Powered Web Browser!</p>
              </body>
            </html>
          `);
        } else {
          reject(new Error('Invalid URL'));
        }
      }, 500);
    });
  }

  // Extract title from HTML content
  extractTitle(htmlContent) {
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    return titleMatch ? titleMatch[1] : null;
  }

  // Create a new tab
  createNewTab(url = 'about:blank') {
    const tabId = Date.now().toString();
    const newTab = {
      id: tabId,
      url: url,
      title: 'New Tab',
      content: '',
      loading: false
    };
    
    this.tabs.push(newTab);
    this.activeTabIndex = this.tabs.length - 1;
    
    // Navigate to the initial URL
    this.navigateTo(url, tabId);
    
    return newTab;
  }

  // Close a tab
  closeTab(tabId) {
    const tabIndex = this.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) {
      throw new Error(`Tab with ID ${tabId} not found`);
    }
    
    // Remove the tab
    this.tabs.splice(tabIndex, 1);
    
    // Update active tab index
    if (this.tabs.length === 0) {
      // Create a new tab if all tabs are closed
      this.createNewTab();
    } else if (tabIndex <= this.activeTabIndex) {
      // Adjust active tab index if necessary
      this.activeTabIndex = Math.max(0, this.activeTabIndex - 1);
    }
    
    return {
      success: true,
      activeTabId: this.getActiveTab().id
    };
  }

  // Get the active tab
  getActiveTab() {
    return this.tabs[this.activeTabIndex] || null;
  }

  // Switch to a different tab
  switchToTab(tabId) {
    const tabIndex = this.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) {
      throw new Error(`Tab with ID ${tabId} not found`);
    }
    
    this.activeTabIndex = tabIndex;
    return this.getActiveTab();
  }

  // Add a bookmark
  addBookmark(url, title) {
    this.bookmarks.push({
      url,
      title: title || url,
      timestamp: Date.now()
    });
    
    return {
      success: true,
      bookmarksCount: this.bookmarks.length
    };
  }

  // Get browsing history
  getHistory() {
    return [...this.history];
  }

  // Get bookmarks
  getBookmarks() {
    return [...this.bookmarks];
  }

  setQuantumLayer(quantumLayer) {
    this.quantumLayer = quantumLayer;
  }
}

export async function initBrowserEngine() {
  const browserEngine = new BrowserEngine();
  return browserEngine.initialize();
} 