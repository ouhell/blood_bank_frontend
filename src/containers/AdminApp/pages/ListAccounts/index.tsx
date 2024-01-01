import React from "react";

import { useSearchParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getPagedAccounts } from "@/api/apiCalls/admin";

import { parse as parseStringToObject } from "qs";

import { columns } from "./components/AccountsColumns";

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

function ListAccounts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);

  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState("");
  const {
    data: accountsPage,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["admin", "accounts", serializedSearchParams],

    queryFn: async () => {
      return getPagedAccounts({
        params: { ...searchParamsRecord, size: 10 },
      });
    },
    select(data) {
      return data.data;
    },
    placeholderData: (previousData, previousQuery) => previousData,
  });

  const currentPage = searchParams.get("page")
    ? Number.parseInt(searchParams.get("page") as string)
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

  React.useEffect(() => {
    addSearchParamValues({
      search,
      role,
    });
  }, [search, role]);

  React.useEffect(() => {
    console.log("accounts page :", accountsPage);
    console.log("params :", searchParams.toString());
  }, [accountsPage]);

  return (
    <div className="page">
      <h3 className="text-2xl">Accounts </h3>
      <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
      <div className="flex justify-between mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            placeholder="email or name"
            className="w-72"
            value={search}
            onChange={({ target: { value } }) => {
              setSearch(value);
            }}
          />
        </form>

        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value=" ">Any</SelectItem>
              <SelectItem value="DOCTOR">Doctor</SelectItem>
              <SelectItem value="DONOR">Donor</SelectItem>
              <SelectItem value="RECEIVER">Receiver</SelectItem>
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

export default ListAccounts;
