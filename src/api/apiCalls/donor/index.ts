import globalApiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import { AppointmentResp, DonationResp, Page } from "@/types/databaseModel";
import axios, { AxiosRequestConfig } from "axios";

export const fetchDonorPagedDonations = (config?: AxiosRequestConfig) => {
  return axios<Page<DonationResp>>({
    ...config,
    url: `${mainServer}/api/donor/donations`,
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const fetchDonorCoursingDonation = (config?: AxiosRequestConfig) => {
  return axios<DonationResp | "">({
    ...config,
    url: `${mainServer}/api/donor/donations-coursing`,
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const fetchDonorCoursingAppointment = (config?: AxiosRequestConfig) => {
  return axios<AppointmentResp | "">({
    ...config,
    url: `${mainServer}/api/donor/appointments/latest`,
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const putDonorRejectDonation = (
  donationId: number | string,
  config?: AxiosRequestConfig
) => {
  return axios<DonationResp>({
    ...config,
    url: `${mainServer}/api/donor/donations/${donationId}/reject`,
    method: "put",
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};

export const postDonation = (quantity: number, config?: AxiosRequestConfig) => {
  return axios<DonationResp>({
    ...config,
    url: `${mainServer}/api/donor/donations`,
    method: "post",
    data: {
      quantity,
    },
    headers: {
      Authorization: globalApiCenter.token,
    },
  });
};
