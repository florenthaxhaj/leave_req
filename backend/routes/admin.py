from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({'username': current_user})
    
    if user['role'] != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403
    
    users = list(mongo.db.users.find({}, {'password': 0}))
    
    # Convert ObjectId to string for JSON serialization
    for user in users:
        user['_id'] = str(user['_id'])
    
    return jsonify(users), 200

@admin_bp.route('/user/<username>', methods=['PUT'])
@jwt_required()
def update_user(username):
    current_user = get_jwt_identity()
    admin = mongo.db.users.find_one({'username': current_user})
    
    if admin['role'] != 'admin':
        return jsonify({"msg": "Unauthorized"}), 403
    
    data = request.json
    mongo.db.users.update_one({'username': username}, {'$set': data})
    return jsonify({"msg": "User updated successfully"}), 200

