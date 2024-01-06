import { fetchAllProvinces, postSignUp } from "@/api/apiCalls/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Account,
  AccountProfile,
  BloodGroup,
  Province,
  UserRole,
} from "@/types/databaseModel";
import { bloodGroupParseMap } from "@/utils/typeConverting";

import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [province, setProvince] = React.useState<Province | null>(null);
  const [districtId, setDistrictId] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [role, setRole] = React.useState("DONOR");
  const { data: provinces, isLoading: isLoadingProvinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => {
      return fetchAllProvinces();
    },
    select: (res) =>
      res.data.sort((a, b) => {
        return a.number - b.number;
      }),
  });

  const { mutateAsync: signUp } = useMutation<
    AccountProfile,
    AxiosError,
    Account
  >({
    mutationFn: (account) =>
      postSignUp({
        data: account,
      }).then((res) => res.data),
  });

  const isFormValid =
    !!districtId &&
    !!role &&
    !!password &&
    !!bloodGroup &&
    !!email &&
    !!fullName;
  return (
    <div className="page ">
      <div className="p-8  flex justify-center items-center ">
        <form
          className="border p-8 w-[40rem] flex flex-col gap-8 mt-4 max-w-full rounded-sm"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="flex justify-center">
            <h3 className="text-3xl font-bold">SignUp</h3>
          </div>
          <div className="flex justify-between gap-4">
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="flex justify-between gap-4">
            <Select
              disabled={isLoadingProvinces || !province}
              value={districtId}
              onValueChange={(value) => {
                setDistrictId(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a District" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {province?.districts.map((district) => {
                    return (
                      <SelectItem
                        value={district.id + ""}
                        key={district.id}
                        className="capitalize"
                      >
                        {district.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              disabled={isLoadingProvinces}
              onValueChange={(value) => {
                setDistrictId("");
                setProvince(
                  provinces?.find((province) => province.id + "" === value) ??
                    null
                );
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provinces?.map((province) => {
                    return (
                      <SelectItem
                        value={province.id + ""}
                        key={province.id}
                        className="capitalize"
                      >
                        {province.number}. {province.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between gap-4">
            <Select
              value={role}
              onValueChange={(value) => {
                setRole(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value={"DONOR"} className="capitalize">
                    Donor
                  </SelectItem>
                  <SelectItem value={"RECEIVER"} className="capitalize">
                    Receiver
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              placeholder="phone number"
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex justify-between gap-4">
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Select
              value={bloodGroup}
              onValueChange={(value) => {
                setBloodGroup(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...bloodGroupParseMap.keys()].map((key) => {
                    return (
                      <SelectItem value={key} key={key} className="capitalize">
                        {bloodGroupParseMap.get(key)}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center">
            <Button
              disabled={!isFormValid}
              onClick={async () => {
                const result = await signUp({
                  email: email,

                  password: password,

                  role: role as UserRole, // can only be either RECEIVER or DONOR
                  fullName: fullName,

                  phoneNumber: phone ?? null,

                  district: Number.parseInt(districtId),

                  bloodGroup: bloodGroup as BloodGroup,
                }).catch((e: AxiosError) => e);
                if (result instanceof AxiosError) {
                  toast.error("Couldn't Create Account");
                  console.log("err ", result);
                } else {
                  toast.success("Account Created");
                  console.log("res ", result);
                  navigate("/login");
                }
              }}
            >
              SignUp
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
