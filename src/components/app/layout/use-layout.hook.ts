import { useEffect, useSyncExternalStore, type DependencyList } from 'react'

import type { LayoutConfig } from './layout.model'

const emptyLayoutConfig: LayoutConfig = {
  breadcrumbs: [],
  title: '',
  description: '',
}

let currentLayoutConfig = emptyLayoutConfig
const listeners = new Set<() => void>()

function subscribe(listener: () => void) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

function getLayoutSnapshot() {
  return currentLayoutConfig
}

function hasSameLayout(previous: LayoutConfig, next: LayoutConfig) {
  return (
    previous.title === next.title &&
    previous.description === next.description &&
    previous.breadcrumbs.length === next.breadcrumbs.length &&
    previous.breadcrumbs.every((breadcrumb, index) => breadcrumb === next.breadcrumbs[index])
  )
}

function setLayoutConfig(config: LayoutConfig) {
  if (hasSameLayout(currentLayoutConfig, config)) {
    currentLayoutConfig = config
    return
  }

  currentLayoutConfig = config
  listeners.forEach((listener) => listener())
}

function useLayout(config: LayoutConfig, deps: DependencyList) {
  useEffect(() => {
    setLayoutConfig(config)
    // Callers pass effect-style deps to control layout sync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    return () => {
      setLayoutConfig(emptyLayoutConfig)
    }
  }, [])
}

function useLayoutSnapshot() {
  return useSyncExternalStore(subscribe, getLayoutSnapshot, getLayoutSnapshot)
}

export { useLayout, useLayoutSnapshot }
