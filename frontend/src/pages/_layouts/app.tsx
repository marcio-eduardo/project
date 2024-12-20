import { Header } from "@/components/Header/Header";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-t from-blue-200 to-blue-800 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}