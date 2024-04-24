from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os

# Init app
app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))

# Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'db.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init db
db = SQLAlchemy(app)

# Init marshmallow
ma = Marshmallow(app)


# User Class/Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)

    def __init__(self, first_name, email):
        self.first_name = first_name
        self.email = email


# User Schema
class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'first_name', 'email')

# Init Schema
user_schema = UserSchema()
users_schema = UserSchema(many=True)


# view router
@app.route('/')
def index():
    return render_template("index.html")



# create table
@app.route('/create_tables')
def create_tables():
    with app.app_context():
        db.create_all()
    return 'Tables created successfully!'


# New User
@app.route('/new-user', methods=['POST'])
def add_user():
    
    first_name = request.json['first_name']
    email = request.json['email']

    # Check empty strings
    if not first_name.strip() or not email.strip():
        return jsonify({'error': 'Both first_name and email cannot be empty'}), 400
    
    # Check email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'error': 'Email already exists. Please use a different email'}), 400

    new_user = User(first_name=first_name, email=email)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        'msg' : 'New user added Successful'
    })


# Get All User
@app.route('/users', methods=['GET'])
def get_users():
    all_users = User.query.all()
    result = users_schema.dump(all_users)
    return jsonify(result)


# Get Single User
@app.route('/user/<int:id>', methods=['GET'])
def get_user(id):
    user = User.query.get(id)
    if user:
        return user_schema.jsonify(user)
    else:
        return jsonify({'error': 'User not found'}), 404


# Update User
@app.route('/user/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)

    if user:
        first_name = request.json['first_name']
        email = request.json['email']

        user.first_name = first_name
        user.email = email

        db.session.commit()

        return jsonify({
            'msg' : 'Updated Successful'
        })
    
    else:
        return jsonify({'error': 'User not found'}), 404



# Delete User
@app.route('/user/<int:id>', methods=['DELETE'])
def delete_user(id):
    user = User.query.get(id)

    if user:
        db.session.delete(user)
        db.session.commit()

        return jsonify({
            'msg' : 'Deleted Successful'
        })
    else:
        return jsonify({'error': 'User not found'}), 404



if __name__ == '__main__':
    app.run(debug=True)
