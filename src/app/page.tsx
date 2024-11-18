import MarkdownEditor from '@/components/MarkdownEditor';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            Markdown to PDF
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Transform your Markdown into beautiful PDFs in seconds
          </p>
        </div>
        <MarkdownEditor />
      </div>
    </main>
  );
}
