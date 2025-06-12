from flask import Flask, render_template, request, redirect, url_for
import logging
import os

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

@app.route('/')
def index():
    #return render_template('index.html')
    return redirect(url_for('login'))

@app.route('/about_us')
def about_us():
    return render_template('about_us.html')

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