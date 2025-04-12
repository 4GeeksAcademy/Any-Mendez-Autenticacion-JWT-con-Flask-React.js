"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, User
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager, create_access_token
from flask_cors import CORS
import bcrypt



# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "nuestra_clave_secreta"
# Inicializamos el JWT para que funcione dentro del backend
jwt = JWTManager(app)
CORS(app)
app.url_map.strict_slashes = False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response


@app.route('/register', methods=['POST'])
def handle_register():
    try:
        data = request.get_json(silent=True)
        print("Data del body", data)
        #Agregar a la base de datos
        if not data:
            return jsonify({"ok": False, "msg": "No se recibieron datos JSON"}), 400
        email = data.get('email')
        password = data.get('password')
        is_active = data.get('is_active')

        if not email or not password or not is_active:
            return jsonify({"ok": False, "msg": "Faltan campos  requeridos"}), 400
        
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        new_user = User(email=email, password=hashed_password.decode('utf-8'), is_active=is_active)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"ok": True, "msg": "Registro exitoso..."}), 201
    except Exception as e:
        print("Error: ", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500

# Vamos a crear el token
@app.route('/login', methods=['POST'])
def handle_login():
    try:
        data = request.get_json(silent=True)
        print("Data del body", data)
        # Buscar usuario en la bd, por su correo electronico (Ejemplo el usuario tiene id 1)
        
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({"ok": False, "msg": "Faltan campos requeridos"}), 400
        user = User.query.filter_by(email=email).first()

        if user and user.is_active:
            if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        # Sino existe, mando un msj generico
        # Si existe, entonces valido la contrasenia
                claims = {"role": "admin", "otra_informacion": {
            "developer": "Any Mendez", "data": "data_info", "email": user.email}}
        # Si todo lo demas es exitoso... entonces creamos el token
                access_token = create_access_token(identity=str(user.id), additional_claims=claims)
        # Retornamos una respuesta exitosa, junto con el token creado
                return jsonify({"ok": True, "msg": "Login exitoso...", "access_token": access_token}), 200
            else:
                return jsonify({"ok": False, "msg": "Contraseña incorrecta"}), 401
        else:
            return jsonify({"ok": False, "msg": "Usuario no encontrado"}), 404
    
    except Exception as e:
        print("Error: ", str(e))
        db.session.rollback()
        return jsonify({"ok": False, "msg": str(e)}), 500


# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
