import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useDeliveryStore } from '../store'

import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})
L.Marker.prototype.options.icon = DefaultIcon

export function MapPicker() {
  const { coordinates, setCoordinates } = useDeliveryStore()
  
  // Santa Cruz de la Sierra por defecto
  const defaultCenter: [number, number] = [-17.7833, -63.1821]
  const position: [number, number] = coordinates ? [coordinates.lat, coordinates.lng] : defaultCenter

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setCoordinates(e.latlng.lat, e.latlng.lng)
      },
    })

    return coordinates ? (
      <Marker 
        position={[coordinates.lat, coordinates.lng]} 
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const marker = e.target
            const pos = marker.getLatLng()
            setCoordinates(pos.lat, pos.lng)
          },
        }}
      />
    ) : null
  }

  return (
    <div className="h-[200px] w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
    </div>
  )
}