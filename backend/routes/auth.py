from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import mongo

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    user = mongo.db.users.find_one({'username': username})
    if user and check_password_hash(user['password'], password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    
    return jsonify({"msg": "Bad username or password"}), 401

@auth_bp.route('/register', methods=['POST'])
def register():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    role = request.json.get('role', 'employee')
    
    if mongo.db.users.find_one({'username': username}):
        return jsonify({"msg": "Username already exists"}), 400
    
    hashed_password = generate_password_hash(password)
    new_user = {'username': username, 'password': hashed_password, 'role': role}
    mongo.db.users.insert_one(new_user)
    
    return jsonify({"msg": "User created successfully"}), 201

