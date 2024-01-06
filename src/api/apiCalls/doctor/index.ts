import globalApiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import { AppointmentResp, Page } from "@/types/databaseModel";
import axios, { AxiosRequestConfig } from "axios";

export const fetchDoctorPagedAppointments = (config?: AxiosRequestConfig) => {
  return axios<Page<AppointmentResp>>({
    ...config,
    url: `${mainServer}/api/doctor/appointments`,
    method: "get",
    headers: {
      Authorization: globalApiCenter.token,
      ...config?.headers,
    },
  });
};

export type ValidateAppointmentRequest = {
  appointmentId: number | string;
  validation: boolean;
};
export const putValidateAppointment = (
  { appointmentId, validation }: ValidateAppointmentRequest,
  config?: AxiosRequestConfig
) => {
  return axios<Page<AppointmentResp>>({
    ...config,
    url: `${mainServer}/api/doctor/appointments/${appointmentId}/validate/${validation}`,
    method: "put",
    headers: {
      Authorization: globalApiCenter.token,
      ...config?.headers,
    },
  });
};
