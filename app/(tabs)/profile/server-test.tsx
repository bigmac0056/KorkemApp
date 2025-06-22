import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { apiClient } from '../../../utils/api';
import { API_URL } from '../../../constants/config';

export default function ServerTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      addResult('Starting server connection tests...');
      addResult(`API URL: ${API_URL}`);

      // Test 1: Basic connection
      addResult('Test 1: Testing basic connection...');
      const connectionTest = await apiClient.testConnection();
      addResult(`Connection test: ${connectionTest.success ? '✅ PASS' : '❌ FAIL'} - ${connectionTest.message}`);

      // Test 2: Health check
      addResult('Test 2: Testing health endpoint...');
      const healthTest = await apiClient.healthCheck();
      addResult(`Health check: ${healthTest ? '✅ PASS' : '❌ FAIL'}`);

      // Test 3: CORS test
      addResult('Test 3: Testing CORS...');
      try {
        const response = await fetch(`${API_URL}/api/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        addResult(`CORS test: ${response.ok ? '✅ PASS' : '❌ FAIL'} - Status: ${response.status}`);
      } catch (error) {
        addResult(`CORS test: ❌ FAIL - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test 4: Registration endpoint (without data)
      addResult('Test 4: Testing registration endpoint...');
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        addResult(`Registration endpoint: ${response.status === 400 ? '✅ PASS (validation working)' : '❌ FAIL'} - Status: ${response.status}`);
      } catch (error) {
        addResult(`Registration endpoint: ❌ FAIL - ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      addResult('All tests completed!');

    } catch (error) {
      addResult(`Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Server Connection Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.testButton, isLoading && styles.disabledButton]} 
          onPress={runTests}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Running Tests...' : 'Run Tests'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {testResults.length === 0 ? (
          <Text style={styles.noResults}>No test results yet. Tap "Run Tests" to start.</Text>
        ) : (
          testResults.map((result, index) => (
            <Text key={index} style={styles.resultText}>
              {result}
            </Text>
          ))
        )}
      </ScrollView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Server Information:</Text>
        <Text style={styles.infoText}>API URL: {API_URL}</Text>
        <Text style={styles.infoText}>Environment: Production (Render.com)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'monospace',
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
}); 