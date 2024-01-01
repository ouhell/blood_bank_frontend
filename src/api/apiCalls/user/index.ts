import apiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import { Province } from "@/types/databaseModel";
import axios, { AxiosRequestConfig } from "axios";

export const fetchAllProvinces = (config?: AxiosRequestConfig) => {
  return axios<Province[]>({
    ...config,
    url: `${mainServer}/api/general/provinces`,
    method: "get",
    headers: {
      Authorization: "Bearer " + apiCenter.accessToken,
      ...config?.headers,
    },
  });
};
