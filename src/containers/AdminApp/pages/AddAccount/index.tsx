import { getAllHospitals, postDoctor } from "@/api/apiCalls/admin";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { parse as parseStringToObject } from "qs";
import { fetchAllProvinces } from "@/api/apiCalls/user";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Account, AccountProfile } from "@/types/databaseModel";
import { AxiosError } from "axios";
import { toast } from "sonner";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  hospitalId: string;
};

const AddAccount = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = React.useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    hospitalId: "",
  });
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);

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
  const { data: hospitals, isLoading: isLoadingHospitals } = useQuery({
    queryKey: ["admin", "hospitals", serializedSearchParams],
    queryFn: () => {
      return getAllHospitals({
        params: searchParamsRecord,
      });
    },
    select: (res) => res.data,
    enabled: !isLoadingProvinces,
  });

  const { data, mutateAsync: addTeacher } = useMutation<
    AccountProfile,
    AxiosError,
    Account
  >({
    mutationFn: (account) =>
      postDoctor({
        data: account,
      }).then((res) => res.data),
  });

  React.useEffect(() => {
    console.log("provinces", provinces);
    console.log("hospitals", hospitals);
  }, [provinces, hospitals]);

  const addSearchParamValues = (set: Record<string, string>) => {
    const newUrlSearchParams = new URLSearchParams();
    searchParams.forEach((key, val) => {
      newUrlSearchParams.set(val, key);
    });
    for (const key in set) {
      newUrlSearchParams.delete(key);
      if (set[key]?.trim()) newUrlSearchParams.set(key, set[key]);
    }

    setSearchParams(newUrlSearchParams);
  };

  const setFormValue = (value: string, name: keyof FormData) => {
    setFormData((old) => {
      const newFormData = { ...old };
      newFormData[name] = value;
      return newFormData;
    });
  };
  return (
    <div className="page">
      <h3 className="text-2xl">Add Doctor </h3>

      <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const result = await addTeacher({
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            hospitalId: Number.parseInt(formData.hospitalId),
          }).catch((err: AxiosError) => err);
          if (result instanceof AxiosError) {
            console.log("error : ", result);
            toast.error("couldn't create doctor", {
              style: {
                backgroundColor: "red",
              },
            });
          } else {
            toast.success("Doctor has been created", {
              description: result.fullName,
              cancel: {
                label: "remove",
              },
              style: {
                backgroundColor: "green",
              },
            });
          }
          console.log("added doc :", result);
        }}
        className=" flex h-full justify-center items-start pt-8"
      >
        <div className="p-8 rounded-sm border w-[40rem]">
          <div className="flex justify-between p-2 gap-8">
            <Input
              placeholder="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormValue(e.target.value, "email")}
            />
            <Input
              placeholder="full name"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => setFormValue(e.target.value, "fullName")}
            />
          </div>
          <div className="flex justify-between p-2 gap-8">
            <Input
              placeholder="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => setFormValue(e.target.value, "password")}
            />
            <Input
              placeholder="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormValue(e.target.value, "phoneNumber")}
            />
          </div>

          <div className="w-full flex items-center gap-1">
            <div className="w-full h-[0.1rem] bg-muted"></div>
            <div className="text-muted-foreground">Hospital</div>
            <div className="w-full h-[0.1rem]  bg-muted"></div>
          </div>
          <div className="flex justify-between p-2 gap-8">
            <Select
              disabled={isLoadingProvinces || isLoadingHospitals}
              onValueChange={(value) => {
                setFormValue(value, "hospitalId");
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hospitals?.map((hospital) => {
                    return (
                      <SelectItem
                        value={hospital.id + ""}
                        key={hospital.id}
                        className="capitalize"
                      >
                        {hospital.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              disabled={isLoadingProvinces}
              onValueChange={(value) => {
                addSearchParamValues({
                  province: value,
                });
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a Province" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value=" ">Any</SelectItem>
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
          <div className="flex items-center justify-center">
            <Button type="submit" size={"sm"}>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAccount;
