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

