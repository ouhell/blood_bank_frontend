import React from "react";

import { useSearchParams } from "react-router-dom";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  putCancelAppointment,
  getPagedAppointments,
  getPagedDemands,
  getPagedDonations,
} from "@/api/apiCalls/admin";

import { parse as parseStringToObject } from "qs";
import { DataTable } from "@/components/DataTable";
import { columns, setAppointmentsActions } from "./AppointmentColumns";

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
import { AxiosError } from "axios";
import { toast } from "sonner";

function ListAppointments() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);

  const queryClient = useQueryClient();
  const { data: donationsPage, isFetching: isAppointmentsFetching } = useQuery({
    queryKey: ["admin", "appointments", serializedSearchParams],

    queryFn: async () => {
      return getPagedAppointments({
        params: searchParamsRecord,
      });
    },
    select: (res) => res.data,
  });

  const { data, mutateAsync: cancelAppointment } = useMutation({
    mutationFn: async (appointmentId: number) => {
      return putCancelAppointment(appointmentId).then((res) => res.data);
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

  React.useEffect(() => {
    console.log("donations page :", donationsPage);
    console.log("params :", searchParams.toString());
  }, [donationsPage]);

  setAppointmentsActions({
    onCancel: async (appointment) => {
      const res = await cancelAppointment(appointment.id).catch(
        (e: AxiosError) => e
      );
      if (res instanceof AxiosError) {
        toast.error("error on canceling appointment");
        console.log("error", res);
      } else {
        toast.success("Canceled Appointment");
        queryClient.invalidateQueries({
          queryKey: ["admin", "appointments"],
        });
      }
    },
  });

  return (
    <div className="page">
      <h3 className="text-2xl">Appointments </h3>
      <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
      <div className="flex justify-between mb-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Input
            placeholder="doctor email or name"
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
              <SelectItem value="AWAITING_VALIDATION">
                Awaiting Validation
              </SelectItem>
              <SelectItem value="TERMINATED">Terminated</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <DataTable
        data={donationsPage?.content || []}
        columns={columns}
        isFetching={isAppointmentsFetching}
      />
      <div className="py-4">
        <NumberedPagination
          currentPageNumber={currentPage}
          totalPages={donationsPage?.totalPages ?? 1}
          onClickPage={setPageSearchParam}
          onClickLastPage={() => {
            setPageSearchParam(donationsPage ? donationsPage.totalElements : 1);
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

export default ListAppointments;
