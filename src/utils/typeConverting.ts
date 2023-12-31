import { BloodGroup } from "@/types/databaseModel";

export type ParsedBloodGroup =
  | "AB+"
  | "AB-"
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "O+"
  | "O-";

export const bloodGroupParseMap = new Map<BloodGroup, ParsedBloodGroup>([
  ["AB_PLUS", "AB+"],
  ["AB_MINUS", "AB-"],
  ["A_PLUS", "A+"],
  ["A_MINUS", "A-"],
  ["B_PLUS", "B+"],
  ["B_MINUS", "B-"],
  ["O_PLUS", "O+"],
  ["O_MINUS", "O-"],
]);

export const bloodGroupUnparseMap = new Map<ParsedBloodGroup, BloodGroup>([
  ["AB+", "AB_PLUS"],
  ["AB-", "AB_MINUS"],
  ["A+", "A_PLUS"],
  ["A-", "A_MINUS"],
  ["B+", "B_PLUS"],
  ["B-", "B_MINUS"],
  ["O+", "O_PLUS"],
  ["O-", "O_MINUS"],
]);

export const parseBloodGroup = (group: BloodGroup): ParsedBloodGroup => {
  return bloodGroupParseMap.get(group) as ParsedBloodGroup;
};

export const unparseBloodGroup = (group: ParsedBloodGroup): BloodGroup => {
  return bloodGroupUnparseMap.get(group) as BloodGroup;
};

export const parseStatus = (status: string | undefined) => {
  return status?.toLocaleLowerCase().replace("_", " ");
};
