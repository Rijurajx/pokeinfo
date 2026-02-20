'use client'

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config'
import * as React from 'react'

if (typeof (React as any).useEffectEvent === 'undefined') {
  ; (React as any).useEffectEvent = function useEffectEvent(callback: any) {
    const ref = React.useRef(callback)
    React.useInsertionEffect(() => {
      ref.current = callback
    })
    return React.useCallback((...args: any[]) => {
      const fn = ref.current
      return fn(...args)
    }, [])
  }
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
