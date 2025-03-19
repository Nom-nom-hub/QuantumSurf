# Installation Guide

This document provides detailed installation instructions for QuantumSurf.

## System Requirements

- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **CPU**: 64-bit processor, 2+ cores recommended
- **RAM**: 4GB minimum, 8GB+ recommended
- **Disk Space**: 1GB for application, plus additional space for quantum environment

## Dependencies

### Required Software

1. **Node.js** (v14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)

2. **Python** (3.13 or higher)
   - Download from [python.org](https://python.org/)

3. **Git**
   - Download from [git-scm.com](https://git-scm.com/)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Nom-nom-hub/QuantumSurf.git
cd QuantumSurf
```

### 2. Install Node Dependencies

```bash
npm install
```

### 3. Set Up Quantum Environment

This will create a Python virtual environment and install the required quantum computing packages:

```bash
npm run setup-quantum
```

The setup process may take several minutes as it downloads and installs Qiskit and related packages.

### 4. Configure Quantum Providers (Optional)

For real quantum hardware access, you'll need to set up API keys:

1. Create an account at [IBM Quantum Experience](https://quantum-computing.ibm.com/)
2. Generate an API token
3. Set the environment variable:
   ```
   export IBM_QUANTUM_API_KEY=your_api_key_here
   ```

### 5. Verify Installation

```bash
npm start
```

If the browser launches successfully, your installation is complete.

## Troubleshooting

### Common Issues

1. **Python Environment Issues**
   - Ensure Python is in your PATH
   - Try manually creating the environment: `python -m venv quantum_env`

2. **Node.js Errors**
   - Verify Node.js version: `node --version`
   - Update npm: `npm install -g npm`

3. **Qiskit Installation Failures**
   - Try manual installation: `pip install qiskit qiskit-aer qiskit-ibm-provider`

4. **Quantum Hardware Connection Issues**
   - Verify your API key is correct
   - Check network connectivity to IBM Quantum services
   - Try using the fallback simulator mode
