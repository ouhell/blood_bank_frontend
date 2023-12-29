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

type ColumnType = AccountProfile;

export const columns: ColumnDef<ColumnType>[] = [
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
  },
  {
    accessorKey: "isEnabled",
    header: "Enabled",
  },
  {
    id: "actions",
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
              <DropdownMenuItem className="text-red-500">
                Disable
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-green-500">
                Enable
              </DropdownMenuItem>
            )}

            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
