import os
from app.services.embedding_service import collection

def test():
    count = collection.count()
    print(f"Total documents in ChromaDB: {count}")
    if count > 0:
        results = collection.get()
        print(f"Sample docs: {results['documents'][:2]}")
        
    # Test a query
    results = collection.query(query_texts=["hello"], n_results=1)
    print(f"Query results: {results}")

if __name__ == "__main__":
    test()
