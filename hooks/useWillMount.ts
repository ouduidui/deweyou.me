import type { EffectCallback } from 'react'
import { useEffect, useRef } from 'react'

export default (callback: EffectCallback) => {
  const isMounted = useRef(false)
  const clearUp = useRef(callback())

  useEffect(() => {
    isMounted.current = true
    return clearUp.current
  }, [])
}
