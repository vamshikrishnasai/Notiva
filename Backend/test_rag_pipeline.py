import os
import requests
import json
import time

API_BASE = "http://127.0.0.1:8000"

def test():
    # 1. Create a note
    payload = {
        "title": "My Favorite Color",
        "content": "My absolute favorite color in the whole world is neon pink.",
        "type": "note"
    }
    r = requests.post(f"{API_BASE}/notes/", json=payload)
    print("Create:", r.status_code, r.text)
    
    # 2. Add a delay so it embeds
    time.sleep(1)
    
    # 3. Ask RAG
    q_payload = {"question": "What is my favorite color?"}
    r = requests.post(f"{API_BASE}/query/ask", json=q_payload)
    print("Ask RAG:", r.status_code, r.text)

if __name__ == "__main__":
    test()
