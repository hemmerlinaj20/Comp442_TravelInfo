from flask_wtf import FlaskForm
from wtforms import SubmitField, StringField, PasswordField, SelectField
from wtforms.validators import InputRequired, Email, Length

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[InputRequired(), Email()])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=8, max=256)])
    submit = SubmitField("Login")

class PreferenceForm(FlaskForm):
    travel_dates = StringField("Preferred Travel Dates", validators=[InputRequired()])
    budget = StringField("Budget", validators=[InputRequired()])
    submit = SubmitField("Save Preferences")

# Sign Up Form to Register a User
class SignUpForm(FlaskForm):
    name = StringField("Name", validators = [InputRequired()]) # TODO: put a max length limit
    email = StringField("Email", validators = [InputRequired(), Email()])
    password = PasswordField("Password", validators = [InputRequired()]) # TODO: put a min and max limit
    confirm_password = PasswordField("Confirm Password", validators = [InputRequired()]) # TODO: put a min and max limit
    premium = SelectField("Premium", choices = [("Y","Yes"),("N","No")])
    submit = SubmitField("Submit")