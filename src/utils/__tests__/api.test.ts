import { handleApiRequest, getBaseUrl } from '../api';

// Mock fetch
global.fetch = jest.fn();

describe('API utilities', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('handleApiRequest', () => {
    it('should make a successful GET request', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await handleApiRequest({
        url: 'https://api.example.com/test',
        method: 'GET',
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    });

    it('should make a successful POST request with data', async () => {
      const mockResponse = { success: true };
      const postData = { name: 'Test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      const result = await handleApiRequest({
        url: 'https://api.example.com/test',
        method: 'POST',
        data: postData,
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        }
      );
    });

    it('should handle query parameters', async () => {
      const mockResponse = { data: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce(mockResponse),
      });

      await handleApiRequest({
        url: 'https://api.example.com/test',
        method: 'GET',
        params: { page: '1', limit: '10' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/test?page=1&limit=10',
        expect.any(Object)
      );
    });

    it('should throw an error for non-OK responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(
        handleApiRequest({
          url: 'https://api.example.com/test',
          method: 'GET',
        })
      ).rejects.toThrow('API request failed');
    });

    it('should use custom error message when provided', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(
        handleApiRequest({
          url: 'https://api.example.com/test',
          method: 'GET',
          errorMessage: 'Custom error message',
        })
      ).rejects.toThrow('Custom error message');
    });
  });

  describe('getBaseUrl', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should return https URL for production', () => {
      process.env.NODE_ENV = 'production';
      process.env.VERCEL_URL = 'example.vercel.app';
      expect(getBaseUrl()).toBe('https://example.vercel.app');
    });

    it('should return http URL for development', () => {
      process.env.NODE_ENV = 'development';
      expect(getBaseUrl()).toBe('http://localhost:3000');
    });

    it('should use VERCEL_URL when available', () => {
      process.env.NODE_ENV = 'production';
      process.env.VERCEL_URL = 'custom-domain.com';
      expect(getBaseUrl()).toBe('https://custom-domain.com');
    });
  });
});
