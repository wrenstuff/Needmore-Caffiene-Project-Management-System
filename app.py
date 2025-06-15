from flask import Flask, redirect, url_for , render_template, request
from user_model import db
import os
from signup import signup_bp
from login import login_bp
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
app.secret_key = 'super-secret-key'
# Configure the database URI
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database/users.db')

db.init_app(app)

#Register the blueprints
app.register_blueprint(signup_bp)
app.register_blueprint(login_bp)

@app.route('/')
def index():
    return redirect(url_for('login.login'))

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/about_us')
def about_us():
    return render_template('about_us.html')

@app.route('/account', methods=['GET', 'POST'])
def account():
    return render_template('account.html')

with app.app_context():
    db.create_all()

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('login.html')

@app.route('/marketplace')
def marketplace():
    return render_template('marketplace.html')

@app.route('/pricing')
def pricing():
    return render_template('pricing.html')

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/sign_up', methods=['GET', 'POST'])
def sign_up():
    return render_template('sign_up.html')

if __name__ == '__main__':
    app.run(debug=True)
