import React from "react";

import { useSearchParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPagedAccounts, modifyAccountProfile } from "@/api/apiCalls/admin";

import { parse as parseStringToObject } from "qs";

import { columns } from "./DonorColumns";

import NumberedPagination from "@/components/NumberedPagination";
import { DataTable } from "@/components/DataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApiCenter } from "@/api/apiCenter";
import { AccountProfile, ModifyAccountData } from "@/types/databaseModel";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { fetchAllProvinces } from "@/api/apiCalls/user";
import { getPagedDonorAccounts } from "@/api/apiCalls/receiver";
import { bloodGroupParseMap } from "@/utils/typeConverting";

function DonorAccounts() {
  const queryClient = useQueryClient();
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

  const {
    data: accountsPage,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["receiver", "donors", serializedSearchParams],

    queryFn: async () => {
      return getPagedDonorAccounts({
        params: { ...searchParamsRecord, size: 10, role: "DONOR" },
      });
    },
    select(data) {
      return data.data;
    },
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const currentPage = searchParams.get("page")
    ? Number.parseInt(searchParams.get("page") as string) ?? 1
    : 1;

  const addSearchParamValues = (set: Record<string, string>) => {
    const newUrlSearchParams = new URLSearchParams();

    searchParams.forEach((key, val) => {
      newUrlSearchParams.set(val, key);
    });

    newUrlSearchParams.delete("page");
    newUrlSearchParams.set("page", "1");
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
    <div className="page">
      <h3 className="text-2xl">Donors </h3>
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
        <Select
          value={(searchParamsRecord.group as string) ?? ""}
          onValueChange={(value) => {
            addSearchParamValues({
              group: value,
            });
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Blood Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value=" ">Any</SelectItem>
              {[...bloodGroupParseMap.keys()].map((key) => {
                const val = bloodGroupParseMap.get(key);
                return (
                  <SelectItem key={key} value={key}>
                    {val}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={accountsPage?.content || []}
        columns={columns}
        isFetching={isFetching}
      />
      <div className="py-4">
        <NumberedPagination
          currentPageNumber={currentPage}
          totalPages={accountsPage?.totalPages ?? 1}
          onClickPage={setPageSearchParam}
          onClickLastPage={() => {
            setPageSearchParam(accountsPage ? accountsPage.totalElements : 1);
          }}
          onClickFirstPage={() => {
            setPageSearchParam(1);
          }}
          onClickNext={setPageSearchParam}
          onClickPrevious={setPageSearchParam}
        />
      </div>
    </div>
  );
}

export default DonorAccounts;
