from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo
from datetime import datetime
from bson.objectid import ObjectId

pushimi_bp = Blueprint('pushimi', __name__)

@pushimi_bp.route('/request', methods=['POST'])
@jwt_required()
def request_pushimi():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['start_date', 'end_date', 'type', 'days']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Create new request document
        new_request = {
            'employee': current_user,
            'start_date': data['start_date'],
            'end_date': data['end_date'],
            'type': data['type'],
            'days': data['days'],
            'status': 'pending',
            'created_at': datetime.utcnow()
        }
        
        # Insert into database
        result = mongo.db.pushimi_requests.insert_one(new_request)
        
        # Return success response
        return jsonify({
            "message": "Kërkesa për pushim u dërgua me sukses",
            "request_id": str(result.inserted_id)
        }), 201
        
    except Exception as e:
        print(f"Error creating leave request: {str(e)}")
        return jsonify({"error": "Dërgimi i kërkesës dështoi. Ju lutem provoni përsëri."}), 500

@pushimi_bp.route('/requests', methods=['GET'])
@jwt_required()
def get_pushimi_requests():
    try:
        current_user = get_jwt_identity()
        user = mongo.db.users.find_one({'username': current_user})
        
        # If user is manager or admin, show all requests
        if user and user.get('role') in ['manager', 'admin']:
            requests = list(mongo.db.pushimi_requests.find())
        else:
            # Otherwise show only user's requests
            requests = list(mongo.db.pushimi_requests.find({'employee': current_user}))
        
        # Convert ObjectId to string for JSON serialization
        for request in requests:
            request['_id'] = str(request['_id'])
        
        return jsonify(requests), 200
        
    except Exception as e:
        print(f"Error fetching leave requests: {str(e)}")
        return jsonify({"error": "Gabim gjatë marrjes së kërkesave"}), 500

@pushimi_bp.route('/request/<request_id>', methods=['PUT'])
@jwt_required()
def update_pushimi_request(request_id):
    try:
        current_user = get_jwt_identity()
        user = mongo.db.users.find_one({'username': current_user})
        
        # Only managers and admins can update request status
        if not user or user.get('role') not in ['manager', 'admin']:
            return jsonify({"error": "Unauthorized"}), 403
        
        data = request.get_json()
        if 'status' not in data:
            return jsonify({"error": "Missing status field"}), 400
            
        result = mongo.db.pushimi_requests.update_one(
            {'_id': ObjectId(request_id)},
            {'$set': {
                'status': data['status'],
                'updated_at': datetime.utcnow(),
                'updated_by': current_user
            }}
        )
        
        if result.modified_count == 0:
            return jsonify({"error": "Kërkesa nuk u gjet"}), 404
            
        return jsonify({"message": "Kërkesa u përditësua me sukses"}), 200
        
    except Exception as e:
        print(f"Error updating leave request: {str(e)}")
        return jsonify({"error": "Përditësimi i kërkesës dështoi"}), 500

