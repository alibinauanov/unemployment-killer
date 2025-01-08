from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from PyPDF2 import PdfReader
from docx import Document
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)  # Enable CORS for communication with the frontend

# Directory to temporarily store uploaded files
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the pretrained model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Function to extract text from a file
def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    if ext == ".pdf":
        reader = PdfReader(file_path)
        for page in reader.pages:
            text += page.extract_text()
    elif ext == ".docx":
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    elif ext == ".txt":
        with open(file_path, 'r', encoding='utf-8') as file:
            text = file.read()
    else:
        raise ValueError("Unsupported file format.")
    return text

# Function to calculate semantic similarity
def calculate_similarity(resume_text, job_description_text):
    # Generate embeddings for the texts
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)
    job_description_embedding = model.encode(job_description_text, convert_to_tensor=True)
    
    # Compute cosine similarity
    similarity_score = util.cos_sim(resume_embedding, job_description_embedding).item()
    return round(similarity_score * 100, 2)  # Convert to percentage

@app.route("/")
def home():
    return "<h1>Welcome to the Resume Analyzer API</h1><p>Use the /analyze endpoint to process requests.</p>"

@app.route("/analyze", methods=["POST"])
def analyze():
    resume_text = ""
    job_description_text = request.form.get("job_description", "").strip()

    # Handle file upload for the resume
    if "resume" in request.files:
        file = request.files["resume"]
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(file_path)
        try:
            resume_text = extract_text_from_file(file_path)
        except ValueError as e:
            return jsonify({"error": str(e)}), 400
        finally:
            os.remove(file_path)  # Clean up the uploaded file
    elif "resume_text" in request.form:
        resume_text = request.form["resume_text"].strip()

    # Check for missing input
    if not resume_text:
        return jsonify({"error": "Resume is missing."}), 400
    if not job_description_text:
        return jsonify({"error": "Job description is missing."}), 400

    # Perform semantic similarity analysis
    similarity_score = calculate_similarity(resume_text, job_description_text)
    return jsonify({
        "similarity_score": similarity_score,
        "message": f"The resume matches {similarity_score}% with the job description."
    })

if __name__ == "__main__":
    app.run(debug=True, port=5000)
