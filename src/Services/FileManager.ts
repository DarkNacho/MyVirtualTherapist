import { Attachment, Binary, DocumentReference, Reference } from "fhir/r4";

export default class FileManager {
  static fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          resolve(reader.result.toString().split(",")[1]);
        } else {
          reject(new Error("File reading failed"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  static attachmentToFile = (attachment: Attachment): File | undefined => {
    if (!attachment || !attachment.data) {
      return undefined;
    }

    const byteString = atob(attachment.data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([uint8Array], { type: attachment.contentType });
    const file = new File([blob], "attachment", {
      type: attachment.contentType,
    });

    return file;
  };

  static fileToBinary = async (
    file: File,
    securityContext?: Reference
  ): Promise<Binary> => {
    const fileContent = await this.fileToBase64(file);
    return {
      resourceType: "Binary",
      contentType: file.type,
      data: fileContent,
      securityContext: securityContext,
    };
  };

  static async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""); // convert bytes to hex string
    return btoa(hashHex);
  }

  static fileToDocumentReference = async (
    file: File
  ): Promise<DocumentReference> => {
    const binary = await this.fileToBinary(file);
    return {
      resourceType: "DocumentReference",
      status: "current",
      date: new Date().toISOString(),
      content: [
        {
          attachment: {
            contentType: binary.contentType,
            data: binary.data,
            size: file.size,
            hash: await this.calculateFileHash(file),
            title: file.name,
          },
        },
      ],
    };
  };
}
