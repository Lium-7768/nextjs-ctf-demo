import { createClient } from "contentful"

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

export const contentfulClient = createClient({
  space: space || "",
  accessToken: accessToken || "",
})

export type ContentfulEntry<T = any> = {
  sys: {
    id: string
    createdAt: string
    updatedAt: string
    locale: string
  }
  fields: T
}

export async function getEntries<T = any>(contentType?: string) {
  const entries = await contentfulClient.getEntries<T>({
    content_type: contentType,
  })
  return entries.items
}

export async function getEntry<T = any>(id: string) {
  const entry = await contentfulClient.getEntry<T>(id)
  return entry
}
