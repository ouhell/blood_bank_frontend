import apiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import { AccountProfile, DemandResp, Page } from "@/types/databaseModel";
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
