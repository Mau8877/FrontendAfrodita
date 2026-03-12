import { BannerScreen, TipoProductosScreen, TonosScreen, NuevosModelosScreen, PupilentesCosplayScreen, VisitanosScreen } from '@/app/features/client/home/components'

export function HomeScreen() {
  return (
    <div className="space-y-4">
      <BannerScreen />
      <TipoProductosScreen />
      <TonosScreen />
      <NuevosModelosScreen />
      <PupilentesCosplayScreen />
      <VisitanosScreen />
    </div>
  )
}