import assert from 'node:assert/strict'
import {
  normalizeDuplicatedSiteBase,
  routerBasePath,
  siteBasePath,
  toInternalAppPath,
} from '../src/utils/routes.js'

const origin = 'https://sppaintingremodeling.com.au'
const siteUrl = `${origin}/spp-redesign/`
const routerBase = '/spp-redesign/index.php'

assert.equal(siteBasePath(siteUrl, origin), '/spp-redesign')
assert.equal(
  normalizeDuplicatedSiteBase(
    '/spp-redesign/spp-redesign/index.php/services',
    '/spp-redesign',
  ),
  '/spp-redesign/index.php/services',
)
assert.equal(
  routerBasePath({
    siteUrl,
    explicitBase: routerBase,
    pathname: '/spp-redesign/index.php/about',
    origin,
  }),
  routerBase,
)
assert.equal(
  routerBasePath({
    siteUrl,
    explicitBase: routerBase,
    pathname: '/spp-redesign/',
    origin,
  }),
  '/spp-redesign',
)
assert.equal(
  toInternalAppPath(
    `${origin}/spp-redesign/index.php/services`,
    '/',
    { origin, siteUrl, routerBase },
  ),
  '/services',
)
assert.equal(
  toInternalAppPath(
    `${origin}/spp-redesign/spp-redesign/index.php/our-process`,
    '/',
    { origin, siteUrl, routerBase },
  ),
  '/our-process',
)
assert.equal(
  toInternalAppPath(
    `${origin}/spp-redesign/about`,
    '/',
    { origin, siteUrl, routerBase },
  ),
  '/about',
)

console.log('Route normalization checks: 7')
console.log('Result: PASS')
