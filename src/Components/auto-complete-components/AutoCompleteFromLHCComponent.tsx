import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { ValueSet, Coding } from "fhir/r4";
import { useDebounce } from "use-debounce";

interface AutoCompleteFromLHCComponentProps {
  label: string;
  onChange: (value: Coding | null) => void;
  table: string;
  defaultResource?: Coding;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
}

export default function AutoCompleteFromLHCComponentComponent({
  label,
  table,
  defaultResource,
  textFieldProps,
  readOnly,
  onChange,
}: AutoCompleteFromLHCComponentProps) {
  const [dataSet, setDataSet] = useState<Coding[]>([] as Coding[]);
  const [loading, setLoading] = useState<boolean>(true);
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

      if (
        defaultResource &&
        !dataSet.find((option) => option.id === defaultResource.id)
      )
        data.push(defaultResource);
      setDataSet(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined && debouncedSearchTerm !== "") {
      fetchData();
    }
    //fetchDataAndDefaultResource();
  }, [debouncedSearchTerm]);

  //if (defaultResourceId && !defaultResource) return <div>Loading...</div>;

  console.log("default:", defaultResource);
  return (
    <Autocomplete
      id={`${label}-Autocomplete`}
      defaultValue={defaultResource}
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) =>
        `${option.code} - ${option.display || option.system}`
      }
      isOptionEqualToValue={(option, value) => option.code === value.code}
      //onInputChange={(_, newInputValue) => fetchData(newInputValue)}
      onInputChange={(_, newInputValue) => setSearchTerm(newInputValue)}
      readOnly={readOnly}
      onChange={(_, newValue) => {
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
