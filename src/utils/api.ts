export const handleApiRequest = async (
  apiCall: () => Promise<Response>,
  errorMessage: string
): Promise<Response> => {
  const response = await apiCall();
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response;
};
