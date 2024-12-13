import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { ValueSet, Coding } from "fhir/r4";
import { useDebounce } from "use-debounce";

interface MultipleFromLHCAutoCompleteComponentProps {
  label: string;
  onChange: (value: Coding[] | null) => void;
  table: string;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
}

export default function MultipleFromLHCAutoCompleteComponent({
  label,
  table,
  textFieldProps,
  readOnly,
  onChange,
}: MultipleFromLHCAutoCompleteComponentProps) {
  const [dataSet, setDataSet] = useState<Coding[]>([] as Coding[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedResources, setSelectedResources] = useState<Coding[]>(
    [] as Coding[]
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/fhir/R4/ValueSet/${table}/$expand?_format=json&count=10&filter=${searchTerm}`
      );
      const result = (await response.json()) as ValueSet;
      console.log(result);
      const data = result.expansion?.contains || [];

      const notInSelectedResources = selectedResources.filter(
        (resource) => !data.some((data) => data.id === resource.id)
      );
      setDataSet([...notInSelectedResources, ...data]);
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
  return (
    <Autocomplete
      id={`${label}-Autocomplete`}
      multiple
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) => `${option.code} - ${option.display}`}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      //onInputChange={(_, newInputValue) => fetchData(newInputValue)}
      onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
      readOnly={readOnly}
      onChange={(_, newValue) => {
        setSelectedResources(newValue);
        onChange(newValue);
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.code}>
          {`${option.code} - ${option.display}`}
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
