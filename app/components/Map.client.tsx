import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import { Icon } from 'leaflet'

import Bus from '../static/images/bus.png'

type Point = [lat: number, lng: number]

type Props = {
  height: string
  width: string
}

const BusIcon = new Icon({
  iconUrl: Bus,
  iconSize: [24, 24]
})
const initialPosition: LatLngTuple = [-12.025560850179993, -77.05343209496314]

const Map: FC<Props> = props => {
  const [polyline, setPolyline] = useState<LatLngTuple[]>([])
  const { height, width } = props

  useEffect(() => {
    const socket = io(ENV.WS_URL, {
      reconnectionDelayMax: 10000,
      query: {
        id: '1'
      },
      transports: ['websocket']
    })

    socket.on('bus/position', (message: Point) => {
      setPolyline(prevPolyline => prevPolyline.concat([message]))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

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
        zoom={16}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        {polyline.length > 0 ? (
          <>
            <Marker position={polyline[polyline.length - 1]} icon={BusIcon}>
              <Popup>UNI de mierda</Popup>
            </Marker>
            <Polyline positions={polyline} />
          </>
        ) : null}
      </MapContainer>
    </div>
  )
}

export { Map }
