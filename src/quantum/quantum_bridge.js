// Bridge between Node.js and Python Qiskit
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class QuantumBridge {
  constructor() {
    this.pythonPath = path.join(process.cwd(), 'quantum_env/bin/python');
    this.scriptPath = path.join(__dirname, 'quantum_scripts');
    this.useFallback = false;
  }

  async executeQuantumCircuit(circuitData, retries = 1) {
    return new Promise((resolve, reject) => {
      const scriptName = this.useFallback ? 'run_circuit_fallback.py' : 'run_circuit.py';
      
      const pythonProcess = spawn(this.pythonPath, [
        path.join(this.scriptPath, scriptName),
        JSON.stringify(circuitData)
      ]);

      let resultData = '';
      let errorData = '';

      pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          // If the main script fails and we're not already using the fallback,
          // try the fallback script
          if (!this.useFallback) {
            console.warn('Quantum script failed, switching to fallback implementation');
            this.useFallback = true;
            this.executeQuantumCircuit(circuitData)
              .then(resolve)
              .catch(reject);
          } else if (retries > 0) {
            // Retry with the fallback
            console.warn(`Retrying operation (${retries} retries left)...`);
            setTimeout(() => {
              this.executeQuantumCircuit(circuitData, retries - 1)
                .then(resolve)
                .catch(reject);
            }, 500); // Wait 500ms before retrying
          } else {
            reject(new Error(`Python process exited with code ${code}: ${errorData}`));
          }
        } else {
          try {
            resolve(JSON.parse(resultData));
          } catch (error) {
            reject(new Error(`Failed to parse Python output: ${error.message}`));
          }
        }
      });
    });
  }

  async runGroverSearch(database, searchItem) {
    return this.executeQuantumCircuit({
      type: 'grover',
      database: database,
      searchItem: searchItem
    });
  }

  async generateQuantumKey(keyLength) {
    return this.executeQuantumCircuit({
      type: 'key_generation',
      keyLength: keyLength
    });
  }

  async optimizeResourceAllocation(resources, constraints) {
    return this.executeQuantumCircuit({
      type: 'qaoa',
      resources: resources,
      constraints: constraints || Array(resources.length).fill(Array(resources.length).fill(0))
    });
  }
}

export default QuantumBridge; 