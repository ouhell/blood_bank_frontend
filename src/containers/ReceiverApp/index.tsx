import { ThemeProvider } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Droplet, Stethoscope } from "lucide-react";
import React from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import ReceiverDemandsList from "./pages/DemandsList";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import "./receiver.css";
import { useApiCenter } from "@/api/apiCenter";
import DonorAccounts from "./pages/DonorList";
import { Button } from "@/components/ui/button";

const ReceiverApp = () => {
  const [apiCenter, setApiCenter] = useApiCenter();
  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col overflow-hidden h-screen max-h-screen">
        <div className="header h-14 min-h-14 border-b flex items-center justify-between px-4 ">
          <div className="flex gap-4 items-center">
            <Droplet className="text-red-600 " />
            <h3 className="font-semibold text-xl ">LifeNectar</h3>
          </div>
          <div className="flex gap-4">
            <NavLink to="/" className=" hover:font-bold hover:underline">
              Demands
            </NavLink>
            <NavLink to="/donors" className=" hover:font-bold hover:underline">
              Donors
            </NavLink>
          </div>
          <div>
            <Button
              variant="outline"
              className="hover:text-red-500 hover:border-red-500 transition-colors"
              size={"sm"}
              onClick={() => {
                setApiCenter((old) => {
                  return {
                    token: undefined,
                    role: undefined,
                  };
                });
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText("")}
                className="text-red-500"
                onSelect={() => {
                  setApiCenter((old) => {
                    return {
                      token: undefined,
                      role: undefined,
                    };
                  });
                  navigate("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/donors" element={<DonorAccounts />} />
            <Route path="/*" element={<ReceiverDemandsList />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default ReceiverApp;
