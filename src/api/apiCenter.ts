import { UserRole } from "@/types/databaseModel";
import React from "react";

export type ApiCenter = {
  role?: UserRole;
  accessToken?: string;
};

export type SetApiCenterFunction = (
  func: (oldApiCenter: ApiCenter) => ApiCenter
) => void;

const globalApiCenter: ApiCenter = {
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpYXQiOjE3MDM2MDE0NDgsImV4cCI6MTcwNDc1NDgwMH0.PyAfL-BLpKwVp_E8rinehHDoTbqKZikWDa0cKcYVigQ_n6btNCWwDfzcZzH2tzMj4khA2aMPkBuN765g6g9jYA",
  role: "ADMIN",
};

type updateData = {
  id: string;
  updater: () => void;
};

const updateDataList: updateData[] = [];

export const useApiCenter = (): [ApiCenter, SetApiCenterFunction] => {
  const [localApiCenter, setLocalApiCenter] = React.useState<ApiCenter>({
    ...globalApiCenter,
  });

  React.useEffect(() => {
    const generatedId = (Math.random() + 1).toString(36).substring(7);
    updateDataList.push({
      id: generatedId,
      updater: () => {
        setLocalApiCenter({ ...globalApiCenter });
      },
    });
    return () => {
      const index = updateDataList.findIndex((data) => data.id === generatedId);
      if (index >= 0) {
        updateDataList.splice(index, 1);
      }
    };
  }, []);
  return [
    localApiCenter,
    (setter) => {
      const newGlobalApiCenter = setter({ ...globalApiCenter });
      Object.assign(globalApiCenter, newGlobalApiCenter);

      updateDataList.forEach((data) => data.updater());
    },
  ];
};

export default globalApiCenter;
