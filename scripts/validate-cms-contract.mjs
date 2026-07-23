import { readFile } from 'node:fs/promises'

const path = new URL('../cms/spp-content-contract.schema.json', import.meta.url)
const schema = JSON.parse(await readFile(path, 'utf8'))
const references = []

JSON.stringify(schema, (key, value) => {
  if (key === '$ref') references.push(value)
  return value
})

for (const reference of references) {
  if (!reference.startsWith('#/$defs/')) {
    throw new Error(`External schema reference is not allowed: ${reference}`)
  }

  const definition = reference.slice('#/$defs/'.length)
  if (!schema.$defs?.[definition]) {
    throw new Error(`Missing schema definition: ${reference}`)
  }
}

if (schema.properties?.schema_version?.const !== '1.0.0') {
  throw new Error('The Phase 1 contract must declare schema version 1.0.0')
}

console.log(`Valid contract: ${schema.title}`)
console.log(`Schema version: ${schema.properties.schema_version.const}`)
console.log(`Definitions: ${Object.keys(schema.$defs).length}`)
console.log(`Local references checked: ${references.length}`)
