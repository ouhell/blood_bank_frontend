import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useParams, useSearchParams } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import { getPagedAccounts } from "@/api/apiCalls/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { parse as parseStringToObject } from "qs";

function ListAccounts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [searchParams]);
  const { data: accountsPage } = useQuery({
    queryKey: ["admin", "accounts", serializedSearchParams],

    queryFn: async () => {
      return getPagedAccounts({
        params: searchParamsRecord,
      }).then((res) => res.data);
    },
  });

  const [createdSearchParams, setCreatedSearchParams] = React.useState("");

  React.useEffect(() => {
    console.log("accounts page :", accountsPage);
    console.log("params :", searchParams.toString());
  }, [accountsPage]);

  return (
    <div className="page">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const newParams = new URLSearchParams();
          if (!createdSearchParams.trim()) {
            setSearchParams();
            setCreatedSearchParams("");
            return;
          }
          const extractedParams = createdSearchParams.split("&");
          for (const ext of extractedParams) {
            const [key, val] = ext.split("=");
            newParams.append(key, val);
          }
          setSearchParams(newParams);
        }}
      >
        <Input
          onChange={(e) => {
            setCreatedSearchParams(e.target.value);
          }}
          value={createdSearchParams}
        />
        <div></div>
        <Button type="submit">change</Button>
      </form>
    </div>
  );
}

export default ListAccounts;

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];
