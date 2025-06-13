from flask import Blueprint, render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash 
from user_model import db, User  # Import the User model

signup_bp = Blueprint('signup', __name__)

@signup_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        hashed_pw = generate_password_hash(password)
        
        # Check if the username or email already exists
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            flash("User already exists.", "danger")
           
            return redirect(url_for('signup.signup'))
        # Create a new user
        new_user = User(username=username, email=email, password=hashed_pw)
        db.session.add(new_user)
        db.session.commit()

        flash("Account created successfully!", "success")
        return redirect(url_for('login.login'))

    return render_template('sign_up.html')