import invariant from 'tiny-invariant'

const getENV = () => {
  invariant(process.env.WS_URL, 'WS_URL should be defined')
  // invariant(process.env.USER_ID, 'USER_ID should be defined')

  return {
    NODE_ENV: process.env.NODE_ENV,
    WS_URL: process.env.WS_URL
    // USER_ID: process.env.USER_ID
  }
}

export type ENV = ReturnType<typeof getENV>

declare global {
  var ENV: ENV

  interface window {
    ENV: ENV
  }
}

export { getENV }
