from flask import Flask, render_template, request, redirect, url_for
import logging
import os

logging.basicConfig(level=logging.INFO)

app = Flask(__name__, template_folder='pages')

@app.route('/')
def index():
    return render_template('dashboard.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/account', methods=['GET', 'POST'])
def account():
    return render_template('account.html')

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        logging.info(f"Login attempt with username: {username} and password: [REDACTED]")
        return redirect('/dashboard')
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

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        logging.info(f"Signup: {username}, email: {email}, and password: [REDACTED]")
        logging.info(f"Signup: {username}, and password: [REDACTED]")
    return render_template('signup.html')

if __name__ == '__main__':
    debug_mode = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode)
