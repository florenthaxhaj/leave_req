from flask import Flask, render_template
from flask_cors import CORS
import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import Config
from extensions import jwt, mongo

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    CORS(app)
    jwt.init_app(app)
    mongo.init_app(app)

    # Import and register blueprints
    from routes.auth import auth_bp
    from routes.pushimi import pushimi_bp
    from routes.admin import admin_bp

    # Register blueprints with URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(pushimi_bp, url_prefix='/api/pushimi')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Add error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return render_template('404.html'), 404

    @app.errorhandler(500)
    def internal_error(error):
        return render_template('500.html'), 500

    # Add a root route
    @app.route('/')
    def index():
        return render_template('index.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)

