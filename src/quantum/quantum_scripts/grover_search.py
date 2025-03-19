# Implementation of Grover's search algorithm
from qiskit import QuantumCircuit, execute
from qiskit.providers.aer import Aer  # Updated import for Aer
from qiskit.algorithms import Grover, AmplificationProblem
from qiskit_ibm_provider import IBMProvider
import numpy as np
import math

def run_grover_search(database, search_item):
    try:
        # Try to connect to IBM Quantum
        provider = IBMProvider()
        use_real_hardware = True
    except:
        use_real_hardware = False
    
    # Find the index of the search item
    if search_item in database:
        target_index = database.index(search_item)
    else:
        return {"result": None, "found": False}
    
    # Number of qubits needed to represent the database
    n = math.ceil(math.log2(len(database)))
    
    # Define the oracle (marks the solution)
    def oracle(qc, qubits):
        # Convert target_index to binary
        bin_target = format(target_index, f'0{n}b')
        
        # Apply X gates to qubits that should be 0
        for i in range(n):
            if bin_target[i] == '0':
                qc.x(qubits[i])
        
        # Multi-controlled Z gate
        qc.h(qubits[n-1])
        qc.mct(qubits[0:n-1], qubits[n-1])
        qc.h(qubits[n-1])
        
        # Undo X gates
        for i in range(n):
            if bin_target[i] == '0':
                qc.x(qubits[i])
    
    # Create the Grover circuit
    grover_circuit = QuantumCircuit(n)
    
    # Initialize in superposition
    grover_circuit.h(range(n))
    
    # Number of iterations (optimal for Grover's algorithm)
    iterations = int(math.pi/4 * math.sqrt(2**n))
    
    # Apply Grover iterations
    for _ in range(iterations):
        # Oracle
        oracle(grover_circuit, list(range(n)))
        
        # Diffusion operator
        grover_circuit.h(range(n))
        grover_circuit.x(range(n))
        grover_circuit.h(n-1)
        grover_circuit.mct(list(range(n-1)), n-1)
        grover_circuit.h(n-1)
        grover_circuit.x(range(n))
        grover_circuit.h(range(n))
    
    # Measure
    grover_circuit.measure_all()
    
    # Execute the circuit
    if use_real_hardware:
        try:
            # Get backends with enough qubits
            backends = provider.backends(
                filters=lambda b: b.configuration().n_qubits >= n and 
                                 not b.configuration().simulator and
                                 b.status().operational
            )
            
            if backends:
                # Sort by queue size
                backends.sort(key=lambda b: b.status().pending_jobs)
                backend = backends[0]
                job = execute(grover_circuit, backend, shots=1024)
                result = job.result()
            else:
                # Fall back to simulator if no suitable backend
                simulator = Aer.get_backend('qasm_simulator')
                job = execute(grover_circuit, simulator, shots=1024)
                result = job.result()
        except Exception as e:
            print(f"Error using real hardware: {str(e)}")
            # Fall back to simulator if real hardware fails
            simulator = Aer.get_backend('qasm_simulator')
            job = execute(grover_circuit, simulator, shots=1024)
            result = job.result()
    else:
        simulator = Aer.get_backend('qasm_simulator')
        job = execute(grover_circuit, simulator, shots=1024)
        result = job.result()
    
    # Get the most frequent outcome
    counts = result.get_counts(grover_circuit)
    max_count = 0
    max_bitstring = ''
    
    for bitstring, count in counts.items():
        if count > max_count:
            max_count = count
            max_bitstring = bitstring
    
    # Convert to decimal
    measured_index = int(max_bitstring, 2)
    
    # Return the result
    if measured_index < len(database):
        return {
            "result": database[measured_index],
            "found": measured_index == target_index,
            "confidence": max_count / 1024,
            "used_real_hardware": use_real_hardware
        }
    else:
        return {"result": None, "found": False} 