from crewai import Agent
from agenttools.web_scraper import WebScraperTool

class JobScraperAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Job Scraper",
            role="Web Scraper",
            goal="Scrape job listings from company career pages",
            backstory=(
                "You are a skilled web scraper, specialized in extracting job "
                "information from company career pages. Your task is to identify "
                "relevant job openings and provide detailed job information."
            ),
            tools=[WebScraperTool()],
        )
  
    def execute(self, url: str):
        return self.tools[0].run(url)