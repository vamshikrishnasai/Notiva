import requests
url = "http://127.0.0.1:8000/query/ask"
response = requests.post(url, json={"question": "who is vamshi?"})
print(response.json())
