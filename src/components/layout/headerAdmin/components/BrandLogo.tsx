import { Link } from "@tanstack/react-router"

export function BrandLogo() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <Link to="/admin/dashboard">
        <img 
          src="/Logo Sin Numero.png" 
          alt="Afrodita Logo" 
          className="h-10 w-10 md:h-12 md:w-12 object-contain"
        />
      </Link>
    </div>
  )
}