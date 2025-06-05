import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
import os
from dotenv import load_dotenv
load_dotenv() 

def scrape_events():
    url = "https://www.timeout.com/sydney/things-to-do"
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    cards = soup.find_all("article")

    events = []
    for card in cards:
        title = card.find("h3")
        link = card.find("a")
        image = card.find("img")
        desc = card.select_one("div[data-testid='summary_testID']")

        if title and link:
            events.append({
                "title": title.text.strip(),
                "link": link['href'],
                "image": image['src'] if image else '',
                "date": "Check site",
                "location": "Sydney",
                "description": desc.text.strip() if desc else ""
            })

    # MongoDB Save
    client = MongoClient(os.getenv("MONGO_URI"))
    db = client['sydney-events']
    collection = db['events']
    collection.delete_many({})
    collection.insert_many(events)
    print("Scraped and stored events.")
