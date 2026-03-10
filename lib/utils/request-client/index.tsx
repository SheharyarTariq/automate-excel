import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { config as envVars } from "../../config";
import { getTokens } from "../auth-cookies";
import { handleLogout } from "../logout";

export interface ApiParams {
  path: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  params?: Record<string, unknown>;
  data?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  isProtected?: boolean;
  base?: boolean;
}

const RequestClient = async ({
  path,
  method = "GET",
  params,
  data,
  headers = {},
  isProtected,
  base = true,
}: ApiParams): Promise<AxiosResponse> => {
  try {
    const { accessToken } = await getTokens();
    const url = base ? `${envVars.supabaseUrl}/${path}` : path;

    const isFormData = data instanceof FormData;

    const config: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(isProtected ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
    };

    const response = await axios(config);
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<unknown>;
      if (error.response?.status === 401 && isProtected) {
        toast.error("Unauthorized. Please log in again.");
        await handleLogout();
        return Promise.reject(new Error("Unauthorized"));
      }
      console.error("Unexpected API error:", error);
      return Promise.reject(axiosError);
    }
    console.error("Non-Axios Error", error);
    return Promise.reject(error);
  }
};

export default RequestClient;
