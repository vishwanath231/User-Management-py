from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import os
from datetime import datetime
from pytz import timezone


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

# ==================================================================================
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


class Messenger(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    from_email = db.Column(db.String(100))
    to_email = db.Column(db.String(100))
    message = db.Column(db.String(1000))
    timestamp = db.Column(db.DateTime)

    def __init__(self, name, from_email, to_email, message, timestamp):
        self.name = name
        self.from_email = from_email
        self.to_email = to_email
        self.message = message
        self.timestamp = timestamp

class MessengerSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'from_email', 'to_email', 'message', 'timestamp')


# Init Schema
messenger_schema = MessengerSchema()
messengers_schema = MessengerSchema(many=True)


#==================================================================================

# view router
@app.route('/')
def index():
    return render_template("index.html")


@app.route('/user')
def user_screen():
    return render_template("users.html")



# create table
@app.route('/create_tables')
def create_tables():
    with app.app_context():
        db.create_all()
    return 'Tables created successfully!'


@app.route('/delete_tables')
def delete_tables():
    with app.app_context():
        db.drop_all()
    return 'Tables deleted successfully!'


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
    

@app.route('/new-msg', methods=['POST'])
def new_msg():

    name = request.json['name']
    from_email = request.json['from_email']
    to_email = request.json['to_email']
    message = request.json['message']
    timestampe = datetime.now(timezone('Asia/Kolkata'))
  
    if not from_email.strip() or not to_email.strip() or not message.strip() or not name.strip():
        return jsonify({'error': 'from_email, to_email and message cannot be empty'}), 400
    
    new_msg = Messenger(name=name, from_email=from_email, to_email=to_email, message=message, timestamp=timestampe)

    db.session.add(new_msg)
    db.session.commit()

    return jsonify({
        'msg' : 'Msg Send'
    })


@app.route('/msg', methods=['POST'])
def all_msg():
    from_email = request.json['from_email']
    to_email = request.json['to_email']

    # Query the Messenger table for messages where both from_email and to_email match
    # messages = Messenger.query.filter_by(from_email=from_email and to_email, to_email=to_email and from_email).all()

    messages = Messenger.query.filter(
        (Messenger.from_email == from_email) & (Messenger.to_email == to_email) |
        (Messenger.from_email == to_email) & (Messenger.to_email == from_email)
    ).all()

    if messages:
        # Serialize the messages using the schema
        return messengers_schema.jsonify(messages)
    else:
        return jsonify({'error': 'Messages not found'}), 404







if __name__ == '__main__':
    app.run(debug=True)
