# fire-proximity-dashboard

This repository contains the files for a fire-proximity-dashboard.
The dashboard is a flask-powered python app.

The app.py application launches the website and as well as querying the database and defining the other routes.

The following routes exist:
/clients uses a sqlalchemy engine to connect to a dummy database created in sqlite
/hotspots uses geojson data taken from https://hotspots.dea.ga.gov.au/data/recent-hotspots.json!
/schools uses geojson data taken from https://catalogue.data.wa.gov.au/dataset/current-active-schools-semester-1-2022-public-det-020
/hospitals uses geojson data taken from https://catalogue.data.wa.gov.au/dataset/health-establishments
/agedcard uses csv data taken from https://www.gen-agedcaredata.gov.au/Resources/Access-data/2022/October/Aged-care-service-list-30-June-2022

Note that client data was only generated for a small geographical on the Perth's urban fringe for demonstration purposes only.
