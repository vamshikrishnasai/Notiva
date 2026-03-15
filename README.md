# Notiva 2.0 ✨
**Your AI-Powered Second Brain**

Notiva is a modern, premium SaaS productivity platform and knowledge management tool designed to act as your intelligent "Second Brain". It combines a beautiful, Notion-like user interface with a powerful Retrieval-Augmented Generation (RAG) AI backend. 

With Notiva, you can seamlessly organize notes, capture research, attach files, extract web URLs, and then dynamically chat with an AI that specifically understands *your* entire personal knowledge base.

---

## 🌟 Key Features

- **Intelligent Notebook Hierarchy**: Organize effortlessly with an intuitive nested structure (Notebook → Section → Page).
- **RAG AI Chat Panel**: A floating chat assistant that answers direct questions securely based **only** on the context of the notes you have written (Powered by Google Gemini + ChromaDB Vector Search).
- **Smart Editor AI Actions**: Instantly summarize notes into key bullet points, rewrite blocks for logical flow, or auto-generate categorization #tags with one click.
- **Multilingual Support**: Real-time translation into 50+ languages directly inside the editor.
- **File Upload & URL Web Scraping**: Ingest rich data. Drop a URL to scrape its readable text, or upload `.pdf`, `.docx`, `.txt`, and `.csv` files straight into your editor.
- **Voice Dictation & Text-to-Speech**: Speak your notes directly into the page via browser Speech Recognition, or click 'Play' to have the AI dictate your documents back to you.
- **Premium UI/UX Design**: Built with a company-grade design system, smooth Framer Motion animations, dark mode, and a completely distraction-free workspace.

---

## 🏗 Architecture & Design Philosophy

### Portable Architecture
Notiva is built with clear separation of concerns, allowing for swappable components at each layer:
- **Frontend Layer:** A decoupled Next.js/React application that interacts strictly via REST APIs, allowing it to be hosted anywhere (Vercel, Netlify, Render).
- **Backend API Layer:** A stateless FastAPI application that handles business logic and orchestration.
- **Data Persistence Layer:** Uses SQLAlchemy, enabling seamless switching between SQLite for local edge testing and robust PostgreSQL for production.
- **Vector Retrieval Layer:** Employs ChromaDB, which can run ephemerally, persistently on disk, or as a standalone Docker service for vector similarity search.
- **AI Processing Layer:** A modular `gemini_service.py` engine that primarily routes through Google Gemini but supports transparent fallback to Mistral API if rate limits are hit.

### Principles-Based UX
Our AI interaction patterns are guided by 4 core design principles:
1. **Context Isolation:** AI answers must be explicitly constrained to the user's specific note contexts to prevent hallucinations and establish absolute trust.
2. **Frictionless Ingestion:** Knowledge should flow into the system effortlessly—whether through typing, uploading documents, scraping URLs, or voice dictation.
3. **Progressive Disclosure:** Advanced AI features (like RAG chat or logical flow restructuring) are tucked into secondary panels or toolbars so they don't clutter the primary writing experience.
4. **Immediate Feedback:** All interactions, from saving a note to extracting keywords, should feel instantaneous with optimistic UI patterns and soft loading states.

### Agent Thinking
Notiva incorporates automated "agentic" thinking to maintain and improve the system over time:
- **Auto-Summarization:** Every time a note is saved, a background process evaluates the content and transparently generates a clean summary to optimize future UI rendering.
- **Self-Healing Vectors:** Hooking into the FastAPI lifespan, the backend automatically scans the SQL database on boot, identifies missing or wiped vectors (common in ephemeral cloud deployments), and resynchronizes ChromaDB in bulk without user intervention.
- **Dynamic Context Scaling:** The RAG query engine mathematically adjusts its embedding retrieval depth (`n_results`) based on the live size of the user's database to prevent vector mathematically errors on new accounts.

### Infrastructure Mindset
The entire Notiva engine is designed with an API-first infrastructure mindset:
- **Extensible Endpoints:** Features like `/query/bullets`, `/query/flow`, and `/query/tags` are exposed as standalone REST endpoints, meaning they can be triggered from anywhere.
- **Embeddable Capabilities:** Because the backend is entirely decoupled and well-documented (via Swagger UI at `/docs`), the Notiva memory engine and RAG Chat could easily be injected into third-party tools, browser extensions, or embeddable web widgets.

---

## 💻 Tech Stack

