from flask import Flask, redirect, url_for , render_template, request
from user_model import db
import os
#log in  and log in state
from flask_login import LoginManager, login_required, current_user
from user_model import User 
from signup import signup_bp
from login import login_bp



app = Flask(__name__)
app.secret_key = 'super-secret-key'
# Configure the database URI
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database/users.db')

db.init_app(app)

# Flask-Login setup
login_manager = LoginManager()
login_manager.login_view = 'login.login' # Redirect to login page if user is not authenticated
login_manager.init_app(app)

# User loader function for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

#Register the blueprints
app.register_blueprint(signup_bp)
app.register_blueprint(login_bp)

# Define the home route this currently redirects to the login page
@app.route('/')
def index():
    return redirect(url_for('login.login'))

@app.route('/test_login') # Endpoint to test login status
def test_login():
    if current_user.is_authenticated:
        return f"User is logged in as: {current_user.username}"
    else:
        return "User is NOT logged in."

# Route to render the dashboard page
@app.route('/dashboard-<username>')
@login_required
def dashboard(username):
    return render_template('dashboard.html', user=current_user, username=username)

# Route to render the about us page
@app.route('/about_us-<username>')
def about_us(username):
    return render_template('about_us.html', user=current_user, username=username)

# Route to render the contact us page
@app.route('/account-<username>', methods=['GET', 'POST'])
@login_required
def account(username):
    return render_template('account.html' , user=current_user, username=username)


with app.app_context():
    db.create_all()

# Route to render the FAQ page
@app.route('/faq-<username>')
def faq(username):
    return render_template('faq.html' , user=current_user, username=username)

# Route to render the marketplace page
@app.route('/marketplace-<username>')
@login_required
def marketplace(username):
    return render_template('marketplace.html' , user=current_user, username=username)

# Route to render the pricing page
@app.route('/pricing-<username>')
@login_required
def pricing(username):
    return render_template('pricing.html' , user=current_user, username=username)

# Route to render the projects page
@app.route('/projects-<username>')
@login_required
def projects(username):
    return render_template('projects.html' , user=current_user, username=username)


if __name__ == '__main__':
    app.run(debug=True)
