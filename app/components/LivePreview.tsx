/**
 * T064: Live Preview Interface
 *
 * Real-time preview of wedding invitation as configuration changes.
 * Shows desktop preview with live updates from configuration state.
 * Follows Constitution Principle VII: useEffect + fetch for real-time updates only
 * (this is an exception because we need to poll for config changes in the dashboard)
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import TemplateRenderer from './preview/TemplateRenderer';
import type { PreviewData } from './preview/types';

interface LivePreviewProps {
    weddingConfigId: string;
    refreshTrigger?: number; // Increment to force refresh
}

export default function LivePreview({ weddingConfigId, refreshTrigger = 0 }: LivePreviewProps) {
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState<number | null>(null);

    // Measure container height and set CSS variable
    useEffect(() => {
        const updateHeight = () => {
            if (scrollContainerRef.current) {
                const height = scrollContainerRef.current.clientHeight;
                setContainerHeight(height);
            }
        };

        // Use setTimeout to ensure the container is rendered and has dimensions
        const timer = setTimeout(updateHeight, 100);

        window.addEventListener('resize', updateHeight);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateHeight);
        };
    }, [previewData]);

    useEffect(() => {
        async function fetchPreview() {
            try {
                setLoading(true);
                setError(null);
                // Add timestamp to bust Next.js cache
                const response = await fetch(`/api/wedding/preview`, {
                    cache: 'no-store',
                });

                if (response.ok) {
                    const { data } = await response.json();
                    setPreviewData(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to load preview');
                }
            } catch (err) {
                console.error('Failed to fetch preview:', err);
                setError('Failed to load preview');
            } finally {
                setLoading(false);
            }
        }

        fetchPreview();
    }, [weddingConfigId, refreshTrigger]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto" />
                    <p className="mt-2 text-sm text-gray-600">Loading preview...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                    <p className="text-red-500 mb-2">⚠️ {error}</p>
                    <button onClick={() => window.location.reload()} className="text-sm text-pink-600 underline">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!previewData) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <p className="text-gray-500">No preview data available</p>
            </div>
        );
    }

    return (
        <div className="live-preview h-full flex flex-col bg-white">
            {/* Preview Header - Browser Chrome */}
            <div className="flex-shrink-0 z-10 bg-gray-100 border-b px-4 py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="text-sm text-gray-600">
                    Preview: {previewData.config.subdomain}.oial-wedding.com (coming soon)
                </div>
                <div className="text-xs text-gray-500">
                    {previewData.config.isPublished ? '🟢 Published' : '🔴 Draft'}
                </div>
            </div>

            {/* Preview Content - Mobile view only for dashboard with scroll animations */}
            <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 overflow-hidden">
                <div
                    ref={scrollContainerRef}
                    className="shadow-2xl rounded-lg overflow-y-auto overflow-x-hidden bg-white w-[450px] max-h-full"
                    style={
                        containerHeight
                            ? {
                                  ['--container-height' as string]: `${containerHeight}px`,
                              }
                            : undefined
                    }
                >
                    <TemplateRenderer
                        templateId="template-1"
                        data={previewData}
                        mode="embedded"
                        scrollContainerRef={scrollContainerRef}
                    />
                </div>
            </div>
        </div>
    );
}
