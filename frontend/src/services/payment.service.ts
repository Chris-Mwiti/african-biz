import api from '../api'; // Assuming an axios instance or similar for API calls

interface CreateCheckoutSessionPayload {
  priceId: string;
  userId: string;
}

interface CreateCheckoutSessionResponse {
  url: string;
}

export const createCheckoutSession = async (payload: CreateCheckoutSessionPayload): Promise<string> => {
  try {
    const response = await api.post<CreateCheckoutSessionResponse>('/stripe/create-checkout-session', payload);
    return response.data.url;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};
