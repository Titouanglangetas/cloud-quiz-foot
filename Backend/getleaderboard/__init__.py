import logging
import json
import os
from azure.data.tables import TableServiceClient
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        mode = req.params.get("mode")
        if not mode:
            return func.HttpResponse(
                "Missing 'mode' parameter (ex: ?mode=qifoot)",
                status_code=400
            )

        conn_str = os.environ["TABLE_STORAGE_CONNECTION_STRING"]
        service = TableServiceClient.from_connection_string(conn_str)
        table = service.get_table_client("scores")

        # Récupération + filtrage par mode
        entries = [
            e for e in table.list_entities()
            if e.get("mode") == mode
        ]

        # Tri par score décroissant
        entries.sort(key=lambda x: x["score"], reverse=True)

        # Format JSON
        output = [
            {
                "name": e.get("name", "unknown"),
                "score": e.get("score", 0),
                "timestamp": e.get("timestamp",""),
                "mode": e.get("mode", "unknown")
            }
            for e in entries[:10]  # top 10
        ]

        return func.HttpResponse(
            json.dumps(output, ensure_ascii=False),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.error(e)
        return func.HttpResponse(str(e), status_code=500)
