import logo from "@/assets/logo-small.png"
export function HeaderLogin() {
  return (
    <div className="w-[270px] h-[100px] rounded-full flex items-center justify-center">
      <img src={logo} alt="Logomarca" />
      <span className="p-8 text-center text-6xl font-bold text-white ">Dentalis</span>
    </div>
  )
}