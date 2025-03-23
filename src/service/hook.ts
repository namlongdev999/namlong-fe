import { useCallback, useState } from "react";
import RestAPI, { ApiResponse } from "."; // Import your API service

/**
 * API request methods
 */
type RequestMethod = "get" | "post" | "put" | "delete";

/**
 * Hook for making API requests
 */
export const useRestApi = <T = any>() => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  /**
   * Handle API requests dynamically
   */
  const request = useCallback(
    async (
      method: RequestMethod,
      url: string,
      config: object = {}
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        let response: ApiResponse<T>;

        switch (method) {
          case "get":
            response = await RestAPI.get<T>(url, config);
            setData(response.data);
            break;
          default:
            throw new Error(`Unsupported request method: ${method}`);
        }

        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Something went wrong";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    data,
    get: (url: string, config?: object) => request("get", url, config),
  };
};

export const useMutation = <T = any>() => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle API requests dynamically
   */
  const request = useCallback(
    async (
      method: RequestMethod,
      url: string,
      payload?: any,
      config: object = {}
    ): Promise<T> => {
      setLoading(true);
      setError(null);

      try {
        let response: ApiResponse<T>;

        switch (method) {
          case "post":
            response = await RestAPI.post<T>(url, payload, config);
            break;
          case "put":
            response = await RestAPI.put<T>(url, payload, config);
            break;
          case "delete":
            response = await RestAPI.delete<T>(url, config);
            break;
          default:
            throw new Error(`Unsupported request method: ${method}`);
        }

        return response.data;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Something went wrong";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    post: (url: string, payload?: any, config?: object) =>
      request("post", url, payload, config),
    put: (url: string, payload?: any, config?: object) =>
      request("put", url, payload, config),
    deleteItem: (url: string, config?: object) =>
      request("delete", url, undefined, config),
  };
};
