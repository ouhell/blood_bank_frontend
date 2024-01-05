import React from "react";

import { useSearchParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPagedAccounts, modifyAccountProfile } from "@/api/apiCalls/admin";

import { parse as parseStringToObject } from "qs";

import { columns, setAccountActions } from "./components/AccountsColumns";

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

function ListAccounts() {
  const [apiCenter, setApiCenter] = useApiCenter();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);

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

  const { mutateAsync: modifyAccount, data } = useMutation<
    AccountProfile,
    AxiosError,
    ModifyAccountData
  >({
    mutationFn: (data) => modifyAccountProfile(data).then((res) => res.data),
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

  React.useEffect(() => {
    console.log("accounts page :", accountsPage);
    console.log("params :", searchParams.toString());
  }, [accountsPage]);

  React.useEffect(() => {
    console.log("api center", apiCenter);
  }, [apiCenter]);

  setAccountActions({
    onActiveSwitch: async (account) => {
      console.log(account);
      const data: ModifyAccountData = {
        id: account.id,
        isAccountNonLocked: !account.isAccountNonLocked,
      };
      console.log("data", data);
      const result = await modifyAccount(data).catch((e: AxiosError) => e);

      if (result instanceof AxiosError) {
        console.log("error ", result);
        toast.error("failed to update");
      } else {
        toast.success("updated account");
        queryClient.invalidateQueries({
          queryKey: ["admin", "accounts"],
        });
      }
    },
  });

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
            value={(searchParamsRecord.search as string) ?? ""}
            onChange={({ target: { value } }) => {
              addSearchParamValues({
                search: value,
              });
            }}
          />
        </form>

        <Select
          value={(searchParamsRecord.role as string) ?? ""}
          onValueChange={(value) => {
            addSearchParamValues({
              role: value,
            });
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
