/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";

export default class HandleResult {
  static handleOperation = async (
    operation: () => Promise<Result<any>>,
    successMessage: string,
    loadingMessage: string,
    setResources?: (data: any) => void
  ) => {
    const response = await toast.promise(operation(), {
      loading: loadingMessage,
      success: (result) => {
        if (result.success) {
          return successMessage;
        } else {
          throw Error(result.error);
        }
      },
      error: (result) => result.toString(),
    });

    if (response.success) {
      console.log(response.data);
      if (setResources) setResources(response.data);
    } else console.error(response.error);
    return response;
  };

  static handleOperationWithErrorOnly = async <T>(
    operation: () => Promise<Result<T>>,
    setResources?: (data: T) => void
  ): Promise<Result<T>> => {
    try {
      const response = await operation();
      if (response.success) {
        console.log(response.data);
        if (setResources) setResources(response.data as T);
      } else {
        throw new Error(response.error);
      }
      return response;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        console.error(error);
        return { success: false, error: error.message };
      } else {
        toast.error("An unknown error occurred");
        console.error("An unknown error occurred", error);
        return { success: false, error: "An unknown error occurred" };
      }
    }
  };

  static showErrorMessage = (message: string) => {
    toast.error(message);
  };

  static showSuccessMessage = (message: string) => {
    toast.success(message);
  };
}
