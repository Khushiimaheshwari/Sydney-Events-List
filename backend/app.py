from flask import Flask, jsonify
from scraper import scrape_events

app = Flask(__name__)

@app.route("/scrape", methods=["GET"])
def run_scrape():
    print("Scrape route hit!")
    scrape_events()
    return jsonify({"message": "Scraping completed"}), 200

if __name__ == "__main__":
    app.run(debug=True)

# go to - http://127.0.0.1:5000/scrape  