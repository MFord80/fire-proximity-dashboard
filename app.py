# app.py draft
# Dependencies
from flask import Flask, render_template, jsonify
import numpy as np
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine


#################################################
# # Database Setup
# #################################################

engine = create_engine("sqlite:///CRM_data.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
Client = Base.classes.clients

#################################################
# Flask Setup
#################################################

# Create app, pass __name__
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

# # Define index route
@app.route("/")
def home():
    return render_template("index.html")

# Define /clients route
@app.route("/clients")
def clients():
    session = Session(engine)
    results = session.query(Client.first_name, Client.last_name, Client.full_address,  Client.lat, Client.long, Client.primary_phone, Client.number_adults, Client.number_children, Client.risk).all()
    session.close()
    client_data = []
    for first_name, last_name, full_address, lat, long, primary_phone, number_adults, number_children, risk in results:
        client_dict = {}
        client_dict["first_name"] = first_name
        client_dict["last_name"] = last_name
        client_dict["full_address"] = full_address
        client_dict["lat"] = lat
        client_dict["long"] = long
        client_dict["phone"] = primary_phone
        client_dict["adults"] = int.from_bytes(number_adults, "little")
        client_dict["children"] = int.from_bytes(number_children, "little")       
        client_dict["risk"] = risk        
        client_data.append(client_dict)
    return jsonify(client_data)    

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


# # Define /incidents route
# # @app.route("/incidents")


# Run
if __name__ == "__main__":
    app.run(debug=True)
