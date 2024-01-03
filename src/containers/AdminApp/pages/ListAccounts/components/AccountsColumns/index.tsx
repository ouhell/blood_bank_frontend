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
  setActive: (isActive: boolean) => void;
};

const actions: AccountActions = {
  setActive: () => {},
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
    accessorKey: "isEnabled",
    header: "Enabled",
  },
  {
    id: "actions",
    header: "app_loader",
    cell: ({ row }) => {
      const userId = row.original.id;
      const isEnabled = row.original.isEnabled;
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
              onClick={() => navigator.clipboard.writeText(userId + "")}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isEnabled ? (
              <DropdownMenuItem
                className="text-red-500"
                onClick={() => actions.setActive(false)}
              >
                Disable
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="text-green-500"
                onClick={() => actions.setActive(true)}
              >
                Enable
              </DropdownMenuItem>
            )}

            <DropdownMenuItem>
              <NavLink to={`/management/accounts/profile/${userId}`}>
                Profile
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
