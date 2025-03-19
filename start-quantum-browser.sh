#!/bin/bash

# Activate the Python virtual environment
source quantum_env/bin/activate

# Install required packages if needed
pip install qiskit qiskit-aer qiskit-ibm-provider

# Make Python scripts executable
chmod +x src/quantum/quantum_scripts/run_circuit.py
chmod +x src/quantum/quantum_scripts/run_circuit_fallback.py

# Start the browser
npm start 