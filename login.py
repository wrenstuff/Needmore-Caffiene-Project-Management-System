from flask import Blueprint, render_template, request, redirect, url_for, flash
from werkzeug.security import check_password_hash
from user_model import db, User
from sqlalchemy import or_ 

login_bp = Blueprint('login', __name__)

@login_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_input = request.form['username-email']
        password = request.form['password']
        
        # Check if the input is a username or email
        user = User.query.filter(
            or_(User.username == user_input, User.email == user_input)
        ).first()

        # Verify the  hashed password
        if user and check_password_hash(user.password, password):
            flash("Login successful!", "success")
          
            return redirect(url_for('dashboard'))  
        else:
            flash("Invalid email or password.", "danger")
            return redirect(url_for('login.login'))

    return render_template('login.html')
