import { useEffect, useState } from "react";
import { useResource } from "./ResourceContext";
import { FhirResource } from "fhir/r4";

export function useResourceHook<T extends FhirResource>(resourceId?: string) {
  const { resource, setResource } = useResource<T>();
  const [effectiveResourceId, setEffectiveResourceId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const id = resourceId || resource?.id;
    console.log("useResourceHook - resourceType:", resource?.resourceType);
    console.log("useResourceHook - resourceId:", resourceId);
    console.log("useResourceHook - resource?.id:", resource?.id);
    console.log("useResourceHook - effectiveResourceId:", id);
    if (id) {
      setEffectiveResourceId(id);
    }
  }, [resourceId, resource]);

  return { resource, setResource, effectiveResourceId };
}
