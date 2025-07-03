/* eslint-disable @typescript-eslint/no-explicit-any */
import toast from "react-hot-toast";
import React from "react";

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

  static handleOperationWithErrorOnly = async <T,>(
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
  static showInfoMessage = (message: string) => {
    toast(message);
  };
  static confirm = (
    message: string,
    title = "Confirmación"
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      toast.custom(
        (t) => (
          <div
            style={{
              backgroundColor: "white",
              color: "#1B2455",
              padding: "16px",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              border: "1px solid #e0e0e0",
              opacity: t.visible ? 1 : 0,
              transition: "opacity 300ms",
            }}
          >
            <h4 style={{ margin: 0, fontWeight: 600 }}>{title}</h4>
            <p style={{ margin: 0 }}>{message}</p>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(false);
                }}
                style={{
                  border: "1px solid #ccc",
                  background: "transparent",
                  color: "#555",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  resolve(true);
                }}
                style={{
                  border: "none",
                  background: "#1B2455",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Aceptar
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity, // El toast no se cerrará hasta que el usuario interactúe
          position: "top-center",
        }
      );
    });
  };
}
