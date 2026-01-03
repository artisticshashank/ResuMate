import os
import jinja2

class LatexService:
    def __init__(self, template_dir="templates"):
        self.template_loader = jinja2.FileSystemLoader(searchpath=template_dir)
        self.template_env = jinja2.Environment(
            loader=self.template_loader,
            block_start_string='\BLOCK{',
            block_end_string='}',
            variable_start_string='\VAR{',
            variable_end_string='}',
            comment_start_string='\#{',
            comment_end_string='}',
            line_statement_prefix=None,
            line_comment_prefix=None,
            trim_blocks=True,
            autoescape=False,
        )
        
        # Register escape filter
        def escape_latex(text):
            if not isinstance(text, str):
                return text
            replacements = {
                '&': r'\&',
                '%': r'\%',
                '$': r'\$',
                '#': r'\#',
                '_': r'\_',
                '{': r'\{',
                '}': r'\}',
                '~': r'\textasciitilde{}',
                '^': r'\textasciicircum{}',
                '\\': r'\textbackslash{}',
            }
            return "".join(replacements.get(c, c) for c in text)
            
        self.template_env.filters['escape_tex'] = escape_latex

    
    def generate_tex(self, data: dict, template_name="resume.tex") -> str:
        """
        Renders the LaTeX template with the provided data.
        Automatically escapes special LaTeX characters in the data.
        """
        def escape_recursive(item):
            if isinstance(item, str):
                return self.template_env.filters['escape_tex'](item)
            elif isinstance(item, list):
                return [escape_recursive(i) for i in item]
            elif isinstance(item, dict):
                return {k: escape_recursive(v) for k, v in item.items()}
            else:
                return item

        escaped_data = escape_recursive(data)
        template = self.template_env.get_template(template_name)
        return template.render(**escaped_data)

    def compile_pdf(self, tex_content: str, output_dir="static/generated") -> str:
        """
        Compiles the LaTeX content to PDF using Tectonic.
        Returns the path to the generated PDF.
        """
        import subprocess
        import uuid
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        job_id = str(uuid.uuid4())
        tex_filename = f"{output_dir}/{job_id}.tex"
        
        with open(tex_filename, "w", encoding="utf-8") as f:
            f.write(tex_content)
            
        # Tectonic command
        # Assuming tectonic.exe is in the backend root
        tectonic_path = os.path.abspath("tectonic.exe")
        
        try:
            subprocess.run(
                [tectonic_path, f"{job_id}.tex"], # Just filename since CWD is output_dir
                check=True,
                cwd=output_dir, # Run in output dir to keep artifacts contained
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            # Tectonic generates the pdf in the same directory with same basename
            pdf_filename = f"{job_id}.pdf"
            return f"{output_dir}/{pdf_filename}"
        except subprocess.CalledProcessError as e:
            error_message = e.stderr.decode()
            print(f"Compilation Failed: {error_message}")
            raise Exception(f"Tectonic Error: {error_message}") from e
