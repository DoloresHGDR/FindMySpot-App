import apiClient from "@/services/remote/apiClient";

export const updateBalance = async (amount: number) => {
  const payload = { amount };
  const response = await apiClient.post('/api/balance/add', payload);
  return response.data;
};