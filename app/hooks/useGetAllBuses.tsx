import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import type { LatLngTuple } from 'leaflet'

import { randomHexColor } from '~/utils'

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

const useGetAllBuses = () => {
  const [buses, setBuses] = useState<string[]>([])
  const [polylines, setPolylines] = useState<LatLngTuple[][]>([[]])
  const [colors, setColors] = useState<string[]>([])

  useEffect(() => {
    const socket = io(ENV.WS_URL, {
      reconnectionDelayMax: 10000,
      transports: ['websocket', 'polling', 'flashsocket']
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

  return { buses, polylines, colors }
}

export { useGetAllBuses }
