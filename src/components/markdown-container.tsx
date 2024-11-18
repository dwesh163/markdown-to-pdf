'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { FileDown, FileText, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MarkdownEditor } from './markdown-editor';
import { MarkdownPreview } from './markdown-preview';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Input } from './ui/input';
import { zIndex } from 'html2canvas/dist/types/css/property-descriptors/z-index';

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
	const { toast } = useToast();

	useEffect(() => {
		setTitle(markdown.split('\n')[0].replace('#', '').trim() + '.pdf');
	}, [markdown]);

	const handleExport = async () => {
		const element = document.querySelector('.preview-content') as HTMLElement;

		if (!element) {
			toast({
				title: 'Error',
				description: 'Preview content not found.',
				variant: 'destructive',
			});
			return;
		}

		try {
			toast({
				title: 'Generating PDF...',
				description: 'Please wait while we prepare your document.',
			});

			// Clone the element for rendering
			const clonedElement = element.cloneNode(true) as HTMLElement;

			// Adjust styles for the cloned element
			Object.assign(clonedElement.style, {
				padding: '4rem 5rem',
				width: `${element.scrollWidth}px`,
				height: 'auto',
				position: 'absolute',
				zIndex: '-9999',
				top: '0',
				left: '0',
				overflowWrap: 'break-word', // Ensure text wraps properly
				wordBreak: 'break-word',
				whiteSpace: 'normal',
			});

			// Append to body for rendering
			document.body.appendChild(clonedElement);

			const canvas = await html2canvas(clonedElement, {
				scale: 0.75, // Higher scale for better resolution
				useCORS: true,
				logging: false,
				width: clonedElement.scrollWidth,
				height: clonedElement.scrollHeight,
			});

			// Remove the cloned element after rendering
			document.body.removeChild(clonedElement);

			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 210; // A4 width in mm
			const pageHeight = 297; // A4 height in mm
			const imgHeight = (canvas.height * imgWidth) / canvas.width;

			let heightLeft = imgHeight;
			let position = 0;

			const imgData = canvas.toDataURL('image/png');
			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

			// Handle multi-page PDF generation
			heightLeft -= pageHeight;
			while (heightLeft > 0) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}

			pdf.save(title.endsWith('.pdf') ? title : `${title}.pdf`);

			toast({
				title: 'Success!',
				description: 'Your PDF has been generated.',
			});
		} catch (error) {
			console.error('PDF generation failed:', error);
			toast({
				title: 'Error',
				description: 'Failed to generate PDF. Please try again.',
				variant: 'destructive',
			});
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
					<Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600">
						<FileDown className="w-4 h-4 mr-2" />
						Export PDF
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
						<Input value={title} onChange={(e) => setTitle(e.target.value)} className="w-1/4 -mt-3" />
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
