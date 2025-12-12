import azure.functions as func
import json
from azure.data.tables import TableServiceClient
import os
import random

def main(req: func.HttpRequest) -> func.HttpResponse:
    connection_string = os.environ["TABLE_STORAGE_CONNECTION_STRING"]
    table_name = "questions"

    difficulty = req.params.get("difficulty")
    if not difficulty:
        return func.HttpResponse("Missing difficulty parameter", status_code=400)
    difficulty = int(difficulty)

    used = req.params.get("used", "")
    used_ids = used.split(",") if used else []

    service = TableServiceClient.from_connection_string(conn_str=connection_string)
    table_client = service.get_table_client(table_name)

    entities = list(table_client.list_entities())

    def filter_by_diff(diff, marge=0):
        return [
            e for e in entities
            if abs(int(e["difficulty"]) - diff) <= marge
            and e["RowKey"] not in used_ids
        ]

    pool = filter_by_diff(difficulty, marge=0)

    if len(pool) < 1:
        pool = filter_by_diff(difficulty, marge=1)

    if len(pool) < 1:
        pool = filter_by_diff(difficulty, marge=2)

    if len(pool) < 1:
        pool = [e for e in entities if e["RowKey"] not in used_ids]

    if len(pool) == 0:
        return func.HttpResponse(
            "No more questions available", status_code=404
        )

    q = random.choice(pool)

    result = {
        "id": q["RowKey"],
        "question": q["question"],
        "choice1": q["choice1"],
        "choice2": q["choice2"],
        "choice3": q["choice3"],
        "answer": q["answer"],
        "difficulty": int(q["difficulty"])
    }

    return func.HttpResponse(json.dumps(result, ensure_ascii=False), mimetype="application/json")
