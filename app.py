from flask import Flask, redirect, url_for , render_template
from user_model import db
import os
from signup import signup_bp
from login import login_bp

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

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
