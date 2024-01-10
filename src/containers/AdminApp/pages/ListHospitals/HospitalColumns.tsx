import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { Hospital } from "@/types/databaseModel";

import { parseStatus } from "@/utils/typeConverting";
import { isAwaiting } from "@/utils/stateUtils";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

type ColumnType = Hospital;

type HospitalsActions = {
  onReject: (data: ColumnType) => void;
  onAssignAppointment: (data: ColumnType) => void;
};

const actions: HospitalsActions = {
  onReject: () => {},
  onAssignAppointment: () => {},
};

export const setHospitalsActions = (newActions: Partial<HospitalsActions>) => {
  const keys = Object.keys(newActions) as (keyof HospitalsActions)[];
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
    accessorKey: "name",
    header: "Name",
    cell({ row }) {
      return <div className="capitalize">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "district",
    header: "District",
    cell: ({ row }) => {
      return <div className="capitalized">{row.original.district.name}</div>;
    },
  },
  {
    header: "Location",
    cell: ({ row }) => {
      const hash = row.original.mapHash;
      return (
        <div>
          {hash && (
            <a href={hash} target="_blank">
              <Button variant={"outline"}>Go</Button>
            </a>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "app_loader",
  },
];
