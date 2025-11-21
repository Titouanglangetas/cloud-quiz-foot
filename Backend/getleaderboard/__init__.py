import logging
import json
import os
from azure.data.tables import TableServiceClient
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        conn_str = os.environ["TABLE_STORAGE_CONNECTION_STRING"]
        service = TableServiceClient.from_connection_string(conn_str)
        table = service.get_table_client("scores")

        entries = [e for e in table.list_entities()]
        entries.sort(key=lambda x: x["score"], reverse=True)

        output = [
            {
                "name": e["name"],
                "score": e["score"],
                "timestamp": e["timestamp"]
            }
            for e in entries[:10]
        ]

        return func.HttpResponse(
            json.dumps(output, ensure_ascii=False),
            mimetype="application/json",
            status_code=200
        )

    except Exception as e:
        logging.error(e)
        return func.HttpResponse(str(e), status_code=500)
