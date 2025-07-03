import { useState } from "react";
import { Patient } from "fhir/r4";
import { PatientFormData } from "../../../Models/Forms/PatientForm";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import { CacheUtils } from "../../../Utils/Cache";
import { useTranslation } from "react-i18next";

export function usePatientForm(selectedPatientProp?: Patient) {
  const { t } = useTranslation();

  const [openCreate, setOpenCreate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(
    selectedPatientProp
  );
  const [patientFormData, setPatientFormData] = useState<PatientFormData>(
    {} as PatientFormData
  );

  const handleOpenCreate = () => {
    setIsEditing(false);
    setSelectedPatient(undefined);
    setActiveStep(0);
    setAvatar(null);
    setPatientFormData({} as PatientFormData);
    setOpenCreate(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setIsEditing(false);
    setSelectedPatient(undefined);
    setActiveStep(0);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > MAX_IMAGE_SIZE) {
        HandleResult.showInfoMessage(
          "La imagen es demasiado grande. El tamaño máximo es 2MB."
        );
        event.target.value = "";
        return;
      }
      setAvatar(file);
    }
  };

  const handleSetActiveStep = (step: number) => {
    setActiveStep(step);
  };

  const updatePatient = async (
    data: PatientFormData
  ): Promise<Result<Patient>> => {
    if (!selectedPatient || !selectedPatient.id) {
      return {
        success: false,
        error: t("patientPage.noPatientSelected"),
      };
    }

    data.id = selectedPatient.id;
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;

    const patient = await PersonUtil.PatientFormToPatient(data);
    if (!patient) {
      return {
        success: false,
        error: t("patientPage.errorConvertingForm"),
      };
    }

    if (
      selectedPatient.generalPractitioner &&
      selectedPatient.generalPractitioner.length > 0
    ) {
      patient.generalPractitioner = selectedPatient.generalPractitioner;
    } else {
      patient.generalPractitioner = [
        { reference: `Practitioner/${localStorage.getItem("id")}` },
      ];
    }

    const fhirService = FhirResourceService.getInstance<Patient>("Patient");
    const responseFhir = await fhirService.updateResource(patient);

    if (!responseFhir.success) return responseFhir;

    CacheUtils.clearCache();
    return responseFhir;
  };

  const postPatient = async (
    data: PatientFormData
  ): Promise<Result<Patient>> => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    const patient = await PersonUtil.PatientFormToPatient(data);

    patient.generalPractitioner = [
      { reference: `Practitioner/${localStorage.getItem("id")}` },
    ];

    if (!patient)
      return {
        success: false,
        error: t("patientPage.errorConvertingForm"),
      };

    let url = `${import.meta.env.VITE_SERVER_URL}/auth/find?rut=${data.rut}`;
    let response_api = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    const dataRes = await response_api.json();

    if (dataRes.data)
      return { success: false, error: t("patientPage.userExists") };

    const fhirService = FhirResourceService.getInstance<Patient>("Patient");
    const responseFhir = await fhirService.sendResource(patient);
    if (!responseFhir.success) return responseFhir;

    const user = {
      email: data.email,
      rut: data.rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      role: "Patient",
      fhir_id: responseFhir.data.id,
    };
    data.id = responseFhir.data.id;

    url = `${import.meta.env.VITE_SERVER_URL}/auth/register`;

    response_api = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(user),
    });

    if (response_api.status !== 201) {
      await fhirService.deleteResource(responseFhir.data.id!);
      return { success: false, error: response_api.statusText };
    }
    CacheUtils.clearCache();
    return responseFhir;
  };

  const submitForm = async (data: PatientFormData) => {
    try {
      setIsPosting(true);
      const newFormData = { ...patientFormData, ...data };
      if (avatar) {
        newFormData.avatar = avatar;
      }
      setPatientFormData(newFormData);

      if (activeStep < 2) {
        setActiveStep((prev) => prev + 1);
      } else {
        const operation = isEditing
          ? () => updatePatient(newFormData)
          : () => postPatient(newFormData);

        const message = isEditing
          ? t("patientPage.patientUpdated")
          : t("patientPage.patientCreated");

        const response = await HandleResult.handleOperation(
          operation,
          message,
          t("patientPage.sending")
        );

        if (response.success) setActiveStep((prev) => prev + 1);
        else setActiveStep(0);
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsPosting(false);
    }
  };

  const handleEditPatient = async (person: Patient) => {
    try {
      setIsEditing(true);
      setSelectedPatient(person);
      setActiveStep(0);

      const formData = await PersonUtil.PatientToPatientForm(person);
      setPatientFormData(formData);
      setOpenCreate(true);

      if (formData.avatar) {
        setAvatar(formData.avatar);
      } else {
        setAvatar(null);
      }
    } catch (error) {
      console.error("Error preparing patient for edit:", error);
    }
  };

  return {
    openCreate,
    isEditing,
    activeStep,
    avatar,
    isPosting,
    selectedPatient,
    patientFormData,
    handleOpenCreate,
    handleClose,
    handleAvatarChange,
    handleSetActiveStep,
    submitForm,
    handleEditPatient,
  };
}
