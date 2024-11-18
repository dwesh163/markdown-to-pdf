'use client';

import { Textarea } from './ui/textarea';

interface MarkdownEditorProps {
	value: string;
	onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
	return <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full h-[600px] p-4 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none" placeholder="Enter your markdown here..." />;
}
