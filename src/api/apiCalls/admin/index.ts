import apiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import {
  Account,
  AccountProfile,
  AppointmentResp,
  AppointmentSuggestion,
  DemandResp,
  DonationResp,
  Hospital,
  ModifyAccountData,
  Page,
} from "@/types/databaseModel";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const getPagedAccounts = (config?: AxiosRequestConfig) => {
  return axios<Page<AccountProfile>>({
    ...config,
    url: `${mainServer}/api/admin/accounts`,
    method: "get",
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};

export const getPagedDemands = (config?: AxiosRequestConfig) => {
  return axios<Page<DemandResp>>({
    ...config,
    url: `${mainServer}/api/admin/demands`,
    method: "get",
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};

export const getPagedDonations = (config?: AxiosRequestConfig) => {
  return axios<Page<DonationResp>>({
    ...config,
    url: `${mainServer}/api/admin/donations`,
    method: "get",
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};

export const modifyAccountProfile = (
  data: ModifyAccountData,
  config?: AxiosRequestConfig
) => {
  return axios<AccountProfile>({
    ...config,
    url: `${mainServer}/api/admin/accounts/${data.id}`,
    method: "put",
    data: data,
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};

export const getPagedAppointments = (config?: AxiosRequestConfig) => {
  return axios<Page<AppointmentResp>>({
    ...config,
    url: `${mainServer}/api/admin/appointments`,
    method: "get",
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};

export const getAllHospitals = (config?: AxiosRequestConfig) => {
  return axios<Hospital[]>({
    ...config,
    url: `${mainServer}/api/admin/hospitals`,
    method: "get",
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};
type SuggestionRequest = {
  type: string;
  id?: number;
};
export const getAppointmentSuggestion = (
  req: SuggestionRequest,
  config?: AxiosRequestConfig
) => {
  console.log("suggestion request", req);
  return axios<AppointmentSuggestion>({
    ...config,
    url: `${mainServer}/api/admin/appointments/suggestion`,
    method: "get",
    params: req,
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,

      ...config?.headers,
    },
  });
};

export const postDoctor = (config?: AxiosRequestConfig) => {
  return axios<AccountProfile>({
    method: "post",
    ...config,
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
    url: `${mainServer}/api/admin/accounts/doctor`,
  });
};

export const putCancelAppointment = (
  appointmentId: number,
  config?: AxiosRequestConfig
) => {
  return axios<AppointmentResp>({
    ...config,
    url: `${mainServer}/api/admin/appointments/${appointmentId}/cancel`,
    method: "put",
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};
