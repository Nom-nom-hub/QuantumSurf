# Quantum key generation
from qiskit import QuantumCircuit, execute
from qiskit.providers.aer import Aer  # Updated import for Aer
from qiskit_ibm_provider import IBMProvider
import numpy as np

def generate_quantum_key(key_length):
    try:
        # Try to connect to IBM Quantum
        provider = IBMProvider()
        use_real_hardware = True
    except:
        use_real_hardware = False
    
    # Create a quantum circuit for key generation
    qc = QuantumCircuit(key_length, key_length)
    
    # Put all qubits in superposition
    qc.h(range(key_length))
    
    # Measure all qubits
    qc.measure(range(key_length), range(key_length))
    
    # Execute the circuit
    if use_real_hardware:
        try:
            # Find a backend with enough qubits
            backends = provider.backends(
                filters=lambda b: b.configuration().n_qubits >= key_length and 
                                 not b.configuration().simulator and
                                 b.status().operational
            )
            
            if backends:
                # Sort by queue size
                backends.sort(key=lambda b: b.status().pending_jobs)
                backend = backends[0]
                job = execute(qc, backend, shots=1)
                result = job.result()
            else:
                # Fall back to simulator if no suitable backend
                simulator = Aer.get_backend('qasm_simulator')
                job = execute(qc, simulator, shots=1)
                result = job.result()
        except Exception as e:
            print(f"Error using real hardware: {str(e)}")
            # Fall back to simulator if real hardware fails
            simulator = Aer.get_backend('qasm_simulator')
            job = execute(qc, simulator, shots=1)
            result = job.result()
    else:
        simulator = Aer.get_backend('qasm_simulator')
        job = execute(qc, simulator, shots=1)
        result = job.result()
    
    # Get the measurement outcome
    counts = result.get_counts(qc)
    key = list(counts.keys())[0]  # There should be only one outcome with shots=1
    
    return {
        "key": key,
        "length": len(key),
        "used_real_hardware": use_real_hardware
    } 