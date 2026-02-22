import { describe, it, expect } from 'vitest'
import { resolvePuckPath } from './resolve-puck-path'

describe('resolvePuckPath', () => {
  it('returns view mode and path / for empty', () => {
    expect(resolvePuckPath([])).toEqual({ isEdit: false, path: '/' })
  })

  it('returns edit mode and path / when segment is edit', () => {
    expect(resolvePuckPath(['edit'])).toEqual({ isEdit: true, path: '/' })
  })

  it('returns view mode and path /about for ["about"]', () => {
    expect(resolvePuckPath(['about'])).toEqual({ isEdit: false, path: '/about' })
  })

  it('returns edit mode and path /about for ["about", "edit"]', () => {
    expect(resolvePuckPath(['about', 'edit'])).toEqual({ isEdit: true, path: '/about' })
  })
})
