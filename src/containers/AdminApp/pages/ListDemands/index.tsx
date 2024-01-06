import React, { useState } from "react";

import { useSearchParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPagedAccounts,
  getPagedDemands,
  putRejectDemand,
} from "@/api/apiCalls/admin";

import { parse as parseStringToObject } from "qs";
import { DataTable } from "@/components/DataTable";
import { columns, setDemandsActions } from "./components/DemandColumns";

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
import { DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { toast } from "sonner";

function ListDemands() {
  const queryClient = useQueryClient();
  const [initials, setInitials] = useState<DrawerInitials>();
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);
  const { data: demandsPage, isFetching: isDemandsFetching } = useQuery({
    queryKey: ["admin", "demands", serializedSearchParams],

    queryFn: async () => {
      return getPagedDemands({
        params: searchParamsRecord,
      });
    },
    select: (res) => res.data,
  });

  const { mutateAsync: rejectDemand } = useMutation({
    mutationFn: (demandId: number) => {
      return putRejectDemand(demandId).then((res) => res.data);
    },
    onError: (e: AxiosError) => {
      console.log("rejectDemandError :", e);
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
      if (set[key]?.trim()) newUrlSearchParams.set(key, set[key]);
    }

    setSearchParams(newUrlSearchParams);
  };

  const setPageSearchParam = (page: number) => {
    addSearchParamValues({
      page: page + "",
    });
  };

  setDemandsActions({
    onAssignAppointment(data) {
      setInitials({
        demandId: data.id,
        province: data.receiver.district?.provinceId,
      });
    },
    onReject: async (demand) => {
      const result = await rejectDemand(demand.id).catch((e: AxiosError) => e);
      if (result instanceof AxiosError) {
        toast.error("Couldn't Reject Demand");
      } else {
        toast.success("Demand Successfully Rejected");
        queryClient.invalidateQueries({
          queryKey: ["admin", "demands"],
        });

        queryClient.invalidateQueries({
          queryKey: ["admin", "appointments"],
        });
      }
    },
  });

  return (
    <AddAppointmentDrawer initials={initials}>
      <div className="page">
        <h3 className="text-2xl">Demands </h3>
        <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
        <div className="flex justify-between mb-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Input
              placeholder="receiver email or name"
              className="w-72"
              value={(searchParamsRecord.search as string) ?? ""}
              onChange={({ target: { value } }) => {
                addSearchParamValues({ search: value });
              }}
            />
          </form>

          <Select
            value={(searchParamsRecord.status as string) ?? ""}
            onValueChange={(value) => {
              addSearchParamValues({ status: value });
            }}
          >
            <SelectTrigger className="w-[15rem]">
              <SelectValue placeholder="Select a Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value=" ">Any</SelectItem>
                <SelectItem value="AWAITING_CONSULTATION">
                  Awaiting Consultation
                </SelectItem>
                <SelectItem value="AWAITING_TRANSFUSION">
                  Awaiting Transfusion
                </SelectItem>
                <SelectItem value="PENDING_CONSULTATION">
                  Pending Consultation
                </SelectItem>
                <SelectItem value="PENDING_TRANSFUSION">
                  Pending Transfusion
                </SelectItem>
                <SelectItem value="ALLOCATING">Allocating</SelectItem>
                <SelectItem value="SERVED">Served</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <DataTable
          data={demandsPage?.content || []}
          columns={columns}
          isFetching={isDemandsFetching}
        />
        <div className="py-4">
          <NumberedPagination
            currentPageNumber={currentPage}
            totalPages={demandsPage?.totalPages ?? 1}
            onClickPage={setPageSearchParam}
            onClickLastPage={() => {
              setPageSearchParam(demandsPage ? demandsPage.totalElements : 1);
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

export default ListDemands;
