import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, SECURITY_CONFIG } from '../constants/config';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private maxRetries: number;

  constructor() {
    this.baseUrl = API_URL;
    this.timeout = SECURITY_CONFIG.REQUEST_TIMEOUT;
    this.maxRetries = SECURITY_CONFIG.MAX_RETRY_ATTEMPTS;
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('userToken');
    return {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    let data: any;

    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch (error) {
      console.error('Error parsing response:', error);
      return {
        error: 'Failed to parse response',
        status: response.status,
      };
    }

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userRole');
        throw new Error('Authentication failed. Please login again.');
      }
      
      if (response.status === 423) {
        // Account locked
        return {
          error: data.message || 'Account temporarily locked',
          status: response.status,
        };
      }

      return {
        error: data.message || `Request failed with status ${response.status}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await this.getAuthHeaders();
      const url = `${this.baseUrl}${endpoint}`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API request failed (attempt ${retryCount + 1}):`, error);

      // Handle specific error types
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            error: 'Request timeout',
            status: 408,
          };
        }

        if (error.message.includes('Network request failed')) {
          return {
            error: 'Network error. Please check your connection.',
            status: 0,
          };
        }
      }

      // Retry logic for transient errors
      if (retryCount < this.maxRetries && this.isRetryableError(error)) {
        const delay = Math.pow(2, retryCount) * 1000;
        await this.delay(delay);
        return this.makeRequest<T>(endpoint, options, retryCount + 1);
      }

      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 500,
      };
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors, timeouts, and 5xx server errors
    if (error instanceof Error) {
      return (
        error.message.includes('Network request failed') ||
        error.name === 'AbortError'
      );
    }
    return false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/api/health');
      const isHealthy = response.status === 200;
      return isHealthy;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.get('/');
      if (response.status === 200) {
        return { success: true, message: 'Server is reachable' };
      } else {
        return { success: false, message: `Server responded with status ${response.status}` };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection failed' 
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export types
export type { ApiResponse }; 