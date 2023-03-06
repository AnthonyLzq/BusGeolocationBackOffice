import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction
} from '@remix-run/node'
import { json } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from '@remix-run/react'

import BusGeolocation from './static/images/BusGeolocation.png'
import type { ENV } from './env.server'
import { getENV } from './env.server'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Bus Geolocation',
  viewport: 'width=device-width,initial-scale=1',
  keywords: 'Bus,Geolocation,Lima,Peru,IoT,ATU',
  description: 'Geolocation of buses in Lima, Peru',
  'og:type': 'website',
  'og:url': 'https://bus-geolocation-back-office.vercel.app',
  'og:title': 'Bus Geolocation',
  'og:description': 'Geolocation of buses in Lima, Peru',
  'og:image': BusGeolocation,
  'og:locale': 'es_ES',
  'twitter:card': 'summary_large_image',
  'twitter:creator': '@AnthonyLzq',
  'twitter:url': 'https://bus-geolocation-back-office.vercel.app',
  'twitter:title': 'Bus Geolocation',
  'twitter:description': 'Geolocation of buses in Lima, Peru.',
  'twitter:image': BusGeolocation
})

type LoaderData = {
  ENV: ENV
}

export const link: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: 'https://unpkg.com/react-leaflet-markercluster/dist/styles.min.css'
  }
]

export const loader: LoaderFunction = () => {
  return json<LoaderData>({
    ENV: getENV()
  })
}

export default function App() {
  const { ENV } = useLoaderData<LoaderData>()

  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`
          }}
        />
        <LiveReload />
      </body>
    </html>
  )
}
