import logging
import json
import os
import uuid
from datetime import datetime
from azure.data.tables import TableServiceClient
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        body = req.get_json()
        name = body.get("name")
        score = body.get("score")
        mode = body.get("mode", "qifoot")
        
        if not name or score is None or not mode:
            return func.HttpResponse("Missing name, score, or mode", status_code=400)

        conn_str = os.environ["TABLE_STORAGE_CONNECTION_STRING"]
        service = TableServiceClient.from_connection_string(conn_str)
        table = service.get_table_client("scores")

        entity = {
            "PartitionKey": "score",
            "RowKey": str(uuid.uuid4()),
            "name": name,
            "score": int(score),
            "timestamp": datetime.utcnow().isoformat(),
            "mode": mode
        }

        table.upsert_entity(entity)

        return func.HttpResponse("OK", status_code=200)

    except Exception as e:
        logging.error(e)
        return func.HttpResponse(str(e), status_code=500)
