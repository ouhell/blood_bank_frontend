import React, { useEffect } from "react";

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
import {
  columns,
  setDoctorAppointmentsActions,
} from "./DoctorAppointmentsColumns";

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
import {
  ValidateAppointmentRequest,
  fetchDoctorPagedAppointments,
  putValidateAppointment,
} from "@/api/apiCalls/doctor";
import { Checkbox } from "@/components/ui/checkbox";

function AppointmentsList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const serializedSearchParams = React.useMemo<string>(() => {
    return searchParams.toString();
  }, [searchParams]);
  const searchParamsRecord = React.useMemo(() => {
    return parseStringToObject(serializedSearchParams);
  }, [serializedSearchParams]);

  const queryClient = useQueryClient();
  const { data: appointmentPage, isFetching: isAppointmentsFetching } =
    useQuery({
      queryKey: ["doctor", "appointments", serializedSearchParams],

      queryFn: async () => {
        return fetchDoctorPagedAppointments({
          params: searchParamsRecord,
        });
      },
      select: (res) => res.data,
      placeholderData: (data) => data,
    });

  const { mutateAsync: validateAppointment } = useMutation({
    mutationFn: async (request: ValidateAppointmentRequest) => {
      return putValidateAppointment(request).then((res) => res.data);
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

  setDoctorAppointmentsActions({
    onReject: async (data) => {
      const result = await validateAppointment({
        appointmentId: data.id,
        validation: false,
      }).catch((e: AxiosError) => e);

      if (result instanceof AxiosError) {
        toast.error("Failed to Reject Appointment");
        console.log("reject error:", result);
      } else {
        toast.success("Appointment Rejected Successfully");
        queryClient.invalidateQueries({
          queryKey: ["doctor", "appointments"],
        });
      }
    },
    onAccept: async (data) => {
      const result = await validateAppointment({
        appointmentId: data.id,
        validation: true,
      }).catch((e: AxiosError) => e);

      if (result instanceof AxiosError) {
        toast.error("Failed to Accept Appointment");
        console.log("Accept error:", result);
      } else {
        toast.success("Appointment Accepted Successfully");
        queryClient.invalidateQueries({
          queryKey: ["doctor", "appointments"],
        });
      }
    },
  });

  const setPageSearchParam = (page: number) => {
    addSearchParamValues({
      page: page + "",
    });
  };

  useEffect(() => {
    console.log("appointment page :", appointmentPage);
  }, [appointmentPage]);
  return (
    <div className="page">
      <h3 className="text-2xl">Appointments </h3>
      <div className="divider w-full h-[0.1rem] bg-muted mb-4 mt-2 font-semibold"></div>
      <div className="flex justify-between mb-4">
        <Select
          value={(searchParamsRecord.reason as string) ?? ""}
          onValueChange={(value) => {
            addSearchParamValues({ reason: value });
          }}
        >
          <SelectTrigger className="w-[15rem]">
            <SelectValue placeholder="Select a reason" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value=" ">Any</SelectItem>
              <SelectItem value="CONSULTATION">Consultation</SelectItem>
              <SelectItem value="BLOOD_EXTRACTION">Blood Extraction</SelectItem>
              <SelectItem value="TRANSFUSION">Transfusion</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Input
            placeholder="patient name"
            value={(searchParamsRecord.patient as string) ?? ""}
            onChange={(e) => {
              addSearchParamValues({
                patient: e.target.value,
              });
            }}
            className="w-[15rem]"
          />
        </div>

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
        data={appointmentPage?.content || []}
        columns={columns}
        isFetching={isAppointmentsFetching}
      />
      <div className="py-4">
        <NumberedPagination
          currentPageNumber={currentPage}
          totalPages={appointmentPage?.totalPages ?? 1}
          onClickPage={setPageSearchParam}
          onClickLastPage={() => {
            setPageSearchParam(
              appointmentPage ? appointmentPage.totalElements : 1
            );
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

export default AppointmentsList;
