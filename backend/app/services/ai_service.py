import json
import os
from openai import OpenAI

class AIService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if self.api_key:
            base_url = None
            if self.api_key.startswith("sk-or-v1"):
                base_url = "https://openrouter.ai/api/v1"
            
            self.client = OpenAI(api_key=self.api_key, base_url=base_url)
        else:
            self.client = None

    def structure_resume(self, text: str):
        """
        Takes raw text and converts it to structured JSON for the resume.
        """
        if not self.client:
            print("No OpenAI API Key found. Returning mock data.")
            return self._get_mock_data()

        prompt = f"""
        You are an expert Resume Architect. Extract the following information from the text below 
        and return it in strict JSON format matching this schema:
        {{
            "user_info": {{
                "name": "Full Name",
                "links": ["link1", "link2"],
                "summary": "Professional summary..."
            }},
            "education": [
                {{
                    "institution": "University Name",
                    "degree": "Degree Name",
                    "dates": "Year - Year",
                    "location": "City, State"
                }}
            ],
            "experience": [
                {{
                    "company": "Company Name",
                    "role": "Job Title",
                    "dates": "Start - End",
                    "location": "City, State",
                    "bullets": ["Achievement 1", "Achievement 2"]
                }}
            ],
            "skills": ["Skill 1", "Skill 2"],
            "projects": [
                 {{
                    "name": "Project Name",
                    "description": "Short description",
                    "technologies": ["Tech 1", "Tech 2"]
                 }}
            ]
        }}

        RAW TEXT:
        {text[:4000]} 
        """
        # Truncating text to 4000 chars to avoid token limits for this simple test

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that outputs JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"OpenAI API Error: {e}")
            return self._get_mock_data()

    def _get_mock_data(self):
        """Returns dummy data if no API key is present."""
        return {
            "user_info": {
                "name": "Shashank HU",
                "links": ["linkedin.com/in/shashankhu", "github.com/artisticshashank"],
                "summary": "Dedicated engineering student at Malnad College of Engineering with expertise in Cloud Applications and Flutter."
            },
            "education": [
                {
                    "institution": "Malnad College of Engineering",
                    "degree": "Bachelor of Engineering",
                    "dates": "Exp. June 2028",
                    "location": "Hassan, Karnataka"
                }
            ],
            "experience": [
                {
                    "company": "CodeX.mce",
                    "role": "Board Member",
                    "dates": "Oct 2024 - Present",
                    "location": "Hassan, Karnataka",
                    "bullets": [
                        "Organized community events and workshops.",
                        "Collaborated with peers to inspire future engineers."
                    ]
                }
            ],
            "skills": ["Flutter", "Java", "HTML5", "CSS", "Cloud Applications"],
             "projects": [
                 {
                    "name": "LinkToTeX",
                    "description": "Automated Resume Architect that converts LinkedIn PDFs to polished LaTeX resumes.",
                    "technologies": ["Python", "Next.js", "OpenAI"]
                 }
            ]
        }
