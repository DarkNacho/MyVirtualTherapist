import { createContext, useContext, useState, ReactNode } from "react";
import { FhirResource } from "fhir/r4";

interface ResourceContextType<T extends FhirResource> {
  resource: T | undefined;
  setResource: (resource: T | undefined) => void;
}

const ResourceContext = createContext<
  ResourceContextType<FhirResource> | undefined
>(undefined);

export const ResourceProvider = ({ children }: { children: ReactNode }) => {
  const [resource, setResource] = useState<FhirResource | undefined>();

  return (
    <ResourceContext.Provider value={{ resource, setResource }}>
      {children}
    </ResourceContext.Provider>
  );
};

export const useResource = <T extends FhirResource>() => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error("useResource must be used within a ResourceProvider");
  }
  return context as unknown as ResourceContextType<T>;
};
