import React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { AccountProfile } from "@/types/databaseModel";
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
import { NavLink } from "react-router-dom";
import { parseBloodGroup } from "@/utils/typeConverting";

type ColumnType = AccountProfile;

type AccountActions = {
  onActiveSwitch: (account: AccountProfile) => void;
};

const actions: AccountActions = {
  onActiveSwitch: () => {},
};

export const setAccountActions = (newActions: Partial<AccountActions>) => {
  const keys = Object.keys(newActions) as (keyof AccountActions)[];
  for (const key of keys) {
    actions[key] = newActions[key] ?? actions[key];
  }
};

export const columns: ColumnDef<ColumnType>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap max-w-32   overflow-hidden overflow-ellipsis">
          {row.original.fullName}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      return (
        <div className="whitespace-nowrap max-w-44   overflow-hidden overflow-ellipsis">
          {row.original.email}
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
    cell: ({ row }) => {
      return <div>{parseBloodGroup(row.original.bloodGroup)}</div>;
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    header: "District",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.district?.name}</div>;
    },
  },
];
