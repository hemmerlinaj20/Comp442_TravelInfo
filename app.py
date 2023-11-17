import os
from flask import Flask, render_template, redirect, url_for, flash
from flask import request, session, jsonify
from flask_sqlalchemy import SQLAlchemy

from forms import LoginForm, SignUpForm

# Path to database file
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
    uid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode, nullable = False)
    email = db.Column(db.Unicode, nullable=False)
    password = db.Column(db.Unicode, nullable = False)
    premium = db.Column(db.Unicode, nullable = False) # TODO: Make this an enum "Y" or "N"

# Create database tables
with app.app_context():
    db.drop_all() # for testing, will remove later
    db.create_all()
    # users for testing purposes, delete later
    user1 = User(name = "Bob", email = "hi@gmail.com", password = "12345678", premium = "N")
    user2 = User(name = "Joe", email = "hey@gmail.com", password = "00000000", premium = "Y")
    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

# TODO: add hasher stuff for password saving

# Gets the home page (index.html)
@app.get('/')
def get_page():
    return redirect(url_for("get_home"))

# Home page
@app.get('/home')
def get_home():
    # Check if the user is logged in
    user_id: int = session.get('user_id') # current user logged in (I think its an int, but might be a str)
    user: User = User.query.get(user_id)
    # If user logged in -> give them a personalized page
    # If not logged in -> generic home page
    return render_template("index.html", user = user)
    
# Gets the login page (login_form.html)
@app.get('/login')
def get_login():
    login_form: LoginForm = LoginForm()
    return render_template('login_form.html', form = login_form)
# Post method for the login page
@app.post('/login')
def post_login():
    login_form: LoginForm = LoginForm()
    if login_form.validate():
        # Retrieve the user from the database based on the provided email
        user = User.query.filter_by(email=login_form.email.data).first()
        # TODO: Needs updated to hashed password
        if user is not None and user.password == login_form.password.data:
            # Log in the user and store their id in the session
            session['user_id'] = user.uid
            # Redirect the user to the home page
            return redirect(url_for('get_home'))
        else:
            flash('Invalid email address or password')
            return redirect(url_for('get_login'))
    else:
        for field,error_msg in login_form.errors.items():
            flash(f"{field}: {error_msg}")
    # redirect user to get the form again
    return redirect(url_for('get_login'))

# logout
@app.route('/logout')
def get_logout():
    # Clear the session and redirect to the home page
    session.clear()
    flash('You have logged out', 'info')
    return redirect(url_for('get_home'))

# Signup Page
@app.get('/signup')
def get_signup():
    signup_form: SignUpForm = SignUpForm()
    return render_template('signup.html', form = signup_form)
# Post for signup form
@app.post('/signup')
def post_signup():
    signup_form: SignUpForm = SignUpForm()
    if signup_form.validate():
        user: User = User(
            name = signup_form.name.data,
            email = signup_form.email.data,
            password = signup_form.password.data,
            premium = signup_form.premium.data
        )
        db.session.add(user)
        db.session.commit()
        # log user in and redirect to home page
        session['user_id'] = user.uid
        return redirect(url_for('get_home'))
    else:
        for field,error_msg in signup_form.errors.items():
                flash(f"{field}: {error_msg}")
    return redirect(url_for('get_signup'))

@app.get('/profile')
def get_profile():
    user_id: int = session.get('user_id') # current user logged in (I think its an int, but might be a str)
    user: User = User.query.get(user_id)
    return render_template('profile.html', user = user)

# API endpoint for dynamic search
@app.route('/search', methods=['POST'])
def search():
    # TODO: Implement dynamic search logic based on user preferences
    # Just returning a sample result for now
    result = {"destination": "Sample Destination", "description": "A beautiful place"}
    return jsonify(result)