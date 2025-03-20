import os
from crewai import Agent
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

class JobParserAgent:
    def __init__(self):
        self.llm = ChatGroq(
            temperature=0,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="gemma2-9b-it"
        )
        
        self.output_parser = JsonOutputParser()
        
        self.agent = Agent(
            role="Job Data Extractor",
            goal="Extract structured job information from raw markdown data",
            backstory=(
                "You specialize in parsing unstructured job postings into structured data. "
                "You extract key details such as title, location, description."
            ),
            verbose=True,
            allow_delegation=False,
            llm=self.llm
        )

    def execute(self, raw_data: list):
        """Processes raw markdown data into structured job listings."""
        if not raw_data or not isinstance(raw_data, list):
            return []
            
        markdown = raw_data[0].get("markdown", "")
        return self._parse_markdown(markdown)

    def _parse_markdown(self, markdown: str) -> list:
        """Parse markdown into structured job data."""
        if not markdown:
            return []

        prompt_template = PromptTemplate(
            template="""
            Extract ALL job listings from this markdown text.
            Return a JSON array of objects where each object contains:
            - title (required)
            - location (optional)
            - description (optional)

            Example Output:
            [
                {{
                    "title": "Software Engineer",
                    "location": "Remote",
                    "description": "Develop scalable applications..."
                }},
                {{
                    "title": "Data Scientist",
                    "location": "New York",
                    "description": "Analyze large datasets..."
                }}
            ]

            Markdown Text:
            {markdown}
            """,
            input_variables=["markdown"],
            partial_variables={
                "format_instructions": self.output_parser.get_format_instructions()
            },
        )

        try:
            chain = prompt_template | self.llm | self.output_parser
            result = chain.invoke({"markdown": markdown})
            
            if isinstance(result, dict):
                return [result]
            
            return result
            
        except Exception as e:
            print(f"Error: {str(e)}")
            return []