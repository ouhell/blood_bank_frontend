import { UserRole } from "@/types/databaseModel";

export type ApiCenter = {
  role?: UserRole;
  accessToken?: string;
};

const apiCenter: ApiCenter = {
  accessToken:
    "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c2VySWQiOjEsImF1dGhvcml0aWVzIjpbeyJhdXRob3JpdHkiOiJST0xFX0FETUlOIn1dLCJpYXQiOjE3MDM2MDE0NDgsImV4cCI6MTcwNDc1NDgwMH0.PyAfL-BLpKwVp_E8rinehHDoTbqKZikWDa0cKcYVigQ_n6btNCWwDfzcZzH2tzMj4khA2aMPkBuN765g6g9jYA",
};

export default apiCenter;
