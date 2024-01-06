import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
  AccountProfile,
  AppointmentResp,
  DemandResp,
  DonationResp,
} from "@/types/databaseModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { parseStatus } from "@/utils/typeConverting";
import { isAwaiting } from "@/utils/stateUtils";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

type ColumnType = AppointmentResp;

type AppointmentsActions = {
  onReject: (appointment: ColumnType) => void;
  onAccept: (appointment: ColumnType) => void;
};

const actions: AppointmentsActions = {
  onReject: () => {},
  onAccept: () => {},
};

export const setDoctorAppointmentsActions = (
  newActions: Partial<AppointmentsActions>
) => {
  const keys = Object.keys(newActions) as (keyof AppointmentsActions)[];
  for (const key of keys) {
    actions[key] = newActions[key] ?? actions[key];
  }
};

export const columns: ColumnDef<ColumnType>[] = [
  // {
  //   accessorKey: "fullName",
  //   header: "Name",
  // },
  // {
  //   accessorKey: "email",
  //   header: "Email",
  // },
  {
    accessorKey: "patient",
    header: "Patient",
    cell({ row }) {
      return (
        <NavLink to={`#`} className="capitalize hover:underline cursor-pointer">
          {parseStatus(row.original.patientData.fullName)}
        </NavLink>
      );
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => {
      return (
        <div className="capitalize">{row.original?.reason?.toLowerCase()}</div>
      );
    },
  },
  {
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

      const formattedDate = date.toLocaleDateString("en-GB", options);
      return <div>{formattedDate}</div>;
    },
  },
  {
    header: "Time",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const hours = (date.getHours() + "").padStart(2, "0");
      const minutes = (date.getMinutes() + "").padStart(2, "0");

      return <div>{`${hours}:${minutes}`}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      const isRejected =
        row.original.status === "REJECTED" ||
        row.original.status === "CANCELED";

      const isTerminated = row.original.status === "TERMINATED";
      return (
        <div
          className={cn("capitalize", {
            "text-red-600": isRejected,
            "text-green-600": isTerminated,
          })}
        >
          {parseStatus(row.original.status)}
        </div>
      );
    },
  },

  {
    id: "actions",
    header: "app_loader",

    cell: ({ row }) => {
      const isAwaitingAppointment = !row.original.validated;

      return (
        <div className="flex gap-4">
          <Button
            className="bg-green-500 hover:bg-green-800"
            disabled={!isAwaitingAppointment}
            onClick={() => actions.onAccept(row.original)}
          >
            Accept
          </Button>
          <Button
            variant={"destructive"}
            disabled={!isAwaitingAppointment}
            onClick={() => actions.onReject(row.original)}
          >
            Reject
          </Button>
        </div>
      );
    },
  },
];
