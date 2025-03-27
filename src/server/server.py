from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib  # Used for loading .pkl models
import os
app = Flask(__name__)
CORS(app)

# Load your PCOS prediction model
model_path = os.path.abspath("./Model/pcos_risk_model.pkl")
model = joblib.load(model_path)  # Change this to your actual model file
CORS(app, resources={r"/*": {"origins": "http://localhost:8080"}})
@app.route("/")
def home():
    return "PCOS Prediction API is running!"
@app.route("/predict_pcos", methods=["POST"])
def predict_pcos():
    try:
        data = request.get_json()
        print("received")
        features = np.array(data["features"]).reshape(1, -1)  # Ensure correct shape

        probs = model.predict_proba(np.array(features).reshape(1, -1))[0][1] # Probability of PCOS being 1
        risk_percentage = round(probs * 100, 2)
        print(f"📌 Predicted PCOS Risk: {risk_percentage}%")
        print(risk_percentage)
        return jsonify({"success":True,"risk":int(risk_percentage)})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
