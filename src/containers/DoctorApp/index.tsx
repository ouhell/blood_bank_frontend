import { ThemeProvider } from "@/components/ThemeProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Stethoscope } from "lucide-react";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AppointmentsList from "./pages/AppointmentsList";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import "./doctor.css";
import { useApiCenter } from "@/api/apiCenter";

const DoctorApp = () => {
  const [apiCenter, setApiCenter] = useApiCenter();
  const navigate = useNavigate();
  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex flex-col overflow-hidden h-screen max-h-screen">
        <div className="header h-14 min-h-14 border-b flex items-center justify-between px-4 ">
          <div className="flex gap-4 items-center">
            <Stethoscope className="text-red-600 " />
            <h3 className="font-semibold text-xl ">LifeNectar</h3>
          </div>
          <DropdownMenu>
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
          </DropdownMenu>
        </div>
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/*" element={<AppointmentsList />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default DoctorApp;
