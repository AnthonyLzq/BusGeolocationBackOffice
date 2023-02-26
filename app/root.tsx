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

import type { ENV } from './env.server'
import { getENV } from './env.server'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1'
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
