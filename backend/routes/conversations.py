from flask import Blueprint, request, jsonify
from models.conversation import ConversationModel
from datetime import datetime

conversations_bp = Blueprint('conversations', __name__)
model = ConversationModel()


@conversations_bp.route('/', methods=['GET'])
def get_all():
    """Get all saved conversations (most recent first)"""
    try:
        convos = model.get_all(limit=20)
        return jsonify({'success': True, 'data': convos}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@conversations_bp.route('/', methods=['POST'])
def save():
    """Save a full conversation session"""
    try:
        data = request.get_json()
        if not data or 'messages' not in data:
            return jsonify({'success': False, 'error': 'messages field required'}), 400

        doc = {
            'messages': data['messages'],
            'duration_seconds': data.get('duration_seconds', 0),
            'sign_count': data.get('sign_count', 0),
            'created_at': datetime.utcnow().isoformat()
        }

        result = model.save(doc)
        return jsonify({'success': True, 'id': result}), 201
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@conversations_bp.route('/<convo_id>', methods=['GET'])
def get_one(convo_id):
    """Get a single conversation by ID"""
    try:
        convo = model.get_by_id(convo_id)
        if not convo:
            return jsonify({'success': False, 'error': 'Not found'}), 404
        return jsonify({'success': True, 'data': convo}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@conversations_bp.route('/<convo_id>', methods=['DELETE'])
def delete(convo_id):
    """Delete a conversation"""
    try:
        model.delete(convo_id)
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
