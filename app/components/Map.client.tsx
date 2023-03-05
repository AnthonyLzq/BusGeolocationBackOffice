import type { FC } from 'react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import type { LatLngTuple } from 'leaflet'
import { Icon } from 'leaflet'

import Bus from '../static/images/bus.png'

type Point = [lat: number, lng: number]

type AllClientsData = {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        date: string
        position: {
          lat: number
          lng: number
        }
        state: 'on' | 'off'
      }
    }
  }
}

type Props = {
  height: string
  width: string
}

const BusIcon = new Icon({
  iconUrl: Bus,
  iconSize: [24, 24]
})
const initialPosition: LatLngTuple = [-12.084489222242723, -76.97945124985259]

const randomHexColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16)

  return `#${n.slice(0, 6).toUpperCase()}`
}

const Map: FC<Props> = props => {
  const [buses, setBuses] = useState<string[]>([])
  const [polylines, setPolylines] = useState<LatLngTuple[][]>([[]])
  const [colors, setColors] = useState<string[]>([])
  const { height, width } = props

  useEffect(() => {
    const socket = io(ENV.WS_URL, {
      reconnectionDelayMax: 10000
    })

    socket.on('initialData', (message: AllClientsData) => {
      const newBuses: string[] = []

      for (const client in message)
        for (const line in message[client])
          for (const bus in message[client][line]) newBuses.push(bus)

      setBuses(newBuses)

      const newColors = Array.from({ length: newBuses.length }, () =>
        randomHexColor()
      )

      setColors(newColors)
      newBuses.forEach((bus, index) => {
        socket.on(`${bus}/position`, (message: Point) => {
          setPolylines(prevState => {
            const newState = prevState.map(polyline => [...new Set(polyline)])

            if (!newState[index]) newState[index] = []

            newState[index].push(message)

            return newState
          })
        })
      })
    })

    return () => {
      if (socket.connected) socket.disconnect()
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
        zoom={12}
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
                <Polyline positions={polylines[index]} color={colors[index]} />
              </Marker>
            ))}
          </>
        ) : null}
      </MapContainer>
    </div>
  )
}

export { Map }
