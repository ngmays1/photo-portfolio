from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from datetime import datetime
import uuid

UPLOAD_DIR = os.environ.get('UPLOAD_DIR', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__, static_folder=None)
CORS(app)

ALLOWED_EXT = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

def allowed(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


@app.route('/api/photos', methods=['GET'])
def list_photos():
    photos = []
    for fname in os.listdir(UPLOAD_DIR):
        if not allowed(fname):
            continue
        path = f'/uploads/{fname}'
        photos.append({
            'id': os.path.splitext(fname)[0],
            'url': request.host_url.rstrip('/') + path,
            'title': fname,
            'description': '',
            'category': 'Abstract',
            'dateAdded': int(os.path.getmtime(os.path.join(UPLOAD_DIR, fname)) * 1000)
        })
    photos.sort(key=lambda p: p['dateAdded'], reverse=True)
    return jsonify(photos)


@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'file required'}), 400

    f = request.files['file']
    if f.filename == '':
        return jsonify({'error': 'file required'}), 400

    if not allowed(f.filename):
        return jsonify({'error': 'file type not allowed'}), 400

    filename = secure_filename(f.filename)
    uniq = datetime.utcnow().strftime('%Y%m%d%H%M%S') + '-' + uuid.uuid4().hex[:8]
    stored = f"{uniq}-{filename}"
    dest = os.path.join(UPLOAD_DIR, stored)
    f.save(dest)

    title = request.form.get('title') or filename
    description = request.form.get('description') or ''
    category = request.form.get('category') or 'Abstract'

    photo = {
        'id': os.path.splitext(stored)[0],
        'url': request.host_url.rstrip('/') + '/uploads/' + stored,
        'title': title,
        'description': description,
        'category': category,
        'dateAdded': int(os.path.getmtime(dest) * 1000)
    }

    return jsonify(photo), 201


@app.route('/uploads/<path:filename>', methods=['GET'])
def serve_upload(filename: str):
    return send_from_directory(UPLOAD_DIR, filename)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=True)
