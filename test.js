// Test script for Quantum Browser
import { initQuantumLayer } from './src/quantum/realQuantumLayer.js';

async function testQuantumFunctionality() {
  console.log('Testing Quantum Browser functionality...');
  
  try {
    // Initialize quantum layer
    console.log('Initializing quantum layer...');
    const quantumLayer = await initQuantumLayer();
    
    // Test Grover's search
    console.log('\nTesting Grover\'s search algorithm...');
    const database = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew'];
    const searchItem = 'cherry';
    const searchResult = await quantumLayer.runGroverSearch(database, searchItem);
    console.log(`Search result: ${searchResult}`);
    
    // Test quantum key generation
    console.log('\nTesting quantum key generation...');
    const key = await quantumLayer.generateQuantumKey(8);
    console.log(`Generated key: ${key}`);
    
    // Test resource optimization
    console.log('\nTesting quantum resource optimization...');
    const resources = [0.8, 0.6, 0.4, 0.2];
    const constraints = [
      [0, -0.5, 0, 0],
      [-0.5, 0, -0.3, 0],
      [0, -0.3, 0, -0.2],
      [0, 0, -0.2, 0]
    ];
    const allocation = await quantumLayer.optimizeResourceAllocation(resources, constraints);
    console.log(`Optimized allocation: ${allocation}`);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testQuantumFunctionality(); 