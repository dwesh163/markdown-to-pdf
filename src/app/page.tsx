import { MarkdownContainer } from '@/components/markdown-container';
import { FileText } from 'lucide-react';

export default function Home() {
	return (
		<main className="min-h-screen bg-[#f8fafc] dark:bg-gray-950">
			<div className="container mx-auto px-4 py-12">
				<div className="mb-12 text-center space-y-4">
					<div className="flex items-center justify-center space-x-3">
						<FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
						<h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">Markdown to PDF</h1>
					</div>
					<p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Transform your Markdown into professionally styled PDFs with our powerful converter. Edit in real-time and export with a single click.</p>
				</div>
				<MarkdownContainer />
			</div>
		</main>
	);
}
