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

  static showErrorMessage = (message: string) => {
    toast.error(message);
  };

  static showSuccessMessage = (message: string) => {
    toast.success(message);
  };
}
