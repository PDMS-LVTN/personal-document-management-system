import { Outlet } from "react-router-dom";
import "../index.css";
import BrandBackground from "../components/BrandBackground";

function RootLayout() {
  return (
    <div className="flex-screen">
      <BrandBackground />
      <Outlet />
    </div>
  );
}

export default RootLayout;
