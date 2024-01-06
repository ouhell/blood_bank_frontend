import { Route, Routes } from "react-router-dom";
import "./App.css";
import AdminApp from "./containers/AdminApp";
import { Toaster } from "@/components/ui/sonner";
import DoctorApp from "./containers/DoctorApp";
import Home from "./containers/Home";
import { useApiCenter } from "./api/apiCenter";
import DonorApp from "./containers/DonorApp";
import ReceiverApp from "./containers/ReceiverApp";

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
      <Routes>
        <Route path="/*" element={app} />
      </Routes>
    </>
  );
}

export default App;
