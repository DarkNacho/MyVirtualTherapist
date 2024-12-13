import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FhirResourceService from "../../Services/FhirService";
import FhirType from "../../Services/Utils/Fhirtypes";
import { FhirResource } from "fhir/r4";
import { SearchParams } from "fhir-kit-client";
import { useDebounce } from "use-debounce";
interface MultipleAutoCompleteComponentProps<T extends FhirResource> {
  resourceType: FhirType;
  label: string;
  getDisplay: (value: T) => string;
  onChange: (value: T[] | null) => void;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
  searchParam: string;
  defaultParams?: SearchParams;
  defaultValues?: T[];
}

export default function MultipleAutoCompleteComponent<T extends FhirResource>({
  resourceType,
  label,
  textFieldProps,
  readOnly,
  getDisplay,
  searchParam,
  defaultParams,
  onChange,
  defaultValues,
}: MultipleAutoCompleteComponentProps<T>) {
  const [dataSet, setDataSet] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedResources, setSelectedResources] = useState<T[]>(
    defaultValues || []
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  //const fhirService = new FhirResourceService<T>(resourceType);
  const fhirService = FhirResourceService.getInstance<T>(resourceType);

  const fetchData = async () => {
    setLoading(true);
    try {
      const stringJson = `{"${searchParam}": "${searchTerm}"}`;
      const param = JSON.parse(stringJson);

      console.log("param:", param);
      console.log("defaultParams:", defaultParams);

      let params = { ...defaultParams, _count: 30 };
      if (searchTerm) params = { ...defaultParams, ...param };
      console.log("params:", params);

      const result = await fhirService.getResources(params);

      if (!result.success) throw new Error(result.error);

      const notInSelectedResources = selectedResources.filter(
        (resource) => !result.data.some((data) => data.id === resource.id)
      );
      setDataSet([...notInSelectedResources, ...result.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    //fetchDataAndDefaultResource();
  }, [selectedResources]);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined && debouncedSearchTerm !== "") {
      fetchData();
    }
  }, [debouncedSearchTerm]);

  //if (defaultResourceId && !defaultResource) return <div>Loading...</div>;

  console.log("set:", dataSet);
  console.log("selected:", selectedResources);
  return (
    <Autocomplete
      id={`${resourceType}-${label}-Autocomplete`}
      multiple
      value={selectedResources}
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) => getDisplay(option)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
      //onInputChange={(_, newInputValue) => fetchData(newInputValue)}
      readOnly={readOnly}
      onChange={(_, newValue) => {
        setSelectedResources(newValue);
        onChange(newValue);
      }}
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
