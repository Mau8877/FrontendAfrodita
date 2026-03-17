import { BannerScreen, TipoProductosScreen, TonosScreen, NuevosModelosScreen, MarcasScreen, VisitanosScreen } from '@/app/features/client/home/components'

export function HomeScreen() {
  return (
    <div className="">
      <BannerScreen />
      <TipoProductosScreen />
      <TonosScreen />
      <NuevosModelosScreen />
      <MarcasScreen />
      <VisitanosScreen />
    </div>
  )
}