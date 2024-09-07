import { handleApiRequest } from '../api';

// Mock the global fetch function
global.fetch = jest.fn();

describe('handleApiRequest', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should make a successful GET request', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await handleApiRequest({
      url: '/test',
      method: 'GET',
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })
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
      url: '/test',
      method: 'POST',
      data: postData,
    });

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      '/test',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      })
    );
  });

  it('should handle query parameters correctly', async () => {
    const mockResponse = { data: 'test' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await handleApiRequest({
      url: '/test',
      method: 'GET',
      params: { page: '1', limit: '10' },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/test?page=1&limit=10',
      expect.anything()
    );
  });

  it('should throw an error for non-OK responses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    await expect(
      handleApiRequest({
        url: '/test',
        method: 'GET',
        errorMessage: 'Custom error',
      })
    ).rejects.toThrow('Custom error');
  });

  it('should use default error message if not provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Bad Request',
    });

    await expect(
      handleApiRequest({
        url: '/test',
        method: 'GET',
      })
    ).rejects.toThrow('API request failed');
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(
      new Error('Network error')
    );

    await expect(
      handleApiRequest({
        url: '/test',
        method: 'GET',
        errorMessage: 'Failed to fetch',
      })
    ).rejects.toThrow('Failed to fetch');
  });
});
