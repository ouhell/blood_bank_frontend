import apiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import {
  Account,
  AccountProfile,
  AppointmentResp,
  DemandResp,
  DonationResp,
  Hospital,
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

export const postDoctor = (config?: AxiosRequestConfig) => {
  return axios({
    method: "post",
    ...config,
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
    url: `${mainServer}/api/admin/accounts/doctor`,
  });
};
