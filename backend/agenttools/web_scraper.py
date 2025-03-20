import os
from crewai.tools import BaseTool
from firecrawl import FirecrawlApp

api_key = os.getenv("FIRECRAWL_API_KEY")
app = FirecrawlApp(api_key=api_key) 

class WebScraperTool(BaseTool):
    name: str = "Web Scraper Tool"
    description: str = "Scrapes job listings using Firecrawl to bypass bot protections."

    def _run(self, web_url: str):
        """Scrape job listings using Firecrawl."""
        if not api_key:
            return {"error": "Firecrawl API key not found"}

        # Firecrawl API request
        response = app.scrape_url(url=web_url, params={
            'formats': [ 'markdown' ],
        })

        return response