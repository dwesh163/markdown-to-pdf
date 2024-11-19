import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

const escapeScriptTags = (markdown: string): string => markdown.replace(/<script/g, '&lt;script').replace(/<\/script>/g, '&lt;/script&gt;');

const markdownToPdfHtml = (markdown: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #3c3c43;
      margin: 0;
      padding: 2pt 1pt;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 20pt; font-weight: 600; margin-bottom: 16pt; }
    h2 { font-size: 16pt; font-weight: 600; margin-top: 16pt; margin-bottom: 12pt; }
    h3 { font-size: 14pt; font-weight: 600; margin-top: 14pt; margin-bottom: 10pt; }
    p { margin-bottom: 10pt; }
    ul, ol { margin-bottom: 10pt; padding-left: 20pt; }
    li { margin-bottom: 4pt; }
    pre {
      background-color: #f5f5f5;
      padding: 8pt;
      margin-bottom: 10pt;
      border-radius: 4pt;
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      overflow-x: auto;
    }
    code {
      font-family: 'Courier New', monospace;
      font-size: 10pt;
      background-color: #f5f5f5;
      border-radius: 2pt;
    }
    blockquote {
      border-left: 4pt solid #e0e0e0;
      margin-left: 0;
      padding-left: 10pt;
      font-style: italic;
    }
    a { color: #0066cc; }
    img { max-width: 100%; height: auto; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10pt;
    }
    th, td {
      border: 1pt solid #e0e0e0;
      padding: 6pt;
      text-align: left;
    }
    th { background-color: #f5f5f5; font-weight: 600; }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.2/marked.min.js"></script>
</head>
<body>
  <div id="content"></div>
  <script>
    const markdown = ${JSON.stringify(markdown)};
    document.getElementById('content').innerHTML = marked.parse(markdown);
  </script>
</body>
</html>
`;

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const { markdown } = data;
		const escapedMarkdown = escapeScriptTags(markdown);
		const browser = await puppeteer.launch({
			headless: true,
			executablePath: '/usr/bin/chromium-browser',
			args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-setuid-sandbox', '--disable-gpu'],
		});

		const page = await browser.newPage();

		await page.setContent(markdownToPdfHtml(escapedMarkdown));

		await page.waitForFunction('document.getElementById("content").innerHTML !== ""');

		const pdf = await page.pdf({
			format: 'A4',
			margin: {
				top: '20px',
				right: '30px',
				bottom: '20px',
				left: '30px',
			},
			printBackground: true,
			preferCSSPageSize: true,
		});

		await browser.close();

		return new NextResponse(pdf, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': 'attachment; filename=document.pdf',
			},
		});
	} catch (error) {
		console.error('PDF generation error:', error);
		return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
	}
}
