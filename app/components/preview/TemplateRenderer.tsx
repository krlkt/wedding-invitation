'use client'

/**
 * Template Renderer Component
 *
 * Strategy pattern for template selection.
 * Renders the appropriate template based on templateId.
 * Future templates can be added to the TEMPLATES registry.
 */

import Template1Preview from './Template1Preview'
import type { TemplateProps, TemplateId } from './types'

const TEMPLATES = {
    'template-1': Template1Preview,
    // Future templates can be added here:
    // 'template-2': Template2Preview,
    // 'template-3': Template3Preview,
} as const

interface TemplateRendererProps {
    templateId?: TemplateId
    data: TemplateProps['data']
    containerClassName?: string
}

export default function TemplateRenderer({
    templateId = 'template-1',
    data,
    containerClassName = '',
}: TemplateRendererProps) {
    const TemplateComponent = TEMPLATES[templateId]

    if (!TemplateComponent) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <p className="text-gray-500">Template &quot;{templateId}&quot; not found</p>
            </div>
        )
    }

    return (
        <div className={containerClassName}>
            <TemplateComponent data={data} />
        </div>
    )
}
