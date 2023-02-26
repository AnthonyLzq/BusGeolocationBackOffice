import type { LinksFunction } from '@remix-run/node'

import { ClientOnly, Map } from '~/components'
import globalStyle from '~/styles/global.css'

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css'
  },
  {
    rel: 'stylesheet',
    href: globalStyle
  }
]

const Home = () => {
  const mapHeight = '100vh'
  const mapWidth = '100%'

  return (
    <ClientOnly
      fallback={
        <div
          id='skeleton'
          style={{ height: mapHeight, width: mapWidth, background: '#d1d1d1' }}
        />
      }
    >
      {() => <Map height={mapHeight} width={mapWidth} />}
    </ClientOnly>
  )
}

export default Home
