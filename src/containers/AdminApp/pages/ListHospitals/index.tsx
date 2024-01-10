import React from "react";

import { useSearchParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPagedDemands,
  getPagedDonations,
  getPagedHospitals,
  putRejectDonation,
} from "@/api/apiCalls/admin";

import { parse as parseStringToObject } from "qs";
import { DataTable } from "@/components/DataTable";
import { columns } from "@/containers/AdminApp/pages/ListHospitals/HospitalColumns";

import NumberedPagination from "@/components/NumberedPagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddAppointmentDrawer, {
  DrawerInitials,
} from "../../components/AddAppointmentDrawer";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchAllProvinces } from "@/api/apiCalls/user";

function ListHospitals() {
  const queryClient = useQueryClient();

  const [initials, setInitials] = React.useState<DrawerInitials>();

  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);

  const { data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: () => {
      return fetchAllProvinces();
    },
    select: (res) => {
      return res.data.sort((a, b) => {
        return a.number - b.number;
      });
    },
    placeholderData: (previousData, previousQuery) => previousData,
  });
  const { data: hospitalPage, isFetching: isHospitalFetching } = useQuery({
    queryKey: ["admin", "hospital", serializedSearchParams],

    queryFn: async () => {
      return getPagedHospitals({
        params: searchParamsRecord,
      });
    },
    select: (res) => res.data,
  });

  const currentPage = searchParams.get("page")
    ? Number.parseInt(searchParams.get("page") as string)
    : 1;

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

  const setPageSearchParam = (page: number) => {
    addSearchParamValues({
      page: page + "",
    });
  };

  return (
    <AddAppointmentDrawer initials={initials}>
      <div className="page">
        <h3 className="text-2xl">hospital</h3>
        <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
        <div className="flex justify-between mb-4">
          <Select
            value={(searchParamsRecord.province as string) ?? ""}
            onValueChange={(value) => {
              addSearchParamValues({
                province: value,
              });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a province" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value=" ">Any</SelectItem>
                {provinces?.map((province) => {
                  return (
                    <SelectItem
                      key={province.id}
                      value={province.id + ""}
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
        <DataTable
          data={hospitalPage?.content || []}
          columns={columns}
          isFetching={isHospitalFetching}
        />
        <div className="py-4">
          <NumberedPagination
            currentPageNumber={currentPage}
            totalPages={hospitalPage?.totalPages ?? 1}
            onClickPage={setPageSearchParam}
            onClickLastPage={() => {
              setPageSearchParam(hospitalPage ? hospitalPage.totalElements : 1);
            }}
            onClickFirstPage={() => {
              setPageSearchParam(1);
            }}
            onClickNext={setPageSearchParam}
            onClickPrevious={setPageSearchParam}
          />
        </div>
      </div>
    </AddAppointmentDrawer>
  );
}

export default ListHospitals;
