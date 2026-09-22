import joblib
import pandas as pd


MODEL_PATH = "models/churn_pipeline.joblib"


# Load saved pipeline
pipeline = joblib.load(MODEL_PATH)

print("Saved model loaded successfully.")


# Example customer
customer = pd.DataFrame([
    {
        "gender": "Male",
        "SeniorCitizen": 0,
        "Partner": "Yes",
        "Dependents": "No",
        "tenure": 12,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "DSL",
        "OnlineSecurity": "No",
        "OnlineBackup": "Yes",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "No",
        "StreamingMovies": "No",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 55.50,
        "TotalCharges": 666.00,
    }
])


# Make prediction
prediction = pipeline.predict(customer)

print("\n===== PREDICTION =====")

if prediction[0] == 1:
    print("Prediction: Customer may churn")
else:
    print("Prediction: Customer may not churn")