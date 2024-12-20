
import { HeaderHome } from "@/components/Header/HeaderHome";
import { Outlet } from "react-router-dom";

export function HomeLayout () {
  return (
    <div>
      <HeaderHome />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-blue-200 to-blue-800 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}