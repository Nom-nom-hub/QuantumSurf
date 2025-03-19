#!/usr/bin/env python
# Main entry point for quantum operations

import sys
import json
from grover_search import run_grover_search
from key_generation import generate_quantum_key
from qaoa_optimization import run_qaoa_optimization

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No circuit data provided"}))
        sys.exit(1)
    
    try:
        circuit_data = json.loads(sys.argv[1])
        circuit_type = circuit_data.get('type')
        
        if circuit_type == 'grover':
            result = run_grover_search(
                circuit_data.get('database', []), 
                circuit_data.get('searchItem')
            )
        elif circuit_type == 'key_generation':
            result = generate_quantum_key(
                circuit_data.get('keyLength', 256)
            )
        elif circuit_type == 'qaoa':
            result = run_qaoa_optimization(
                circuit_data.get('resources', []),
                circuit_data.get('constraints', [])
            )
        else:
            result = {"error": f"Unknown circuit type: {circuit_type}"}
        
        print(json.dumps(result))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main() 