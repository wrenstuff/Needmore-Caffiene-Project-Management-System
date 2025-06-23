from flask import Blueprint, render_template, request, redirect, url_for, flash
from werkzeug.security import generate_password_hash 
from user_model import db, User  # Import the User model
import cv2 as cv
import os

signup_bp = Blueprint('signup', __name__)

@signup_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']

        hashed_pw = generate_password_hash(password)
        image_path = f'static/images/users/{username}_pfp.jpg'  # Default profile image path
        
        # Check if the username or email already exists
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            flash("User already exists.", "danger")
           
            return redirect(url_for('signup.signup'))

        os.makedirs(os.path.dirname(image_path), exist_ok=True)  # Ensure the directory exists

        default_image = cv.imread('static/images/Blue_test.png')
        if default_image is None:
            raise ValueError("Default image not found. Please check the path.")
        
        new_image = cv.resize(default_image, (200, 200))
        cv.imwrite(image_path, new_image)  # Save the default profile image

        # Create a new user
        new_user = User(username=username, email=email, password=hashed_pw, image_path=image_path)
        db.session.add(new_user)
        db.session.commit()

        flash("Account created successfully!", "success")
        return redirect(url_for('login.login'))

    return render_template('sign_up.html')