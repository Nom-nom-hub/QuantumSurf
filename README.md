# QuantumSurf

A quantum-powered web browser leveraging real quantum computing capabilities.

## Overview

QuantumSurf is an experimental web browser that integrates quantum computing technologies to enhance browsing capabilities. Built with Electron and Python, it uses Qiskit for quantum computing operations.

## Features

- Electron-based browser interface
- Integration with quantum computing via Qiskit
- Quantum-enhanced search algorithms using Grover's algorithm
- Quantum key generation for enhanced security
- Fallback to simulation when quantum hardware is unavailable

## Prerequisites

- Node.js (v14+)
- Python 3.13+
- Quantum computing knowledge (recommended)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Nom-nom-hub/QuantumSurf.git
   cd QuantumSurf
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the quantum environment:
   ```
   npm run setup-quantum
   ```

## Usage

Start the browser:
```
npm start
```

## Development

The project structure:
- `src/` - Main application code
  - `src/quantum/` - Quantum computing integration
  - `src/config/` - Configuration files
- `quantum_env/` - Python virtual environment with quantum libraries

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
