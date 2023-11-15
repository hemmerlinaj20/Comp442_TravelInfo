import os
from flask import Flask, render_template, redirect, url_for, flash
from flask import request, session, jsonify
from flask_sqlalchemy import SQLAlchemy

from forms import LoginForm, PreferenceForm

# Path to database file
# TODO: insert database name
# TODO: create database models in separate py file
scriptdir = os.path.dirname(os.path.abspath(__file__))
dbfile = os.path.join(scriptdir, "vacation_finder.db")

# Setup and Config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{dbfile}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = 'totallysecretkeythatnobodyknows'
db = SQLAlchemy(app)

# Define user model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    preferences = db.Column(db.String(255), nullable=True)

# Create database tables
with app.app_context():
    db.create_all()

# TODO: add hasher stuff for password saving

@app.get('/')
def get_page():
    # Check if the user is logged in
    if 'user_id' in session:
        return redirect(url_for('get_home_page'))
    else:
        return redirect(url_for('get_login'))
    
@app.get('/login')
def get_login():
    login_form: LoginForm = LoginForm()
    # TODO: create and make 'login_form.html' jinja template
    return render_template('login_form.html', form = login_form)
    
@app.post('/login')
def post_login():
    login_form: LoginForm = LoginForm()
    if login_form.validate():
        # Retrieve the user from the database based on the provided email
        user = User.query.filter_by(email=login_form.email.data).first()
        
        if user is not None and user.verify_password(login_form.password.data):
            # Log in the user and store their id in the session
            session['user_id'] = user.id
            # Redirect the user to the home page
            return redirect(url_for('get_home_page'))
        else:
            flash('Invalid email address or password')
            return redirect(url_for('get_login'))
    else:
        for field,error_msg in login_form.errors.items():
            flash(f"{field}: {error_msg}")
    # redirect user to get the form again
    return redirect(url_for('get_login'))

@app.route('/logout')
def logout():
    # Clear the session and redirect to the home page
    session.clear()
    flash('You have logged out', 'info')
    return redirect(url_for('get_page'))

@app.get('/home')
def get_home_page():
    # Check if the user is logged in
    if 'user_id' in session:
        # Get user preferences from the database
        user_id = session['user_id']
        user = User.query.get(user_id)
        preferences = user.preferences if user.preferences else "No preferences set."
        return render_template('index.html', preferences=preferences)
    else:
        flash('Please log in first', 'warning')
        return redirect(url_for('get_login'))
    
@app.get('/user_preference')
def get_preference_form():
    user_preference_form: PreferenceForm = PreferenceForm()
    # TODO: create and make 'user_preference_form.html' jinja template
    return render_template('user_preference_form.html', form = user_preference_form)

@app.post('/user_preference')
def post_preference_form():
    user_preference_form: PreferenceForm = PreferenceForm()
    if user_preference_form.validate():
        # save form data to database with the user
        user_id = session['user_id']
        user = User.query.get(user_id)
        user.preferences = str(user_preference_form.data)
        db.session.commit()
        flash('Preferences saved successfully', 'success')
        # redirect user to home page or recommendation/search page
        return redirect(url_for('get_home_page'))
    else:
        for field,error_msg in user_preference_form.errors.items():
                flash(f"{field}: {error_msg}")
    # redirect user to get the form again
    return redirect(url_for('get_preference_form'))

# API endpoint for dynamic search
@app.route('/search', methods=['POST'])
def search():
    # TODO: Implement dynamic search logic based on user preferences
    # Just returning a sample result for now
    result = {"destination": "Sample Destination", "description": "A beautiful place"}
    return jsonify(result)