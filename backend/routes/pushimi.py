from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo

pushimi_bp = Blueprint('pushimi', __name__)

@pushimi_bp.route('/request', methods=['POST'])
@jwt_required()
def request_pushimi():
    current_user = get_jwt_identity()
    data = request.json
    
    new_request = {
        'employee': current_user,
        'start_date': data['start_date'],
        'end_date': data['end_date'],
        'days': data['days'],
        'status': 'pending'
    }
    
    mongo.db.pushimi_requests.insert_one(new_request)
    return jsonify({"msg": "Pushimi request submitted successfully"}), 201

@pushimi_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_pushimi_requests():
    current_user = get_jwt_identity()
    user = mongo.db.users.find_one({'username': current_user})
    
    if user['role'] == 'manager':
        requests = list(mongo.db.pushimi_requests.find())
    else:
        requests = list(mongo.db.pushimi_requests.find({'employee': current_user}))
    
    # Convert ObjectId to string for JSON serialization
    for request in requests:
        request['_id'] = str(request['_id'])
    
    return jsonify(requests), 200

