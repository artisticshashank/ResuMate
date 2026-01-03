import pdfplumber
import sys

def extract_text_from_pdf(pdf_path):
    print(f"Opening PDF: {pdf_path}")
    text_content = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                print(f"Processing Page {i+1}...")
                text = page.extract_text()
                if text:
                    text_content += f"--- Page {i+1} ---\n{text}\n\n"
        
        return text_content
    except Exception as e:
        return f"Error opening PDF: {str(e)}"

if __name__ == "__main__":
    pdf_file = r"../Profile (2).pdf" # Path relative to backend folder
    extracted_text = extract_text_from_pdf(pdf_file)
    
    output_file = "extraction_output.txt"
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(extracted_text)
        print(f"Successfully wrote extracted text to {output_file}")
    except Exception as e:
        print(f"Error writing to file: {e}")
