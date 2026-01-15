import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { INLINES, BLOCKS } from '@contentful/rich-text-types'
import Image from 'next/image'

export function renderRichText(document: any) {
  return documentToReactComponents(document, {
    renderNode: {
      [INLINES.HYPERLINK]: (node, children) => (
        <a 
          href={node.data.uri} 
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const { file, title } = node.data.target.fields
        return (
          <div className="my-6">
            <Image
              src={`https:${file.url}`}
              alt={title || ''}
              width={800}
              height={600}
              className="rounded-lg"
            />
          </div>
        )
      },
    },
    renderMark: {
      bold: (text) => <strong className="font-bold">{text}</strong>,
      italic: (text) => <em className="italic">{text}</em>,
      code: (text) => (
        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
          {text}
        </code>
      ),
    },
    renderText: (text) => {
      return text.split('\\n').flatMap((line, i) => [
        i > 0 && <br key={i} />,
        line,
      ])
    },
  })
}
