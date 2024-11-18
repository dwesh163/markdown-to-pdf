'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarkdownEditor } from './markdown-editor';
import { MarkdownPreview } from './markdown-preview';
import { Input } from './ui/input';

const defaultMarkdown = `# Welcome to Our Markdown Editor

## Features
✨ Live preview with instant rendering
📱 Responsive design that works on all devices
🌙 Beautiful dark mode support
🎨 Syntax highlighting for code blocks
📥 Export to PDF with one click

## Example Content

### Text Formatting
You can write in **bold**, *italic*, or ~~strikethrough~~.

### Lists
1. First item
2. Second item
3. Third item

### Code Blocks
\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
\`\`\`

### Blockquotes
> "The best way to predict the future is to invent it." - Alan Kay

### Links
Visit [our website](https://example.com) for more information.
`;

export function MarkdownContainer() {
	const [markdown, setMarkdown] = useState(defaultMarkdown);
	const [title, setTitle] = useState('document.pdf');
	const [isExporting, setIsExporting] = useState(false);
	const { toast } = useToast();

	useEffect(() => {
		const firstLine = markdown.split('\n')[0];
		const cleanTitle = firstLine.replace(/#/g, '').trim();
		setTitle(cleanTitle ? `${cleanTitle}.pdf` : 'document.pdf');
	}, [markdown]);

	const handleExport = async () => {
		if (isExporting) return;

		try {
			setIsExporting(true);
			toast({
				title: 'Generating PDF...',
				description: 'Please wait while we prepare your document.',
			});

			// Call the API endpoint
			const response = await fetch('/api/export-pdf', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ markdown }),
			});

			if (!response.ok) {
				throw new Error('Failed to generate PDF');
			}

			// Get the PDF blob
			const pdfBlob = await response.blob();

			// Create download link
			const url = window.URL.createObjectURL(pdfBlob);
			const link = document.createElement('a');
			link.href = url;
			link.download = title.endsWith('.pdf') ? title : `${title}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);

			toast({
				title: 'Success',
				description: 'PDF has been generated and downloaded.',
			});
		} catch (error) {
			console.error('PDF generation failed:', error);
			toast({
				title: 'Error',
				description: 'Failed to generate PDF. Please try again.',
				variant: 'destructive',
			});
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
			<div className="p-6">
				<div className="flex justify-between items-center mb-6">
					<div className="flex items-center space-x-3">
						<FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
						<h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Editor</h2>
					</div>
					<Button onClick={handleExport} disabled={isExporting} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
						<FileDown className="w-4 h-4 mr-2" />
						{isExporting ? 'Exporting...' : 'Export PDF'}
					</Button>
				</div>

				<Tabs defaultValue="edit" className="w-full">
					<div className="flex justify-between items-center">
						<TabsList className="mb-4 bg-gray-100 dark:bg-gray-800 p-1">
							<TabsTrigger value="edit" className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
								<FileText className="w-4 h-4 mr-2" />
								Edit
							</TabsTrigger>
							<TabsTrigger value="preview" className="flex items-center data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900">
								<Eye className="w-4 h-4 mr-2" />
								Preview
							</TabsTrigger>
						</TabsList>
						<Input value={title} onChange={(e) => setTitle(e.target.value)} className="w-1/4 -mt-3" placeholder="Document title" />
					</div>

					<TabsContent value="edit">
						<MarkdownEditor value={markdown} onChange={setMarkdown} />
					</TabsContent>

					<TabsContent value="preview">
						<MarkdownPreview markdown={markdown} />
					</TabsContent>
				</Tabs>
			</div>
		</Card>
	);
}
