'use client';

import Markdown from 'markdown-to-jsx';
interface MarkdownPreviewProps {
	markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
	return (
		<div className="preview-content prose dark:prose-invert max-w-none h-[600px] overflow-y-auto p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
			<Markdown>{markdown || '*No content to display*'}</Markdown>
		</div>
	);
}
