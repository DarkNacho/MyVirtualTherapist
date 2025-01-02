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
