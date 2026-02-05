import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
import torch
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("embedding-service")

app = FastAPI(title="VaultSight Embedding Service")

# Model configuration
MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
device = "cuda" if torch.cuda.is_available() else "cpu"

logger.info(f"Loading model: {MODEL_NAME} on {device}...")
try:
    model = SentenceTransformer(MODEL_NAME, device=device)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise RuntimeError(f"Could not load SentenceTransformer model: {str(e)}")

class TextInput(BaseModel):
    text: str

class BatchInput(BaseModel):
    texts: list[str]

@app.post("/embed")
async def embed_text(input: TextInput):
    try:
        if not input.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        embedding = model.encode(input.text).tolist()
        return { 
            "embedding": embedding, 
            "dimensions": len(embedding),
            "model": MODEL_NAME
        }
    except Exception as e:
        logger.error(f"Embedding error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed-batch")
async def embed_batch(input: BatchInput):
    try:
        if not input.texts:
            raise HTTPException(status_code=400, detail="Texts list cannot be empty")
            
        embeddings = model.encode(input.texts).tolist()
        return { 
            "embeddings": embeddings,
            "count": len(embeddings),
            "model": MODEL_NAME
        }
    except Exception as e:
        logger.error(f"Batch embedding error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return { 
        "status": "ok", 
        "model": MODEL_NAME, 
        "device": device,
        "is_gpu": torch.cuda.is_available() 
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

