const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://full-quiz-c8b8ame9byhac9a2.westeurope-01.azurewebsites.net/api';

export async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = new Headers(options.headers);

  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Include cookies in requests
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Don't redirect on login/register pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    // Try to extract error message from response
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.errors) {
          // Handle ModelState errors
          const errors = Object.values(errorData.errors).flat() as string[];
          errorMessage = errors.join(', ');
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      }
    } catch {
      // If parsing fails, use default message
    }

    throw new Error(errorMessage);
  }

  // Handle 204 No Content (empty response body)
  if (response.status === 204) {
    return undefined as T;
  }

  // Check if response has content before parsing JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const text = await response.text();
    if (!text || text.trim() === '') {
      return undefined as T;
    }
    return JSON.parse(text) as T;
  }

  // If no content type or not JSON, return undefined
  return undefined as T;
}
