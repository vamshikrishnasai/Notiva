HTML_CONTENT = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notiva 2.0 — Official Documentation</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #f8f9fc;
            --text-main: #0f0f23;
            --text-muted: #4a4a6a;
            --accent: #6366f1;
            --accent-bg: #eef0fb;
            --border: #e4e4f0;
            --card-bg: #ffffff;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text-main);
            line-height: 1.7;
            padding: 0;
            margin: 0;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 20px;
        }
        header {
            text-align: center;
            margin-bottom: 60px;
        }
        h1, h2, h3 {
            font-family: 'Syne', sans-serif;
            letter-spacing: -0.02em;
        }
        header h1 {
            font-size: 3rem;
            color: var(--accent);
            margin-bottom: 10px;
        }
        header p {
            font-size: 1.2rem;
            color: var(--text-muted);
        }
        .section {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 16px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
        }
        .section h2 {
            font-size: 1.8rem;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid var(--border);
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .section h3 {
            font-size: 1.3rem;
            margin: 25px 0 10px;
            color: var(--accent);
        }
        p {
            margin-bottom: 16px;
            color: var(--text-muted);
        }
        ul {
            margin-bottom: 20px;
            padding-left: 20px;
            color: var(--text-muted);
        }
        li {
            margin-bottom: 8px;
        }
        .endpoint {
            background: var(--bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }
        .method {
            display: inline-block;
            background: var(--accent);
            color: white;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-right: 10px;
        }
        .method.get { background: #10b981; }
        .method.post { background: #6366f1; }
        .method.put { background: #f59e0b; }
        .method.delete { background: #ef4444; }
        .path {
            font-family: monospace;
            font-size: 1.1rem;
            color: var(--text-main);
            font-weight: 500;
        }
        code {
            background: var(--accent-bg);
            color: var(--accent);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
        }
        .note {
            background: var(--accent-bg);
            border-left: 4px solid var(--accent);
            padding: 15px 20px;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
            color: #3b3c5a;
        }
        .interactive-link {
            display: inline-block;
            margin-top: 10px;
            padding: 10px 20px;
            background: var(--text-main);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: opacity 0.2s;
        }
        .interactive-link:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Notiva Documentation</h1>
            <p>Your AI-Powered Second Brain — Architecture, Features, and API</p>
            <a href="/api-docs" class="interactive-link">View Interactive Swagger API</a>
        </header>

        <div class="section">
            <h2>✨ What is Notiva?</h2>
            <p>Notiva is an advanced SaaS productivity platform and knowledge management tool designed to be your intelligent "Second Brain". It combines a stunning Notion-like interface with a powerful Retrieval-Augmented Generation (RAG) backend.</p>
            <p>With Notiva, you can seamlessly organize notes, capture research, attach files, extract URLs, and then dynamically chat with an AI that specifically understands <strong>your</strong> entire knowledge base.</p>
        </div>

        <div class="section">
            <h2>💻 Technology Stack</h2>
            <h3>Frontend (Web App)</h3>
            <ul>
                <li><strong>Framework:</strong> Next.js 14, React 18, TypeScript</li>
                <li><strong>Styling:</strong> Vanilla CSS Design System + Tailwind Utils, CSS Variables for Dark/Light Themes</li>
                <li><strong>UI & Animation:</strong> Framer Motion, Lucide React Icons</li>
                <li><strong>Data Fetching:</strong> Axios with local state persistence (use-local-storage-state)</li>
            </ul>

            <h3>Backend (API & AI)</h3>
            <ul>
                <li><strong>Framework:</strong> FastAPI (Python 3.10+)</li>
                <li><strong>Database:</strong> SQLite with SQLAlchemy (ORM)</li>
                <li><strong>Vector Store:</strong> ChromaDB (for intelligent RAG retrieval)</li>
                <li><strong>AI Engine:</strong> Google Gemini API (gemini-2.5-flash)</li>
                <li><strong>Utilities:</strong> BeautifulSoup (Web Scraping), PyPDF2/python-docx (File Processing)</li>
            </ul>
        </div>

        <div class="section">
            <h2>🚀 Core Features & How to Use Them</h2>
            
            <h3>1. Intelligent Notebook Hierarchy</h3>
            <p><strong>How to use:</strong> In the sidebar, click the <code>+</code> icon next to 'Notebooks' to create a high-level folder (e.g., 'Work'). Hover over the notebook and click the <code>+</code> button to create a Section (e.g., 'Engineering'). Inside the section, create standard notes. Notiva handles the nested grouping automatically using note tags!</p>

            <h3>2. RAG AI Chat (Your Second Brain)</h3>
            <p><strong>How to use:</strong> Click the "Notiva AI" button at the bottom left. Ask questions like <i>"What did I write about the Q3 roadmap?"</i>. The backend triggers a semantic vector search across all your saved notes via ChromaDB, pulling exactly the context needed before passing it to Gemini AI for a synthesis.</p>

            <h3>3. Editor AI Tools</h3>
            <p><strong>How to use:</strong> Highlight or just click inside your text editor, and hit one of the top toolbar options: <code>Points</code>, <code>Flow</code>, or <code>Tags</code>. The AI will read your current note and instantly append a structured summary, logical restructuring, or auto-generate #tags for categorization.</p>

            <h3>4. File Upload & URL Scraping</h3>
            <p><strong>How to use:</strong> Change your note <code>Type</code> property below the title. Select <strong>Link</strong> to reveal a URL input box that scrapes web pages directly into your note text. Select <strong>Article</strong> or <strong>Research</strong> to reveal an Upload button that extracts raw text from PDF, DOCX, TXT, or CSV files.</p>

            <h3>5. Voice Input & Text-to-Speech</h3>
            <p><strong>How to use:</strong> Click the 🎤 icon in the toolbar. Speak aloud to dictate notes directly into the editor using the Web Speech API. Click the ▶️ Play button to have the system read your existing notes back to you aloud, with auto-detected multilingual support.</p>
        </div>

        <div class="section">
            <h2>📡 API Endpoints</h2>
            <div class="note">
                Base URL is <code>http://127.0.0.1:8000</code>. All routes return JSON. Fully interactive Swagger documentation is hosted at <code>/api-docs</code>.
            </div>

            <h3>Notes Router <code>/notes</code></h3>
            
            <div class="endpoint">
                <span class="method get">GET</span> <span class="path">/notes/</span>
                <p>Retrieves a list of all notes. Supports query parameters <code>skip</code>, <code>limit</code>, <code>type</code>, and <code>search</code>.</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <span class="path">/notes/</span>
                <p>Creates a new note. Expects JSON body with <code>title</code>, <code>content</code>, and optional metadata. Triggers automatic vector embedding in ChromaDB.</p>
            </div>
            <div class="endpoint">
                <span class="method put">PUT</span> <span class="path">/notes/{note_id}</span>
                <p>Updates an existing note by ID. Also updates the ChromaDB vector embeddings to keep the AI knowledge synchronized.</p>
            </div>
            <div class="endpoint">
                <span class="method delete">DELETE</span> <span class="path">/notes/{note_id}</span>
                <p>Permanently deletes a note from both the SQL database and the vector store.</p>
            </div>

            <h3>Query Action Router <code>/query</code></h3>

            <div class="endpoint">
                <span class="method post">POST</span> <span class="path">/query/ask</span>
                <p>The core RAG endpoint. Expects <code>{ "question": "..." }</code>. Searches ChromaDB for relevant notes, injects them as context to the Gemini LLM, and returns the AI's intelligent answer.</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <span class="path">/query/bullets</span>
                <p>Generates concise bullet points summarizing the provided raw text payload.</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <span class="path">/query/tags</span>
                <p>Analyzes text and returns 3-5 relevant concise categorization tags in the format "#tag".</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <span class="path">/query/translate</span>
                <p>Translates text to a specified <code>target_language</code> via AI context.</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <span class="path">/query/upload</span>
                <p>Accepts a <code>multipart/form-data</code> file upload. Uses various parsers (PyPDF, docx, bs4) to extract string text and returns it to the frontend.</p>
            </div>
            <div class="endpoint">
                <span class="method post">POST</span> <span class="path">/query/scrape</span>
                <p>Accepts a URL and fetches the raw text contents of the web page.</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
