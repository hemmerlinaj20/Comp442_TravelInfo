import os
from flask import Flask, render_template, redirect, url_for, flash
from flask import request, session
from flask_sqlalchemy import SQLAlchemy
from forms import LoginForm, SignUpForm
from hasher import Hasher

# Path to database file
scriptdir = os.path.dirname(os.path.abspath(__file__))
dbfile = os.path.join(scriptdir, "vacation_finder.sqlite3")

# Create the hasher to hash the passwords with the pepper
hasher = Hasher(open(f"{scriptdir}/static/pepper.bin", "r").read())

# Setup and Config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{dbfile}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['SECRET_KEY'] = 'totallysecretkeythatnobodyknows'
db = SQLAlchemy(app)

# Define user model
class User(db.Model):
    __tablename__ = "Users"
    uid = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Unicode, nullable = False)
    email = db.Column(db.Unicode, nullable=False)
    password_hash = db.Column(db.Unicode, nullable = False)
    premium = db.Column(db.Unicode, nullable = False)
    flights = db.relationship('Flight', backref='user')
    hotels = db.relationship('Hotel', backref='user')
    attractions = db.relationship('Attraction', backref='user')

# Flight Model
class Flight(db.Model):
    __tablename__ = "Flights"
    fid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.uid'))
    from_city = db.Column(db.Unicode, nullable=True)
    to_city = db.Column(db.Unicode, nullable=True)
    depart_date = db.Column(db.Unicode, nullable=True)
    price = db.Column(db.Float, nullable=True)

# Hotel Model
class Hotel(db.Model):
    __tablename__ = "Hotels"
    hid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.uid'))
    name = db.Column(db.Unicode, nullable=True)
    check_in_date = db.Column(db.Integer, nullable=True)
    price = db.Column(db.Float, nullable=True)

#Attraction Model
class Attraction(db.Model):
    __tablename__ = "Attractions"
    aid = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.uid'))
    name = db.Column(db.Unicode, nullable = True)
    rating = db.Column(db.Unicode, nullable = True)
    price = db.Column(db.Float, nullable=True)

# Trip model
class Trip(db.Model):
    __tablename__ = "Trips"
    tip = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.uid'))
    flight = db.Column(db.Integer, db.ForeignKey('Flights.fid'))
    hotel = db.Column(db.Integer, db.ForeignKey('Hotels.hid'))
    # Do Attractions Later

# Create database tables
with app.app_context():
    #db.drop_all() # TESTING - REMOVE LATER
    db.create_all()
    # DUMMY USERS FOR TESTING - DELETE LATER
    #user1 = User(name = "Bob", email = "hi@gmail.com", password_hash = hasher.hash("12345678"), premium = "N")
    #user2 = User(name = "Joe", email = "hey@gmail.com", password_hash = hasher.hash("00000000"), premium = "Y")
    #db.session.add(user1)
    #db.session.add(user2)
    #db.session.commit()

# Base route to redirect to home page
@app.get('/')
def get_page():
    return redirect(url_for("get_home"))

# Home page
@app.get('/home/')
def get_home():
    # Checks who is logged in (if anyone)
    user_id: int = session.get('user_id')
    # finds that user in the database (or None)
    user: User = User.query.get(user_id)
    # If user logged in -> give them a personalized page
    # If not logged in -> generic home page
    return render_template("index.html", user = user)
    
# Gets the login page (login_form.html)
@app.get('/login/')
def get_login():
    login_form: LoginForm = LoginForm()
    return render_template('login_form.html', form = login_form)
# Post method for the login page
@app.post('/login/')
def post_login():
    login_form: LoginForm = LoginForm()
    if login_form.validate():
        # Retrieve the user from the database based on the provided email
        user = User.query.filter_by(email=login_form.email.data).first()
        # Check if password is correct
        if user is not None and hasher.check(login_form.password.data, user.password_hash):
            # Log in the user and store their id in the session
            session['user_id'] = user.uid
            # Redirect the user to the home page
            return redirect(url_for('get_home'))
        else:
            # flash error and get form again
            flash('Invalid email address or password')
            return redirect(url_for('get_login'))
    else:
        for field,error_msg in login_form.errors.items():
            flash(f"{field}: {error_msg}")
    # redirect user to get the form again
    return redirect(url_for('get_login'))
 
