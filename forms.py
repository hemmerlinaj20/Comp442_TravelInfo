from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, PasswordField, SelectField, DateField, IntegerField
from wtforms.validators import InputRequired, Email, Length, Optional

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=256)])
    submit = SubmitField("Login")

# Sign Up Form to Register a User
class SignUpForm(FlaskForm):
    name = StringField("Name", validators = [InputRequired(), Length(max=256)])
    email = StringField("Email", validators = [InputRequired(), Email()])
    password = PasswordField("Password", validators = [InputRequired(), Length(min=8, max=256)]) 
    confirm_password = PasswordField("Confirm Password", validators = [InputRequired(), Length(min=8, max=256)]) 
    premium = SelectField("Premium", choices = [("Y","Yes"),("N","No")]) # TODO: make an enum
    submit = SubmitField("Sign Up")

# No longer needed:
# The form has been embedded in the page and dealt with by search_flights.js
class FlightSearchForm(FlaskForm):
    fromId = StringField('From Airport', validators=[InputRequired()])
    toId = StringField('To Airport', validators=[InputRequired()])
    departDate = DateField('Departure Date', format='%Y-%m-%d', validators=[InputRequired()])
    returnDate = DateField('Return Date', format='%Y-%m-%d',validators=[Optional()])
    adults = IntegerField('Number of Adults', default=1)
    sort = SelectField('Sort By', choices=[('BEST', 'Best'), ('CHEAPEST', 'Cheapest'), ('FASTEST', 'Fastest')], default='BEST')
    submit = SubmitField("Search")
