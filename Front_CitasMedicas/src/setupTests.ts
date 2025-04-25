import '@testing-library/jest-dom/vitest'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Limpia el DOM después de cada test
afterEach(() => {
    cleanup()
})