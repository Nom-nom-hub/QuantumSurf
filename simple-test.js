// Simple test script that doesn't rely on complex imports
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting Quantum Browser Simple Test...');

// Check if Python is installed
function checkPython() {
  return new Promise((resolve) => {
    const pythonProcess = spawn('python3', ['--version']);
    
    pythonProcess.on('close', (code) => {
      resolve(code === 0);
    });
  });
}

// Create necessary directories
function createDirectories() {
  const dirs = [
    'src/quantum/quantum_scripts',
    'src/ui',
    'src/core',
    'src/security',
    'src/performance'
  ];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  }
}

// Run a simple quantum simulation
async function runSimpleQuantumTest() {
  console.log('Running simple quantum test...');
  
  const pythonCode = `
import random
import json

# Simulate a quantum key generation
def generate_quantum_key(length):
    # In a real quantum computer, this would use quantum randomness
    # For simulation, we'll use Python's random
    key = ''.join(random.choice('01') for _ in range(length))
    return {
        "key": key,
        "length": len(key),
        "used_real_hardware": False
    }

# Generate and print the result
result = generate_quantum_key(8)
print(json.dumps(result))
`;

  const tempFile = path.join(__dirname, 'temp_quantum_test.py');
  fs.writeFileSync(tempFile, pythonCode);
  
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', [tempFile]);
    
    let resultData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      // Clean up temp file
      fs.unlinkSync(tempFile);
      
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorData}`));
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

async function main() {
  try {
    // Check if Python is installed
    const pythonInstalled = await checkPython();
    if (!pythonInstalled) {
      console.error('Python 3 is not installed or not in PATH');
      return;
    }
    
    console.log('Python 3 is installed');
    
    // Create necessary directories
    createDirectories();
    
    // Run a simple quantum test
    const result = await runSimpleQuantumTest();
    console.log('Quantum key generation result:', result);
    
    console.log('Simple test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

main(); 