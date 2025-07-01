import { useState } from "react";
import { Practitioner, PractitionerRole } from "fhir/r4";
import { PractitionerFormData } from "../../../Models/Forms/PractitionerForm";
import PersonUtil from "../../../Services/Utils/PersonUtils";
import HandleResult from "../../../Utils/HandleResult";
import FhirResourceService from "../../../Services/FhirService";
import { useTranslation } from "react-i18next";
import { CacheUtils } from "../../../Utils/Cache";

export const usePractitionerForm = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
} = {}) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [practitionerFormData, setPractitionerFormData] = useState<
    PractitionerFormData | undefined
  >(undefined);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setActiveStep(0);
    setPractitionerFormData(undefined);
    setAvatar(null);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setAvatar(event.target.files[0]);
    }
  };

  const updatePractitioner = async (
    data: PractitionerFormData
  ): Promise<Result<Practitioner>> => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    const { practitioner } = await PersonUtil.PractitionerFormToPractitioner(
      data
    );

    if (!practitioner)
      return {
        success: false,
        error: t("practitionerPage.errorConvertingForm"),
      };

    const fhirService =
      FhirResourceService.getInstance<Practitioner>("Practitioner");
    const responseFhir = await fhirService.updateResource(practitioner);

    if (!responseFhir.success) return responseFhir;

    CacheUtils.clearCache();
    return responseFhir;
  };

  const handleEditClick = async (person: Practitioner) => {
    setIsEditing(true);
    setActiveStep(0);
    const practitionerRoleResult =
      await FhirResourceService.getInstance<PractitionerRole>(
        "PractitionerRole"
      ).getResources({ practitioner: person.id! });
    if (!practitionerRoleResult.success) {
      HandleResult.showErrorMessage(practitionerRoleResult.error);
      onError?.(practitionerRoleResult.error);
      return;
    }

    const formData = await PersonUtil.PractitionerToPractitionerForm(
      person,
      practitionerRoleResult.data[0] || {}
    );
    setPractitionerFormData(formData);

    if (formData.avatar) {
      setAvatar(formData.avatar);
    } else {
      setAvatar(null);
    }

    setOpen(true);
  };

  const submitForm = async (data: PractitionerFormData) => {
    try {
      setIsPosting(true);
      const mergedData = { ...practitionerFormData, ...data, avatar };
      setPractitionerFormData(mergedData);

      if (activeStep < 1) {
        setActiveStep((prev) => prev + 1);
      } else {
        const operation = isEditing
          ? () => updatePractitioner(mergedData)
          : () => postPractitioner(mergedData);

        const message = isEditing
          ? t("practitionerPage.practitionerUpdated")
          : t("practitionerPage.practitionerCreated");

        const response = await HandleResult.handleOperation(
          operation,
          message,
          t("practitionerPage.sending")
        );
        if (response.success) {
          setActiveStep((prev) => prev + 1);
          onSuccess?.();
        } else {
          onError?.(response.error);
        }
      }
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsPosting(false);
    }
  };

  const postPractitioner = async (
    data: PractitionerFormData
  ): Promise<Result<Practitioner>> => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    data.rut = rut;
    const { practitioner, practitionerRole } =
      await PersonUtil.PractitionerFormToPractitioner(data);

    if (!practitioner)
      return {
        success: false,
        error: t("practitionerPage.errorConvertingForm"),
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
      return { success: false, error: t("practitionerPage.userExists") };

    const fhirService =
      FhirResourceService.getInstance<Practitioner>("Practitioner");
    const responseFhir = await fhirService.sendResource(practitioner);
    if (!responseFhir.success) return responseFhir;

    const user = {
      email: data.email,
      rut: data.rut,
      phone_number: data.numeroTelefonico,
      name: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
      role: "Practitioner",
      fhir_id: responseFhir.data.id,
      secondaryRoles: data.role?.map((role) => role.code).join(","),
    };

    practitionerRole.practitioner = {
      reference: `Practitioner/${responseFhir.data.id}`,
    };

    const fhirServiceRole =
      FhirResourceService.getInstance<PractitionerRole>("PractitionerRole");
    const responseFhirRole = await fhirServiceRole.sendResource(
      practitionerRole
    );
    if (!responseFhirRole.success) return responseFhir;

    url = `${import.meta.env.VITE_SERVER_URL}/auth/register`;
    response_api = await fetch(url, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response_api.status === 409)
      return { success: false, error: t("practitionerPage.userExists") };
    if (response_api.status !== 201)
      return { success: false, error: response_api.statusText };

    CacheUtils.clearCache();
    return responseFhir;
  };

  return {
    open,
    setOpen,
    activeStep,
    setActiveStep,
    avatar,
    setAvatar,
    isPosting,
    isEditing,
    practitionerFormData,
    setPractitionerFormData,
    handleOpen,
    handleClose,
    handleAvatarChange,
    handleEditClick,
    submitForm,
  };
};
