import { Outlet } from "react-router-dom";
import "../index.css";
import { useEffect } from "react";
import BrandBackground from "../components/BrandBackground";

// function handleCallbackResponse(response) {
//   console.log("Encoded JWT ID token: " + response.credential)
// }

function RootLayout() {
  // useEffect(()=>{
  //   // global google
  //  google.accounts.id.initialize({
  //   client_id: "944399081621-abj2rgnnudn10ta6ng95hitjuaaacjih.apps.googleusercontent.com"
  //   callback: handleCallbackResponse
  //  });
  //  google.accounts.id.renderButton(
  //   document.getElementById('signInDiv'),
  //   {theme: "outline", size: "large"}
  //  )
  // }, [])
  return (
    <div className="flex-screen">
      <BrandBackground />
      <Outlet/>
    </div>
  );
}

export default RootLayout;
