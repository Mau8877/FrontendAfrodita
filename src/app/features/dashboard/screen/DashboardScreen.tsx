import { 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag 
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts'

// --- DATOS HARDCODEADOS (Métricas de Afrodita) ---
const dataVentas = [
  { name: 'Lun', ventas: 1200 },
  { name: 'Mar', ventas: 1900 },
  { name: 'Mie', ventas: 1500 },
  { name: 'Jue', ventas: 2800 },
  { name: 'Vie', ventas: 2100 },
  { name: 'Sab', ventas: 3400 },
  { name: 'Dom', ventas: 4000 },
]

const dataProductos = [
  { name: 'Lentes Grey', cant: 45 },
  { name: 'Mía Blue', cant: 32 },
  { name: 'Hidratante', cant: 28 },
  { name: 'Freshlook', cant: 24 },
  { name: 'Accesorios', cant: 18 },
]

export function DashboardScreen() {
  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HEADER DEL DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter">
            Dashboard <span className="text-secondary">Afrodita</span>
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
            Resumen general de operaciones | Marzo 2026
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm border border-secondary/20 text-secondary font-black text-[10px] uppercase tracking-widest px-6 py-3 rounded-2xl hover:bg-secondary hover:text-white transition-all shadow-sm active:scale-95">
          Descargar Reporte <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* 2. CARDS DE MÉTRICAS RÁPIDAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard 
          title="Ventas Totales" 
          value="12,450 Bs" 
          icon={<DollarSign className="text-emerald-500" />} 
          trend="+12%" 
          isUp={true} 
        />
        <MetricCard 
          title="Pedidos Hoy" 
          value="24" 
          icon={<Package className="text-secondary" />} 
          trend="+5" 
          isUp={true} 
        />
        <MetricCard 
          title="Nuevos Clientes" 
          value="156" 
          icon={<Users className="text-blue-500" />} 
          trend="-2%" 
          isUp={false} 
        />
        <MetricCard 
          title="Stock Bajo" 
          value="8" 
          icon={<ShoppingBag className="text-rose-500" />} 
          trend="Atención" 
          isUp={false} 
          alert 
        />
      </div>

      {/* 3. GRÁFICOS PRINCIPALES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico de Ventas Semanales */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Ingresos Semanales</h3>
            <TrendingUp className="h-5 w-5 text-secondary opacity-50" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataVentas}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} 
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontFamily: 'Poppins' }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#7c3aed" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorVentas)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Productos Top */}
        <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm">
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-8">Productos más vendidos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataProductos} layout="vertical" margin={{ left: -20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: '800', fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', shadow: 'md' }}
                />
                <Bar 
                  dataKey="cant" 
                  fill="#7c3aed" 
                  radius={[0, 10, 10, 0]} 
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 4. TABLA DE ÚLTIMOS PEDIDOS (Mini) */}
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2.5rem] border border-white shadow-sm">
        <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-6">Pedidos Recientes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                <th className="pb-4 font-black">Cliente</th>
                <th className="pb-4 font-black">Código</th>
                <th className="pb-4 font-black">Total</th>
                <th className="pb-4 font-black">Estado</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold text-slate-600">
              <OrderRow name="Mauro Primintela" code="AX-2391" total="450 Bs" status="Completado" />
              <OrderRow name="Anghelina Quispe" code="FZ-1102" total="280 Bs" status="Pendiente" />
              <OrderRow name="Leonel Messi" code="LM-1010" total="1,200 Bs" status="En Camino" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTES AUXILIARES ---

function MetricCard({ title, value, icon, trend, isUp, alert }: any) {
  return (
    <div className={`p-6 rounded-[2rem] border border-white shadow-sm transition-all hover:scale-[1.02] ${alert ? 'bg-rose-50/50' : 'bg-white/70 backdrop-blur-md'}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${isUp ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h2 className="text-2xl font-black text-slate-800 mt-1">{value}</h2>
    </div>
  )
}

function OrderRow({ name, code, total, status }: any) {
  const statusColors: any = {
    'Completado': 'bg-emerald-100 text-emerald-600',
    'Pendiente': 'bg-amber-100 text-amber-600',
    'En Camino': 'bg-blue-100 text-blue-600'
  }

  return (
    <tr className="border-b border-slate-50 last:border-none group hover:bg-white/40 transition-colors">
      <td className="py-4 px-1">{name}</td>
      <td className="py-4 text-secondary font-black">{code}</td>
      <td className="py-4">{total}</td>
      <td className="py-4">
        <span className={`px-3 py-1 rounded-full text-[9px] uppercase font-black ${statusColors[status]}`}>
          {status}
        </span>
      </td>
    </tr>
  )
}