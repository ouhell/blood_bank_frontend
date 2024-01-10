import { Route, Routes } from "react-router-dom";

import AdminApp from "./containers/AdminApp";
import { Toaster } from "@/components/ui/sonner";
import DoctorApp from "./containers/DoctorApp";
import Home from "./containers/Home";
import { useApiCenter } from "./api/apiCenter";
import DonorApp from "./containers/DonorApp";
import ReceiverApp from "./containers/ReceiverApp";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import { AnimatePresence } from "framer-motion";

function App() {
  const [apiCenter, setApiCenter] = useApiCenter();
  let app: React.ReactNode = <Home />; //  <AdminApp />; //;<DoctorApp />;  switch(apiCenter.role) {

  switch (apiCenter.role) {
    case "ADMIN":
      app = <AdminApp />;
      break;

    case "DOCTOR":
      app = <DoctorApp />;
      break;
    case "DONOR":
      app = <DonorApp />;
      break;
    case "RECEIVER":
      app = <ReceiverApp />;
      break;
  }
  return (
    <>
      <Toaster />
      <AnimatePresence>
        <Routes>
          <Route path="/*" element={app} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
