# Import Flask
from flask import Flask, render_template
import requests
import json


# Create app, pass __name__
app = Flask(__name__)

# Define /clients route

# Define index route
@app.route("/")
def home():
    return render_template("index.html")

# Define /hotspots route
@app.route("/hotspots")
def hotspots():
    return render_template("hotspots.json")

# Define /schools route
@app.route("/schools")
def schools():
    return render_template("Current_Active_Schools_Sem_1_2022_Public_DET_020_WA_GDA2020_Public.geojson")

# Define /hospitals route
@app.route("/hospitals")
def hospitals():
    return render_template("Health_Hospitals_HEALTH_001_WA_GDA2020_Public.geojson")

# Define /agedcare route
@app.route("/agedcare")
def agedcare():
    return render_template("WA-30-June-2022.csv")



# Define /incidents route, run scrape application
# @app.route("/incidents")
# def scraper():

# Run
if __name__ == "__main__":
    app.run(debug=True)
