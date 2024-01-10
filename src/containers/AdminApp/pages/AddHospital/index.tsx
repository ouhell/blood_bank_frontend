import {
  getAllHospitals,
  postDoctor,
  postHospital,
} from "@/api/apiCalls/admin";
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
import { Account, AccountProfile, Hospital } from "@/types/databaseModel";
import { AxiosError } from "axios";
import { toast } from "sonner";

type FormData = {
  name: string;
  hashmap: string;

  districtId: string;
};

const AddHospital = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = React.useState<FormData>({
    name: "",
    hashmap: "",
    districtId: "",
  });
  const [selectedProvince, setSelectedProvince] = React.useState("");
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

  const { data, mutateAsync: addHospital } = useMutation<
    Hospital,
    AxiosError,
    Partial<Hospital>
  >({
    mutationFn: (data) => postHospital(data).then((res) => res.data),
  });

  const setFormValue = (value: string, name: keyof FormData) => {
    setFormData((old) => {
      const newFormData = { ...old };
      newFormData[name] = value;
      return newFormData;
    });
  };

  const isFormValid = formData.districtId && formData.name;
  return (
    <div className="page">
      <h3 className="text-2xl">Add Hospital </h3>

      <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!isFormValid) return;
          const result = await addHospital({
            name: formData.name,
            districtId: Number.parseInt(formData.districtId),
            mapHash: formData.hashmap,
          }).catch((err: AxiosError) => err);
          if (result instanceof AxiosError) {
            console.log("error : ", result);
            toast.error("couldn't create hospital", {
              style: {
                backgroundColor: "red",
              },
            });
          } else {
            toast.success("hospital has been created", {
              description: result.name,
              cancel: {
                label: "remove",
              },
              style: {
                backgroundColor: "green",
              },
            });
          }
        }}
        className=" flex h-full justify-center items-start pt-8"
      >
        <div className="p-8 rounded-sm border w-[40rem]">
          <div className="flex justify-between p-2 gap-8">
            <Input
              placeholder="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormValue(e.target.value, "name")}
            />
            <Input
              placeholder="hash map"
              name="hashmap"
              value={formData.hashmap}
              onChange={(e) => setFormValue(e.target.value, "hashmap")}
            />
          </div>

          {/* <div className="w-full flex items-center gap-1">
            <div className="w-full h-[0.1rem] bg-muted"></div>
            <div className="text-muted-foreground">Hospital</div>
            <div className="w-full h-[0.1rem]  bg-muted"></div>
          </div> */}
          <div className="flex justify-between p-2 gap-8">
            <Select
              disabled={isLoadingProvinces || !selectedProvince}
              onValueChange={(value) => {
                setFormValue(value, "districtId");
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a district" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {provinces
                    ?.find((province) => province.id + "" == selectedProvince)
                    ?.districts.map((district) => {
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
                setSelectedProvince(value);
              }}
              value={selectedProvince}
            >
              <SelectTrigger className="w-[200px]">
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
          <div className="flex items-center justify-center">
            <Button type="submit" size={"sm"} disabled={!isFormValid}>
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHospital;
