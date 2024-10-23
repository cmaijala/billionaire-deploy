# Import libraries
import pandas as pd
import numpy as np
import datetime as dt
import altair as alt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS

import psycopg2

# Set up database for Flask and Javascript use
#engine = create_engine('postgresql+psycopg2://postgres:postgres@localhost:5432/billionaires_db')
#engine = sqlalchemy.create_engine('postgresql://postgres:postgres@localhost:5432/billionaires_db')

#%load_ext sql
#%sql postgresql://postgres:postgres@localhost:5432/billionaires_db
# Reflect an existing database into a new model
#Base = automap_base()
# Reflect the tables
#Base.prepare(autoload_with=engine)

# Save reference to the table
#Billionaire = Base.classes.billionaires
#keys = Base.classes.keys()
#print(keys)

#data = pd.read_sql_query('select * from billionaires_raw',con=engine)
#print(data)

# Replace NaN with None (which converts to null in JSON)
#data = data.where(pd.notnull(data), None)


engine = sqlalchemy.create_engine('postgresql://postgres:postgres@localhost:5432/billionaires_db')

# Reflect an existing database into a new model
Base = automap_base()
# Reflect the tables
Base.prepare(autoload_with=engine)

# Flask setup
app = Flask(__name__)
CORS(app)

# Set up Flask routes

@app.route("/")
def welcome():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/data<br/>"
    )

# Set up route to data
@app.route("/api/v1.0/data")
def get_data():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    """Return the entire (cleaned) billionaire dataset"""
    # Query all data
    #billionaires = pd.read_sql_query('SELECT * FROM billionaires_raw', con=engine)
    #result = session.query(Billionaire.rank).all()


    #%load_ext sql
    #%sql postgresql://postgres:postgres@localhost:5432/billionaires_db


    # Save reference to the table
    #Billionaire = Base.classes.billionaires
    #keys = Base.classes.keys()
    #print(keys)

    billionaires = pd.read_sql_query('select * from billionaires',con=engine)
    billionaires = billionaires.where(pd.notnull(billionaires), None)
    billionaires['country_cpi'] = billionaires['country_cpi'].astype("string")
    #billionaires.fillna(value=None, inplace=True)
    #print(billionaires)

    if billionaires.isnull().values.any():
        print("Warning: NaN values still exist in the DataFrame.")
        print(billionaires.dtypes)

    session.close()

    return jsonify(billionaires.to_dict(orient='records'))

if __name__ == '__main__':
    app.run(debug=True)