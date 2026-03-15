import os
import requests
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def _fallback_summary(content: str) -> str:
    clean = " ".join(content.split())
    if len(clean) <= 180:
        return clean
    return clean[:177].rstrip() + "..."


def _run_ai_prompt(prompt: str) -> str:
    """Try Gemini first, then fallback to Mistral AI."""
    
    
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(GEMINI_MODEL)
            response = model.generate_content(prompt)
            text = response.text or ""
            if text.strip():
                return text.strip()
        except google_exceptions.ResourceExhausted as e:
            print(f"Gemini quota exceeded: {e}. Falling back to Mistral.")
        except Exception as e:
            print(f"Gemini generation failed: {e}. Falling back to Mistral.")
    else:
         print("Gemini API key is not configured. Falling back to Mistral.")

   
    if not MISTRAL_API_KEY:
        raise RuntimeError("Both Gemini failed/no-key and MISTRAL_API_KEY is not configured.")
    
    url = "https://api.mistral.ai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {MISTRAL_API_KEY}"
    }
    data = {
        "model": "mistral-small-latest",
        "messages": [{"role": "user", "content": prompt}]
    }
    
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    
    return response.json()["choices"][0]["message"]["content"].strip()


def summarize_note(content: str) -> str:
    try:
        summary = _run_ai_prompt(f"Summarize this note: {content}")
        return summary or _fallback_summary(content)
    except Exception as e:
        print(f"Summarize failed: {e}")
        return _fallback_summary(content)


def answer_question(context: str, question: str) -> str:
    try:
        prompt = f"""You are Notiva Assistance, a conversational AI connected to my personal knowledge base (notes, articles, links). 
Answer the following question in a friendly, conversational tone using *only* the context provided below. 
Do not recite the context back to me. Just extract the answer and present it clearly.
You can perform summarization, formatting, or transformation on the context if asked.
If the context does not contain the answer, reply politely that you don't have that information in the current notes. Do not guess or use outside knowledge.

<Context>
{context if context else "No notes found in your database yet."}
</Context>

Question: {question}
"""
        return _run_ai_prompt(prompt)
    except RuntimeError as e:
        if "MISTRAL_API_KEY" in str(e):
             return "Notiva AI Quota Exceeded or Not Configured. Please check your API keys."
        return "I am currently unable to process requests. Please try again later."
    except Exception as e:
        print(f"Answer failed: {e}")
        return "I am currently unable to process requests. Please try again later."


def bullet_points(content: str) -> str:
    try:
        prompt = f"Summarize the following text into concise key bullet points:\n\n{content}"
        return _run_ai_prompt(prompt)
    except Exception as e:
        return f"Error generating bullet points: {str(e)}"


def create_flow(content: str) -> str:
    try:
        prompt = f"Analyze the following text and convert it into a structured, step-by-step logical flow or sequence of actions:\n\n{content}"
        return _run_ai_prompt(prompt)
    except Exception as e:
        return f"Error generating flow: {str(e)}"


def generate_tags(content: str) -> str:
    try:
        prompt = f"Extract exactly 5 concise, comma-separated keywords or tags for the following text. Respond ONLY with the comma-separated words, nothing else:\n\n{content}"
        return _run_ai_prompt(prompt)
    except Exception as e:
        return f"Error generating tags: {str(e)}"

def extract_main_content(content: str) -> str:
    try:
        prompt = f"Analyze the following scraped web page text. Extract and format ONLY the main, relevant content (like the article body, primary information, or core topic). Ignore navigation menus, footers, sidebars, ads, cookie notices, and other irrelevant boilerplate. Return the extracted meaningful content in clean Markdown format:\n\n{content}"
        return _run_ai_prompt(prompt)
    except Exception as e:
        return f"Error extracting main content: {str(e)}"

def translate_content(content: str, target_language: str) -> str:
    try:
        prompt = f"Translate the following text into {target_language}. Maintain the original meaning, tone, and formatting (such as Markdown styling). Output ONLY the translated text without any conversational preamble or surrounding explanations:\n\n{content}"
        return _run_ai_prompt(prompt)
    except Exception as e:
        return f"Error translating content: {str(e)}"