# logout
@app.route('/logout/')
def get_logout():
    # Clear the session and redirect to the home page
    session.clear()
    flash('You have logged out', 'info')
    return redirect(url_for('get_home'))

# Signup Page
@app.get('/signup/')
def get_signup():
    signup_form: SignUpForm = SignUpForm()
    return render_template('signup.html', form = signup_form)
# Post for signup form
@app.post('/signup/')
def post_signup():
    signup_form: SignUpForm = SignUpForm()
    if signup_form.validate():
        # Checks if the email address is already taken
        if User.query.filter_by(email = signup_form.email.data).first() is None:
            user: User = User(
                name = signup_form.name.data,
                email = signup_form.email.data,
                password_hash = hasher.hash(signup_form.password.data),
                premium = signup_form.premium.data
            )
            db.session.add(user)
            db.session.commit()
            # log user in and redirect to home page
            session['user_id'] = user.uid
            return redirect(url_for('get_home'))
        else:
            flash("There is already a user with this email address","error")
            return redirect(url_for('get_signup'))
    else:
        for field,error_msg in signup_form.errors.items():
                flash(f"{field}: {error_msg}")
    return redirect(url_for('get_signup'))

@app.get('/profile')
def get_profile():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    # Render this user's profile information
    return render_template('profile.html', user = user)

@app.post('/change_name')
def post_change_name():
    user: User = User.query.get(session.get('user_id'))
    user.name = request.form.get("name")
    db.session.commit()
    return redirect(url_for('get_profile'))

@app.post('/change_premium')
def post_change_premium():
    user: User = User.query.get(session.get('user_id'))
    user.premium = request.form.get("premium")
    db.session.commit()
    return redirect(url_for('get_profile'))

@app.post('/change_password')
def post_change_password():
    user: User = User.query.get(session.get('user_id'))
    if hasher.check(request.form.get("old-password"), user.password_hash):
        user.password_hash = hasher.hash(request.form.get("new-password"))
        db.session.commit()
        return redirect(url_for('get_profile'))
    else:
        flash("Invalid Password","error")
        return redirect(url_for('get_profile'))

@app.post('/change_email')
def post_change_email():
    user: User = User.query.get(session.get('user_id'))
    user.email = request.form.get("email")
    db.session.commit()
    return redirect(url_for('get_profile'))

# Create/Plan trip route
@app.get('/saved')
def saved():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    return render_template("saved.html", user = user)
@app.post('/saved')
def post_saved():
    remove_from = request.json['remove_from']
    remove_num = request.json['entry_id']
    if remove_from == 'flight':
        db.session.delete(Flight.query.get(remove_num))
    elif remove_from == 'hotel':
        db.session.delete(Hotel.query.get(remove_num))
    else:
        db.session.delete(Attraction.query.get(remove_num))
    db.session.commit()
    return redirect(url_for('saved'))

# Search Flights route
@app.get('/search_flights')
def search_flights():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    return render_template("search_flights.html", user = user)
@app.post('/search_flights')
def post_search_flights():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    flight: Flight = Flight(
        user = user,
        from_city = request.json['from_city'],
        to_city = request.json['to_city'],
        depart_date = request.json['depart_date'],
        price = request.json['price']
    )
    db.session.add(flight)
    db.session.commit()
    return redirect(url_for('search_flights'))

# Search Hotels Route
@app.get('/search_hotels')
def search_hotels():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    return render_template("search_hotels.html", user = user)
@app.post('/search_hotels')
def post_search_hotels():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    hotel: Hotel = Hotel(
        user = user,
        name = request.json['name'],
        check_in_date = request.json['check_in_date'],
        price = request.json['price']
    )
    db.session.add(hotel)
    db.session.commit()
    return redirect(url_for('search_hotels'))

# Search Attraction Route
@app.get('/search_attractions')
def search_attractions():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    return render_template("search_attractions.html", user = user)
@app.post('/search_attractions')
def post_search_attractions():
    user_id: int = session.get('user_id')
    user: User = User.query.get(user_id) # current user logged in
    attraction: Attraction = Attraction(
        user = user,
        name = request.json['name'],
        rating = request.json['rating'],
        price = request.json['price']
    )
    db.session.add(attraction)
    db.session.commit()
    return redirect(url_for('search_attractions'))
