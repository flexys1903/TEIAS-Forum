import os
from flask import Flask, send_from_directory, jsonify, request
from supabase import create_client, Client

app = Flask(__name__, static_folder='public')

# Supabase Bağlantısı
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY) if SUPABASE_URL and SUPABASE_SECRET_KEY else None

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('public', path)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)
