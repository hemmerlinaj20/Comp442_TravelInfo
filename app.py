import os
from flask import Flask, render_template, redirect, url_for, flash
from flask import request, session
from flask_sqlalchemy import SQLAlchemy

# Path to database file
# TODO: insert database name
scriptdir = os.path.dirname(os.path.abspath(__file__))
dbfile = os.path.join(scriptdir, "")

# Setup and Config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{dbfile}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = 'totallysecretkeythatnobodyknows'
db = SQLAlchemy(app)

@app.get('/')
def get_page():
    return render_template('form.html')