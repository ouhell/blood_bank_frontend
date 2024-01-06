import globalApiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import { AppointmentResp, DemandResp, Page } from "@/types/databaseModel";
import axios, { AxiosRequestConfig } from "axios";

export const fetchReceiverPagedDemands = (config?: AxiosRequestConfig) => {
  return axios<Page<DemandResp>>({
    ...config,
    url: `${mainServer}/api/receiver/demands`,
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const fetchReceiverCoursingDemand = (config?: AxiosRequestConfig) => {
  return axios<DemandResp | "">({
    ...config,
    url: `${mainServer}/api/receiver/demands-coursing`,
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const fetchReceiverCoursingAppointment = (
  config?: AxiosRequestConfig
) => {
  return axios<AppointmentResp | "">({
    ...config,
    url: `${mainServer}/api/receiver/appointments/latest`,
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const putReceiverRejectDemand = (
  demandId: number | string,
  config?: AxiosRequestConfig
) => {
  return axios<DemandResp>({
    ...config,
    url: `${mainServer}/api/receiver/demands/${demandId}/reject`,
    method: "put",
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const postDemand = (quantity: number, config?: AxiosRequestConfig) => {
  return axios<DemandResp>({
    ...config,
    url: `${mainServer}/api/receiver/demands`,
    method: "post",
    data: {
      quantity,
    },
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};
