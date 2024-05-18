import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class AdyenClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: `https://checkout-test.adyen.com/v${process.env.ADYEN_API_VERSION}`,
      headers: {
        "Content-Type": "application/json",
        "x-api-Key": process.env.ADYEN_API_KEY,
      },
    });
  }

  async makeApiCall<T>(method: string, path: string, data?: any): Promise<T> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: path,
        data,
      };

      const response: AxiosResponse<T> = await this.httpClient.request<T>(config);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to make API call: ${error}`);
    }
  }
}

export default AdyenClient;
