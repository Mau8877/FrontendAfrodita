import { BannerScreen, ProductosScreen, TonosScreen, NuevosModelosScreen, PupilentesCosplayScreen, VisitanosScreen } from '@/app/features/home/components'

export function HomeScreen() {
  return (
    <div className="space-y-4">
      <BannerScreen />
      <ProductosScreen />
      <TonosScreen />
      <NuevosModelosScreen />
      <PupilentesCosplayScreen />
      <VisitanosScreen />
    </div>
  )
}