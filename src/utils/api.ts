type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiRequestOptions {
  url: string;
  method: HttpMethod;
  params?: Record<string, string>;
  data?: any;
  errorMessage?: string;
}

export async function handleApiRequest<T>({
  url,
  method,
  params,
  data,
  errorMessage = 'API request failed',
}: ApiRequestOptions): Promise<T> {
  try {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    const fullUrl = `${url}${queryString}`;

    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(fullUrl, options);

    if (!response.ok) {
      throw new Error(`${errorMessage}: ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData as T;
  } catch (error) {
    // console.error(`${errorMessage}:`, error);
    throw new Error(errorMessage);
  }
}
