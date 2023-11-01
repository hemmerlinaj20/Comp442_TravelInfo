import os
from flask import Flask, render_template, redirect, url_for, flash
from flask import request, session
from flask_sqlalchemy import SQLAlchemy

from forms import LoginForm

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

# TODO: add hasher stuff for password saving

@app.get('/')
def get_page():
    return render_template('index.html')

@app.get('/home')
def get_home_page():
    return render_template('index.html')

@app.route('/login', methods = ("GET","POST"))
def login_page():
    login_form: LoginForm = LoginForm()
    if request.method == "GET":
        # TODO: create and make 'login_form.html' jinja template
        return render_template('login_form.html')
    else:   # method == POST
        if login_form.validate():
            # TODO: log user in to page
            # TODO: keep them in the session to keep them logged in
            # TODO: redirect them to the home page
            pass
        else:
            for field,error_msg in login_form.errors.items():
                flash(f"{field}: {error_msg}")
        # redirect user to get the form again
        return redirect(url_for('login_page'))