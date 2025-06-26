import { Attachment, Binary, DocumentReference, Reference } from "fhir/r4";
import FhirResourceService from "./FhirService";

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
    const file = new File([blob], attachment.title || "attachment", {
      type: attachment.contentType,
    });

    return file;
  };

  static async uploadFileAsBinary(
    file: File,
    securityContext?: Reference
  ): Promise<Binary> {
    const fileContent = await this.fileToBase64(file);
    const binary: Binary = {
      resourceType: "Binary",
      contentType: file.type,
      data: fileContent,
      securityContext: securityContext,
    };

    const binaryService = FhirResourceService.getInstance<Binary>("Binary");
    const result = await binaryService.postResource(binary);

    if (!result.success) {
      throw new Error(`Failed to upload Binary: ${result.error}`);
    }

    return result.data;
  }

  static async uploadFileAsDocumentReference(
    file: File,
    securityContext?: Reference
  ): Promise<DocumentReference> {
    // Step 1: Upload the file as a Binary resource
    const binary = await this.uploadFileAsBinary(file, securityContext);

    // Step 2: Create a DocumentReference resource linked to the Binary
    const documentReference: DocumentReference = {
      resourceType: "DocumentReference",
      status: "current",
      date: new Date().toISOString(),
      content: [
        {
          attachment: {
            contentType: binary.contentType,
            url: `Binary/${binary.id}`, // Reference to the Binary resource
            size: file.size,
            title: file.name,
          },
        },
      ],
    };

    const documentReferenceService =
      FhirResourceService.getInstance<DocumentReference>("DocumentReference");
    const result = await documentReferenceService.postResource(
      documentReference
    );

    if (!result.success) {
      throw new Error(`Failed to upload DocumentReference: ${result.error}`);
    }

    return result.data;
  }

  static async getFileFromBinary(binaryId: string): Promise<File> {
    const binaryService = FhirResourceService.getInstance<Binary>("Binary");
    const result = await binaryService.getById(binaryId);

    if (!result.success) {
      throw new Error(`Failed to retrieve Binary: ${result.error}`);
    }

    const binary = result.data;
    if (!binary.data || !binary.contentType) {
      throw new Error("Binary resource is missing data or contentType");
    }

    const file = this.attachmentToFile({
      contentType: binary.contentType,
      data: binary.data,
      title: "retrieved-file",
    });

    if (!file) {
      throw new Error("Failed to convert Binary to File");
    }

    return file;
  }

  static async getDocumentReference(
    documentReferenceId: string
  ): Promise<DocumentReference> {
    const documentReferenceService =
      FhirResourceService.getInstance<DocumentReference>("DocumentReference");
    const result = await documentReferenceService.getById(documentReferenceId);

    if (!result.success) {
      throw new Error(`Failed to retrieve DocumentReference: ${result.error}`);
    }

    return result.data;
  }
}
