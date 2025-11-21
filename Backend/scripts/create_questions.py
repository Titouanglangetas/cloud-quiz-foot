import os
import json
from azure.data.tables import TableServiceClient

# --- Trouver automatiquement local.settings.json ---
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SETTINGS_PATH = os.path.join(BASE_DIR, "local.settings.json")

print("🔎 Chargement de :", SETTINGS_PATH)

if not os.path.exists(SETTINGS_PATH):
    raise FileNotFoundError("❌ Impossible de trouver local.settings.json")

with open(SETTINGS_PATH) as f:
    settings = json.load(f)

try:
    CONNECTION_STRING = settings["Values"]["TABLE_STORAGE_CONNECTION_STRING"]
except KeyError:
    raise KeyError("❌ TABLE_STORAGE_CONNECTION_STRING introuvable dans local.settings.json")

print("🔗 Connexion au storage OK")

# --- Chargement du fichier questions.json ---
QUESTIONS_PATH = os.path.join(os.path.dirname(__file__), "questions.json")

if not os.path.exists(QUESTIONS_PATH):
    raise FileNotFoundError("❌ questions.json introuvable dans /scripts/")

with open(QUESTIONS_PATH, "r", encoding="utf8") as f:
    questions = json.load(f)

print(f"📄 {len(questions)} questions chargées.")

# --- Connexion Table Storage ---
service = TableServiceClient.from_connection_string(CONNECTION_STRING)
table = service.get_table_client("questions")

# --- Création des entités ---
print("📥 Import en cours...")

for q in questions:
    table.upsert_entity(q)

print("✅ Import terminé !")
