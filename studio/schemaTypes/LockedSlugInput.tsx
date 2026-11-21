import {useEffect, useState} from 'react'
import {SlugInput, useClient, useFormValue, type SlugInputProps} from 'sanity'

/* The slug is part of every URL, every shared itinerary link and every
   visitor's saved places, so it must not change once the document has been
   published. This input is the normal slug input, made read-only as soon as a
   published version of the document exists. */
export function LockedSlugInput(props: SlugInputProps) {
  const client = useClient({apiVersion: '2025-01-01'})
  const documentId = useFormValue(['_id']) as string | undefined
  const [published, setPublished] = useState(false)

  useEffect(() => {
    if (!documentId) return
    const publishedId = documentId.replace(/^drafts\./, '')
    let active = true
    client
      .fetch<boolean>(
        'defined(*[_id == $id][0]._id)',
        {id: publishedId},
        {perspective: 'published'},
      )
      .then((exists) => {
        if (active) setPublished(Boolean(exists))
      })
      .catch(() => {
        /* If the check fails, leave the field editable. */
      })
    return () => {
      active = false
    }
  }, [client, documentId])

  return <SlugInput {...props} readOnly={props.readOnly || published} />
}
