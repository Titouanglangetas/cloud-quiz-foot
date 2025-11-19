import json
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    sample_question = {
        "question": "Qui a gagné la Coupe du Monde 2018 ?",
        "answers": ["France", "Croatie", "Brésil", "Belgique"],
        "correct": "France"
    }
    return func.HttpResponse(json.dumps([sample_question]), mimetype="application/json")
