import type { FC } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import { Icon } from 'leaflet'

import { useGetAllBuses } from '~/hooks'
import Bus from '../static/images/bus.png'

type Props = {
  height: string
  width: string
}

const BusIcon = new Icon({
  iconUrl: Bus,
  iconSize: [24, 24]
})
const initialPosition: LatLngTuple = [-12.084489222242723, -76.97945124985259]

const Map: FC<Props> = props => {
  const { height, width } = props
  const { buses, colors, polylines } = useGetAllBuses()

  return (
    <div
      id='mapContainer'
      style={{
        height,
        width,
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <MapContainer
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '16px'
        }}
        center={initialPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {polylines[0].length > 0 ? (
          <>
            {polylines.map((polyline, index) => (
              <Marker
                key={buses[index]}
                position={polyline[polyline.length - 1]}
                icon={BusIcon}
              >
                <Popup>Bus: {buses[index]}</Popup>
                <Polyline positions={polylines[index]} color={colors[index]}>
                  <Popup>Bus: {buses[index]}</Popup>
                </Polyline>
              </Marker>
            ))}
          </>
        ) : null}
      </MapContainer>
    </div>
  )
}

export { Map }
