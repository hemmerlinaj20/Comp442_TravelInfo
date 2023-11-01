import os
from flask import Flask, render_template, redirect, url_for, flash
from flask import request, session
from flask_sqlalchemy import SQLAlchemy

from forms import LoginForm, PreferenceForm

# Path to database file
# TODO: insert database name
# TODO: create database models in separte py file
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
    
@app.get('/login')
def get_login():
    login_form: LoginForm = LoginForm()
    # TODO: create and make 'login_form.html' jinja template
    return render_template('login_form.html', form = login_form)
    
@app.post('/login')
def post_login():
    login_form: LoginForm = LoginForm()
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
    
@app.get('/user_preference')
def get_preference_form():
    user_preference_form: PreferenceForm = PreferenceForm()
    # TODO: create and make 'user_preference_form.html' jinja template
    return render_template('user_preference_form.html', form = user_preference_form)

@app.post('/user_preference')
def post_preference_form():
    user_preference_form: PreferenceForm = PreferenceForm()
    if user_preference_form.validate():
        # TODO: save form data to database with the user
        # TODO: redirect user to home page or recommendation/search page
        pass
    else:
        for field,error_msg in user_preference_form.errors.items():
                flash(f"{field}: {error_msg}")
    # redirect user to get the form again
    return redirect(url_for('get_preference_form'))
