// Preload script for Electron
const { contextBridge, ipcRenderer } = require('electron');

// Expose a limited API to the renderer process
contextBridge.exposeInMainWorld('quantumAPI', {
  navigateTo: (url) => ipcRenderer.invoke('navigate-to', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  refresh: () => ipcRenderer.invoke('refresh'),
  getCurrentUrl: () => ipcRenderer.invoke('get-current-url'),
  runQuantumTest: () => {
    console.log('Preload: runQuantumTest called');
    return ipcRenderer.invoke('run-quantum-test')
      .then(result => {
        console.log('Preload: runQuantumTest result:', result);
        return result;
      })
      .catch(error => {
        console.error('Preload: runQuantumTest error:', error);
        throw error;
      });
  },
  getQuantumStatus: () => ipcRenderer.invoke('get-quantum-status'),
  onStatusUpdate: (callback) => {
    ipcRenderer.on('status-update', (_, data) => callback(data));
  },
  onPageUpdated: (callback) => {
    ipcRenderer.on('page-updated', (_, data) => callback(data));
  }
}); 