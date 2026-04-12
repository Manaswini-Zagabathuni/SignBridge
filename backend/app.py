from flask import Flask
from flask_cors import CORS
from routes.conversations import conversations_bp
from routes.health import health_bp
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:4173"])

# Register blueprints
app.register_blueprint(conversations_bp, url_prefix='/api/conversations')
app.register_blueprint(health_bp, url_prefix='/api')

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    print(f"🤟 SignBridge backend running on http://localhost:{port}")
    app.run(port=port, debug=debug)
