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
  onCancel: (appointment: ColumnType) => void;
};

const actions: AppointmentsActions = {
  onCancel: () => {},
};

export const setAppointmentsActions = (
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
    accessorKey: "doctor",
    header: "Doctor",
    cell({ row }) {
      const doctorId = row.original.doctorData.id;
      return (
        <NavLink
          to={`/management/accounts/profile/${doctorId}`}
          className="capitalize hover:underline cursor-pointer"
        >
          {parseStatus(row.original.doctorData.fullName)}
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
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      const isRejected =
        row.original.status === "REJECTED" ||
        row.original.status === "CANCELED";
      return (
        <div
          className={cn("capitalize", {
            "text-red-600": isRejected,
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
      const Id = row.original.id;
      const doctorId = row.original.doctorId;
      const donationId = row.original.donationId;
      const demandId = row.original.demandId;
      const isAwaitingAppointment = !row.original.validated;
      const isRejected =
        row.original.status === "REJECTED" ||
        row.original.status === "CANCELED";
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(Id + "")}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(doctorId + "")}
            >
              Copy doctor ID
            </DropdownMenuItem>
            {demandId && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(demandId + "")}
              >
                Copy demand ID
              </DropdownMenuItem>
            )}
            {donationId && (
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(donationId + "")}
              >
                Copy donation ID
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {isAwaitingAppointment && (
              <DropdownMenuItem
                className="text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => actions.onCancel(row.original)}
              >
                <div>Cancel</div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
