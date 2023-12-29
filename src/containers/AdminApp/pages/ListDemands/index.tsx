import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useSearchParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getPagedAccounts } from "@/api/apiCalls/admin";

import { parse as parseStringToObject } from "qs";
import { DataTable } from "./components/AccountsDataTable";
import { columns } from "./components/AccountsColumns";

import NumberedPagination from "@/components/NumberedPagination";

function ListDemands() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);
  const { data: accountsPage } = useQuery({
    queryKey: ["admin", "accounts", serializedSearchParams],

    queryFn: async () => {
      return getPagedAccounts({
        params: { ...searchParamsRecord, size: 10 },
      }).then((res) => res.data);
    },
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
      newUrlSearchParams.set(key, set[key]);
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

  return (
    <div className="page">
      <DataTable data={accountsPage?.content || []} columns={columns} />
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

export default ListDemands;
