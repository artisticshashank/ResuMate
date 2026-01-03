from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import pdfplumber

app = FastAPI(title="LinkToTeX API")

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "LinkToTeX API is running"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Simple extraction (moved from prototype)
    text_content = ""
    try:
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    text_content += text + "\n\n"
    except Exception as e:
        return {"error": str(e)}

    # AI Structure
    from app.services.ai_service import AIService
    # Injecting provided key
    api_key = "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"
    ai_service = AIService(api_key=api_key) 
    structured_data = ai_service.structure_resume(text_content)

    # LaTeX Generation
    from app.services.latex_service import LatexService
    latex_service = LatexService()
    try:
        tex_content = latex_service.generate_tex(structured_data)
        pdf_path = latex_service.compile_pdf(tex_content)
        pdf_url = f"http://localhost:8000/{pdf_path}" # Naive URL construction
    except Exception as e:
        tex_content = f"Error generating TeX/PDF: {e}"
        pdf_url = None

    return {
        "filename": file.filename,
        "extracted_text_preview": text_content[:500],
        "structured_data": structured_data,
        "generated_tex": tex_content,
        "pdf_url": pdf_url
    }

# Mount static files to serve generated PDFs
from fastapi.staticfiles import StaticFiles
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
