import csv
import json

# Define the input and output file paths
input_file = "c:/Users/DarkNacho/Smart-Mesck-Web/public/listado_medicamentos.csv"
output_file = "c:/Users/DarkNacho/Smart-Mesck-Web/public/listado_medicamentos.json"

# Read the CSV file
with open(input_file, mode="r", encoding="utf-16") as csv_file:
    # csv_reader = csv.DictReader(csv_file, delimiter="\t")
    csv_reader = csv.reader(csv_file, delimiter="\t")

    data = [
        {
            "code": row[0],
            "display": row[1],
            "system": "https://www.cenabast.cl",
        }
        for row in csv_reader
    ]

    # data = [row for row in csv_reader]

# Write the JSON file
with open(output_file, mode="w", encoding="utf-8") as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=4)

print(f"CSV data has been successfully converted to JSON and saved to {output_file}")
