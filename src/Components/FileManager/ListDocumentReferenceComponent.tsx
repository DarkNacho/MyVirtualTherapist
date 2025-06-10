import { useEffect, useState } from "react";
import FhirResourceService from "../../Services/FhirService";
import { DocumentReference, Binary } from "fhir/r4";
import { Button, Card, CardContent, Typography } from "@mui/material";

function base64StringDataToBlob(base64String: string, type: string) {
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}

export default function ListDocumentReferenceComponent() {
  const [documentReferences, setDocumentReferences] = useState<
    DocumentReference[]
  >([]);

  useEffect(() => {
    fetchDocumentReferences();
  }, []);

  const fetchDocumentReferences = async () => {
    const service =
      FhirResourceService.getInstance<DocumentReference>("DocumentReference");
    const response = await service.getResources({ _count: 10 });
    if (response.success) {
      console.log(response.data);
      setDocumentReferences(response.data);
    } else {
      console.error(response.error);
    }
  };

  const fetchBinary = async (url: string) => {
    const service = FhirResourceService.getInstance<Binary>("Binary");
    const response = await service.getById(url.split("/")[1]);
    console.log(url);
    console.log(response);
    if (response.success) {
      const blob = base64StringDataToBlob(
        response.data.data!,
        response.data.contentType
      );
      window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");

      // Display the binary data in a suitable way depending on its content type
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  const getFile = async (document: DocumentReference) => {
    if (document.content && document.content[0].attachment) {
      if (document.content[0].attachment.url) {
        fetchBinary(document.content[0].attachment.url);
      } else if (document.content[0].attachment.data) {
        const blob = base64StringDataToBlob(
          document.content[0].attachment.data,
          document.content[0].attachment.contentType!
        );
        window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
      } else {
        alert("No URL or data in the attachment");
      }
    }
  };

  return (
    <div>
      {documentReferences.map((docRef, index) => (
        <Card key={index}>
          <CardContent>
            <Typography variant="h5" component="div">
              {docRef.content[0].attachment.title}
            </Typography>
            <Button variant="contained" onClick={() => getFile(docRef)}>
              Preview
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
