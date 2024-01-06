import { UserRole } from "@/types/databaseModel";
import React from "react";

export type ApiCenter = {
  role?: UserRole;
  token?: string;
};

export type SetApiCenterFunction = (
  func: (oldApiCenter: ApiCenter) => ApiCenter
) => void;

// const admintoken =
//   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpYXQiOjE3MDM2MDE0NDgsImV4cCI6MTcwNDc1NDgwMH0.PyAfL-BLpKwVp_E8rinehHDoTbqKZikWDa0cKcYVigQ_n6btNCWwDfzcZzH2tzMj4khA2aMPkBuN765g6g9jYA";
// const doctor1token =
//   "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkb2N0b3IxQGdtYWlsLmNvbSIsInVzZXJJZCI6OCwiYXV0aG9yaXRpZXMiOlt7ImF1dGhvcml0eSI6IlJPTEVfRE9DVE9SIn1dLCJpYXQiOjE3MDQ0NjQwNjksImV4cCI6MTcwNTYxODgwMH0.83WyaH8SA2QEDqBRfmMoE-UJHriqd4z7qeDMsEMqlUshcFG6JcQlGoTk8MYXZZRNrQdZG5h4aSO0wwRBUkQPfw";
const stringStoredCenter = localStorage.getItem("apiCenter");
const storedCenter = stringStoredCenter
  ? (JSON.parse(stringStoredCenter) as ApiCenter)
  : null;
const globalApiCenter: ApiCenter = storedCenter || {};

export const engraveApiCenter = () => {
  localStorage.setItem("apiCenter", JSON.stringify(globalApiCenter));
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
      engraveApiCenter();
      updateDataList.forEach((data) => data.updater());
    },
  ];
};

export default globalApiCenter;
