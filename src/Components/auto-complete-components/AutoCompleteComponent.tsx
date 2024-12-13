import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FhirResourceService from "../../Services/FhirService";
import FhirType from "../../Services/Utils/Fhirtypes";
import { FhirResource } from "fhir/r4";
import { SearchParams } from "fhir-kit-client";
import { useDebounce } from "use-debounce";

interface AutoCompleteComponentProps<T extends FhirResource> {
  resourceType: FhirType;
  label: string;
  getDisplay: (value: T) => string;
  onChange: (value: T | null) => void;
  defaultResourceId?: string;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
  searchParam: string;
  defaultParams?: SearchParams;
}

export default function AutoCompleteComponent<T extends FhirResource>({
  resourceType,
  label,
  textFieldProps,
  readOnly,
  defaultResourceId,
  getDisplay,
  searchParam,
  defaultParams,
  onChange,
}: AutoCompleteComponentProps<T>) {
  const [dataSet, setDataSet] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [defaultResource, setDefaultResource] = useState<T>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  //const fhirService = new FhirResourceService<T>(resourceType);
  const fhirService = FhirResourceService.getInstance<T>(resourceType);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stringJson = `{"${searchParam}": "${searchTerm}"}`;
      const param = JSON.parse(stringJson);
      const finalParams =
        searchParam.length > 1 ? { ...defaultParams, ...param } : defaultParams;

      const result = await fhirService.getResources(finalParams);

      if (!result.success) throw new Error(result.error);

      console.log("Result for autocomplete ", resourceType, result.data);
      if (
        defaultResource &&
        !dataSet.find((option) => option.id === defaultResource.id)
      )
        result.data.push(defaultResource);
      setDataSet(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultResource = async () => {
    if (!defaultResourceId) return;
    //if (resourceType === "Practitioner" && isAdmin()) return;
    try {
      const result = await fhirService.getById(defaultResourceId);

      if (!result.success) throw new Error(result.error);
      console.log("default resource autocomplete: ", resourceType, result.data);

      setDefaultResource(result.data);
      onChange(result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchDataAndDefaultResource = async () => {
      await fetchDefaultResource();
      fetchData();
    };

    fetchDataAndDefaultResource();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined && debouncedSearchTerm !== "") {
      fetchData();
    }
  }, [debouncedSearchTerm]);

  if (defaultResourceId && !defaultResource) return <div>Loading auto...</div>;

  return (
    <Autocomplete
      id={`${resourceType}-${label}-Autocomplete`}
      defaultValue={defaultResource}
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) => getDisplay(option)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      //onInputChange={(_, newInputValue) => fetchData(newInputValue)}
      onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
      readOnly={readOnly}
      onChange={(_, newValue) => onChange(newValue)}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {getDisplay(option)}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          variant="outlined"
          {...textFieldProps}
        />
      )}
    />
  );
}
