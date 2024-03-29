import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import {
  AccountProfile,
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
import { isAwaiting, isPending } from "@/utils/stateUtils";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DrawerTrigger } from "@/components/ui/drawer";

type ColumnType = DonationResp;

type DonationsActions = {
  onReject: (data: ColumnType) => void;
  onAssignAppointment: (data: ColumnType) => void;
};

const actions: DonationsActions = {
  onReject: () => {},
  onAssignAppointment: () => {},
};

export const setDonationsActions = (newActions: Partial<DonationsActions>) => {
  const keys = Object.keys(newActions) as (keyof DonationsActions)[];
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
    accessorKey: "donor",
    header: "Donor",
    cell({ row }) {
      const donorId = row.original.donorId;
      return (
        <NavLink
          to={`/management/accounts/profile/${donorId}`}
          className="capitalize hover:underline cursor-pointer"
        >
          {parseStatus(row.original.donor.fullName)}
        </NavLink>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell({ row }) {
      const isAwaitingAppointment = isAwaiting(row.original.status);
      const isDonated = row.original.status === "ACCEPTED";
      const isRejected = row.original.status === "REJECTED";
      return (
        <div
          className={cn("capitalize", {
            "text-orange-600": isAwaitingAppointment,
            "text-green-500": isDonated,
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
      const isAwaitingAppointment = isAwaiting(row.original.status);
      const isPendingAppointment = isPending(row.original.status);

      const isDone =
        row.original.status === "ACCEPTED" ||
        row.original.status === "REJECTED";
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
            <DropdownMenuSeparator />
            {isAwaitingAppointment && (
              <DropdownMenuItem
                className="text-green-500 hover:bg-green-500 hover:text-white"
                onClick={() => {
                  actions.onAssignAppointment(row.original);
                }}
              >
                <DrawerTrigger>
                  <div>Assign Appointment</div>
                </DrawerTrigger>
              </DropdownMenuItem>
            )}
            {isPendingAppointment && (
              <DropdownMenuItem>
                <NavLink to={`/appointments?donation=${Id}`}>
                  got to appointment
                </NavLink>
              </DropdownMenuItem>
            )}

            {!isDone && (
              <DropdownMenuItem
                className="text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => {
                  actions.onReject(row.original);
                }}
              >
                <div>Reject</div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
