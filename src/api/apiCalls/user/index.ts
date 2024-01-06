import apiCenter from "@/api/apiCenter";
import { mainServer } from "@/api/apiConfig";
import { AccountProfile, Province, UserRole } from "@/types/databaseModel";
import axios, { AxiosRequestConfig } from "axios";

export const fetchAllProvinces = (config?: AxiosRequestConfig) => {
  return axios<Province[]>({
    ...config,
    url: `${mainServer}/api/general/provinces`,
    method: "get",
    headers: {
      Authorization: apiCenter.token,
      ...config?.headers,
    },
  });
};

export const fetchAccountProfile = (
  userId: number | string,
  config?: AxiosRequestConfig
) => {
  return axios<AccountProfile>({
    ...config,
    url: `${mainServer}/api/general/profile/${userId}`,
    method: "get",
    headers: {
      Authorization: apiCenter.token,
      ...config?.headers,
    },
  });
};

export const postSignUp = (config?: AxiosRequestConfig) => {
  return axios<AccountProfile>({
    ...config,

    method: "post",

    url: `${mainServer}/api/general/sign-up`,
  });
};

export type LoginData = {
  username: string;
  password: string;
};

export type LoginResp = {
  token: string;
  role: UserRole;
};
export const postLogin = (data: LoginData, config?: AxiosRequestConfig) => {
  return axios<LoginResp>({
    ...config,
    method: "post",

    url: `${mainServer}/login`,
    data,
  });
};
