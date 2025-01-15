import os
import json
import requests
from datetime import datetime, timedelta

API_URL = "https://mvt-fhir.cttn.cl/fhir/Questionnaire"
# JWT_TOKEN = token


def send_post_request(json_data):
    headers = {
        # "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json; charset=utf-8",
    }
    response = requests.post(API_URL, headers=headers, json=json_data)
    return response


def get_all_questionnaires():
    headers = {
        # "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json; charset=utf-8",
    }
    response = requests.get(API_URL, headers=headers)
    if response.status_code == 200:
        return response.json().get("entry", [])
    else:
        print(f"Failed to retrieve questionnaires: {response.status_code}")
        return []


def delete_questionnaire(questionnaire_id):
    headers = {
        # "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json; charset=utf-8",
    }
    delete_url = f"{API_URL}/{questionnaire_id}"
    response = requests.delete(delete_url, headers=headers)
    return response


def delete_all_questionnaires():
    questionnaires = get_all_questionnaires()
    for entry in questionnaires:
        questionnaire_id = entry["resource"]["id"]
        questionnaire_title = entry["resource"]["title"]
        response = delete_questionnaire(questionnaire_id)
        if response.status_code == 204:
            print(
                f"Deleted questionnaire {questionnaire_title}, id: {questionnaire_id}"
            )
        else:
            print(
                f"Failed to delete questionnaire {questionnaire_title}, id: {questionnaire_id}: {response.status_code}"
            )


def main():
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_folder_path = script_dir  # JSON files are in the same directory as the script

    for filename in os.listdir(json_folder_path):
        if filename.endswith(".json"):
            file_path = os.path.join(json_folder_path, filename)
            try:
                with open(file_path, "r", encoding="utf-8") as json_file:
                    json_data = json.load(json_file)
                    response = send_post_request(json_data)
                    print(f"Sent {filename}: {response.status_code}")
            except Exception as e:
                print(f"Failed to send {filename}: {e}")


if __name__ == "__main__":
    main()
    # Uncomment the following line to delete all questionnaires
    # delete_all_questionnaires()
