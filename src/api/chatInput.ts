import api from './api'


export const sendMessage = async (model: string, message: string) => {
  try {
    if (!model || !message) {
      throw new Error("Model and message are required.");
    }

    const response = await api.post("/message/send", {
      model,
      message
    });

    return response.data.response;
  } catch (error: any) {
    console.error("Chat Input Error:", error);
    throw new Error(error.response?.data?.error || "Unexpected error occurred");
  }
};
