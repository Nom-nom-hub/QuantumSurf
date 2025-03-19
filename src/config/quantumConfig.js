// Configuration for quantum computing resources
export default {
  providers: {
    ibm: {
      enabled: true,
      apiKey: process.env.IBM_QUANTUM_API_KEY,
      hub: 'ibm-q',
      group: 'open',
      project: 'main'
    },
    aws: {
      enabled: false,
      region: 'us-west-1',
      accessKey: process.env.AWS_BRAKET_ACCESS_KEY,
      secretKey: process.env.AWS_BRAKET_SECRET_KEY
    },
    azure: {
      enabled: false,
      subscriptionId: process.env.AZURE_QUANTUM_SUBSCRIPTION_ID,
      resourceGroup: 'quantum-resources',
      workspace: 'quantum-workspace'
    }
  },
  
  execution: {
    preferredProvider: 'ibm',
    fallbackToSimulation: true,
    maxQueueTime: 300, // seconds
    maxExecutionCost: 10 // credits
  },
  
  simulation: {
    localSimulator: 'qasm_simulator',
    maxQubits: 24,
    shots: 1024
  }
}; 