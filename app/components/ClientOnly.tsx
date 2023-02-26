import type { FC, ReactNode } from 'react'
import { useState, useEffect } from 'react'

type Props = {
  children(): ReactNode
  fallback?: ReactNode
}

let hydrating = true

const ClientOnly: FC<Props> = props => {
  const { children, fallback = null } = props
  const [hydrated, setHydrated] = useState(() => !hydrating)

  useEffect(() => {
    hydrating = false
    setHydrated(true)
  }, [])

  return hydrated ? <>{children()}</> : <>{fallback}</>
}

export { ClientOnly }
