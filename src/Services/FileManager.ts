import { DocumentReference, Reference } from "fhir/r4";
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

  static base64ToFile(
    base64: string,
    fileName: string,
    mimeType: string
  ): File {
    const byteString = atob(base64);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], fileName, { type: mimeType });
  }

  static async fileToHash(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    // Convierte el ArrayBuffer a base64
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashString = hashArray.map((b) => String.fromCharCode(b)).join("");
    return btoa(hashString);
  }

  static async base64ToHash(base64: string): Promise<string> {
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes.buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashString = hashArray.map((b) => String.fromCharCode(b)).join("");
    return btoa(hashString);
  }

  static async uploadFilesAsDocumentReference(
    id: string | undefined,
    files: File[] | FileList,
    subject?: Reference,
    author?: Reference,
    encounter?: Reference
  ): Promise<Result<DocumentReference>> {
    const filesArray = Array.from(files);

    const contents = await Promise.all(
      filesArray.map(async (file) => {
        const data = await this.fileToBase64(file);
        return {
          attachment: {
            contentType: file.type,
            data: data,
            size: file.size,
            title: file.name,
            hash: await this.base64ToHash(data),
          },
          context: {
            encounter: encounter ? [encounter] : [],
          },
        };
      })
    );

    const documentReference: DocumentReference = {
      resourceType: "DocumentReference",
      id: id,
      status: "current",
      date: new Date().toISOString(),
      author: author ? [author] : [],
      subject: subject,
      content: contents,
    };

    const documentReferenceService =
      FhirResourceService.getInstance<DocumentReference>("DocumentReference");
    return documentReferenceService.sendResource(documentReference);
  }

  static documentReferenceToFiles(
    documentReference: DocumentReference
  ): FileList {
    const files: File[] = [];

    if (!documentReference.content) return new DataTransfer().files;

    documentReference.content.forEach((entry) => {
      const attachment = entry.attachment;
      if (
        attachment &&
        attachment.data &&
        attachment.title &&
        attachment.contentType
      ) {
        const file = this.base64ToFile(
          attachment.data,
          attachment.title,
          attachment.contentType
        );
        files.push(file);
      }
    });

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  }
}
