'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownPreviewProps {
	markdown: string;
}

export function MarkdownPreview({ markdown }: MarkdownPreviewProps) {
	return (
		<div className="preview-content prose dark:prose-invert max-w-none h-[600px] overflow-y-auto p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					code({ node, className, children, ...props }) {
						const match = /language-(\w+)/.exec(className || '');
						return match ? (
							// @ts-ignore
							<SyntaxHighlighter style={tomorrow} language={match[1]} PreTag="div" {...props}>
								{String(children).replace(/\n$/, '')}
							</SyntaxHighlighter>
						) : (
							<code className={className || ''} {...props}>
								{children}
							</code>
						);
					},
				}}>
				{markdown || '*No content to display*'}
			</ReactMarkdown>
		</div>
	);
}