### Frontend (`/my-app`)
- **Framework:** Next.js 14 (App Router) / React 18
- **Language:** TypeScript
- **Styling:** Vanilla CSS Design System + Tailwind Utils + CSS Variables
- **UI & Animation:** Framer Motion, Lucide React Icons
- **Data Fetching:** Axios, use-local-storage-state

### Backend (`/Backend`)
- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL (via SQLAlchemy ORM & psycopg2)
- **Vector Database:** ChromaDB (for intelligent RAG retrieval)
- **AI Engine:** Google Gemini API (`gemini-2.5-flash`) + Mistral Fallback
- **Utilities:** BeautifulSoup4 (Web Scraping), PyPDF2, python-docx

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (3.11+)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (Primary AI Engine)
- A [Mistral API Key](https://console.mistral.ai/) (Fallback AI Engine)

### 2. Backend Setup
Navigate to the `Backend` directory and install the required dependencies:
```bash
cd Backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `Backend` directory and add your API keys and Database URL:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/notivadb
```

### 3. Docker, PostgreSQL & ChromaDB Setup
For production or robust local development, Notiva uses **PostgreSQL** for relational data (users/notes metadata) and **ChromaDB** for vector embeddings.

You can easily spin up the required PostgreSQL database using the provided `docker-compose.yml` file:
```bash
# In the Backend directory
docker-compose up -d
```
*Note: ChromaDB can run entirely in-memory or persist locally as a file out-of-the-box via the Python client, but you can also route it through a dedicated Docker container if your infrastructure requires standalone vector scaling.*

Start the FastAPI server:
```bash
uvicorn app.main:app --reload
```
*The backend will be running at `http://127.0.0.1:8000`*
*You can view the custom beautiful API Documentation at `http://127.0.0.1:8000/docs`*

### 4. Frontend Setup
Open a new terminal, navigate to the `my-app` directory, and install dependencies:
```bash
cd my-app
npm install
```

Create a `.env` file in the `my-app` directory to connect it to the Backend:
```env
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
```

Start the Next.js development server:
```bash
npm run dev
```
*The frontend will be running at `http://localhost:3000` (or `3005` if 3000 is occupied).*

---

## 🤝 How to Use Notiva: A Quick Guide

### 1. Structure Your Knowledge
When you first open Notiva, start by establishing your core structure.
- **Notebooks:** In the left sidebar, click the `+` icon next to 'Notebooks' to create broad categories (e.g., "Engineering", "Personal", "Research").
- **Sections:** Hover over a created Notebook in the sidebar and click the `+` icon that appears to create a Section (e.g., "System Design", "Daily Journals"). This keeps your notes highly organized.
- **Notes:** Click the `+` icon on any Section to instantly spawn a new note inside that category.

### 2. Capture and Edit Information
- **Writing:** Start typing in your newly created note. Change the font style from the top toolbar to personalize your workspace.
- **Web Scraping:** Change the Note Type (under the title) to **Link**, paste a URL into the new input box, and let the app scrape the readable text directly into your note securely.
- **File Ingestion:** Change the Note Type to **Article** or **Research**, click the Upload button, and extract text from your PDFs, Word Docs, or PDFs.
- **Voice Dictation:** Running out of time? Click the microphone icon 🎤 in the toolbar and simply speak your ideas into the editor.

### 3. Leverage AI Formatting
Highlight your text and use the magic buttons located in the top toolbar:
- Click **Points** to let the AI instantly read your paragraphs and append a succinct bulleted summary.
- Click **Flow** to let the AI rewrite and restructure your text logically.
- Click **Tags** to have the AI analyze your note and automatically generate relevant `#tags` for organization.
- Need a translation? Use the language dropdown in the toolbar and hit the **Translate** button to magically convert your entire document text into any of 50+ languages!

### 4. Chat with Your Second Brain
This is where Notiva gets powerful.
- **Notiva AI Panel:** Click the "Notiva AI ✨" button at the bottom of the left sidebar.
- **Ask Anything:** Ask a question like, *"What are the key takeaways from my System Design note about databases?"*
- **How it Works:** The backend instantly searches its built-in ChromaDB vector store, retrieves *your* specific notes related to "databases", and feeds them to Gemini (or Mistral as a safety fallback) to synthesize a direct, highly-accurate answer based *only* on what you've documented.

---

## 📜 License
This project is open source and available under the [MIT License](LICENSE).
