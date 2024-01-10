import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";
import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";

const Home = () => {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="overflow-hidden">
        <header className="min-h-14 h-14 px-4 border-b flex justify-between items-center ">
          <div className="flex items-center gap-4">
            <Droplet className="text-red-600" />
            <h3 className="text-xl text-bold">LifeNectar</h3>
          </div>
          <div className="flex gap-4">
            <NavLink to={"/sign-up"}>
              <Button variant={"outline"} size={"sm"}>
                Sign up
              </Button>
            </NavLink>

            <NavLink to={"/login"}>
              <Button size={"sm"}>Login</Button>
            </NavLink>
          </div>
        </header>
        <main className="overflow-auto">
          <Routes>
            <Route path="sign-up" element={<SignUp />} />
            <Route path="/*" element={<Login />} />
            {/* <Route path="/*" element={<LandingPage />} /> */}
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Home;
