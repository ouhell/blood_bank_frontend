export type Sort = {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
};

export type Pageable = {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
};

export type Page<T> = {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  numberOfElements: number;
  empty: boolean;
  sort: Sort;
};
export type BloodGroup =
  | "AB_PLUS"
  | "AB_MINUS"
  | "A_PLUS"
  | "A_MINUS"
  | "B_PLUS"
  | "B_MINUS"
  | "O_PLUS"
  | "O_MINUS";

export type UserRole = "ADMIN" | "DONOR" | "DOCTOR" | "RECEIVER";

export type Province = {
  id: number;
  name: string;
  number: number;
  districts: District_Inner[];
};

export type District = {
  id: number;
  name: string;
  provinceId: number;
  province: Province;
};

export type District_Inner = Omit<District, "province">;

export type Hospital = {
  id: number;
  name: string;
  districtId: number;
  district: District_Inner;
  mapHash?: string | null;
};

export type AccountProfile = {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  districtId: number;
  district?: District_Inner;
  bloodGroup: BloodGroup;
  hospitalId?: number;
  hospital?: Hospital;
  profilePicUrl: string;
  isNonLocked: boolean;
  isEnabled: boolean;
};

export type DemandStatus =
  | "PENDING_TRANSFUSION"
  | "PENDING_CONSULTATION"
  | "PENDING_RESULTS"
  | "AWAITING_TRANSFUSION"
  | "AWAITING_CONSULTATION"
  | "REJECTED"
  | "SERVED";

export type DemandResp = {
  id: number;
  receiverId: number;
  receiver: AccountProfile;
  quantity: number;
  date: string;
  reason: string;
  readIt: boolean;
  status: DemandStatus;
};
