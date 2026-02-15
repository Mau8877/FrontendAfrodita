import { Instagram, MessageCircle, Mail } from 'lucide-react'
import { SiTiktok } from 'react-icons/si' 

export function FooterContent() {
  const socialLinks = [
    { icon: <MessageCircle size={18} />, href: "https://wa.me/tu_numero", color: "hover:bg-[#25D366]", label: "WhatsApp" },
    { icon: <SiTiktok size={16} />, href: "#", color: "hover:bg-[#000000]", label: "TikTok" },
    { icon: <Instagram size={18} />, href: "#", color: "hover:bg-[#E4405F]", label: "Instagram" },
    { icon: <Mail size={18} />, href: "mailto:pupilentes@sweetylens.com", color: "hover:bg-[#EA4335]", label: "Email" },
  ]

  return (
    <div className="w-full px-6 py-6"> {/* Reducimos el padding de py-10 a py-6 */}
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* LADO IZQUIERDO: Redes Sociales */}
        <div className="flex gap-3">
          {socialLinks.map((social) => (
            <a 
              key={social.label}
              href={social.href}
              className={`bg-white/40 p-2 rounded-full text-secondary hover:text-white transition-all duration-300 shadow-sm ${social.color}`}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* CENTRO: Marca pequeña */}
        <div className="text-center">
          <span className="text-xl font-bold text-secondary italic tracking-tighter">Afrodita</span>
        </div>

        {/* LADO DERECHO: Contacto compacto */}
        <div className="flex flex-col items-center md:items-end text-[11px] font-bold text-secondary/80 uppercase tracking-tight">
          <span>WhatsApp: +591 7XXXXXXX</span>
          <span>Email: pupilentes@sweetylens.com</span>
        </div>

      </div>

      {/* COPYRIGHT MINIMALISTA */}
      <div className="mt-6 pt-4 border-t border-black/5 text-center">
        <p className="text-[9px] font-bold text-secondary/50 uppercase tracking-[0.2em]">
          Copyright Pupilentes Sweety Lens - 2025. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}