# ML Model Deployment & MLOps Pipeline

A production-oriented machine learning project that trains, evaluates, persists, and serves a customer churn prediction model through a **FastAPI REST API**, with a **React frontend** for interactive predictions.

The project demonstrates an end-to-end machine learning workflow:

**Dataset → Data Preprocessing → Model Training → Evaluation → Model Persistence → REST API → React Frontend → Testing → Docker**

---

## 🚀 Project Overview

Customer churn prediction is a common machine learning problem where the goal is to identify customers who may discontinue a service.

This project uses the **IBM Telco Customer Churn dataset** to build a binary classification model that predicts whether a customer may churn.

The trained model is packaged together with its preprocessing steps using a Scikit-learn `Pipeline`, saved with `joblib`, and exposed through a FastAPI API.

A React-based dashboard provides a user-friendly interface for entering customer information and receiving predictions.

---

## ✨ Features

- 📊 Telco customer churn dataset
- 🧹 Data cleaning and preprocessing
- 🔢 Numeric feature imputation and scaling
- 🔤 Categorical feature encoding
- 🤖 Logistic Regression classification model
- 📈 Model evaluation with:
  - Accuracy
  - Precision
  - Recall
  - F1 Score
  - Confusion Matrix
- 💾 Complete ML pipeline saved using Joblib
- ⚡ FastAPI prediction API
- ❤️ API health-check endpoint
- 🧪 Automated API tests using Pytest
- ⚛️ React frontend dashboard
- 📱 Responsive frontend interface
- 🐳 Docker configuration
- 🔄 Git/GitHub version control
- 🚀 Ready for CI/CD integration

---

## 🏗️ Architecture

```text
                    ┌─────────────────────────┐
                    │   Telco Churn Dataset   │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Data Preprocessing    │
                    │                         │
                    │ • Missing values        │
                    │ • Scaling               │
                    │ • One-hot encoding      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Logistic Regression   │
                    │         Model           │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Saved ML Pipeline     │
                    │   churn_pipeline.joblib │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       FastAPI API       │
                    │                         │
                    │ GET  /                  │
                    │ GET  /health            │
                    │ POST /predict           │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      React Frontend     │
                    │                         │
                    │ • Dashboard             │
                    │ • Prediction Form       │
                    │ • Performance           │
                    │ • API Status            │
                    └─────────────────────────┘
```

---

## 🛠️ Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib

### Backend

- FastAPI
- Pydantic
- Uvicorn

### Frontend

- React
- Vite
- JavaScript
- CSS
- Lucide React

### Testing

- Pytest
- FastAPI TestClient

### DevOps / MLOps

- Git
- GitHub
- Docker
- GitHub Actions

---

## 📂 Project Structure

```text
ML-Model-Deployment-MLOps/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   └── services/
│       ├── __init__.py
│       └── model_service.py
│
├── data/
│   └── raw/
│       └── Telco-Customer-Churn.csv
│
├── models/
│   └── churn_pipeline.joblib
│
├── scripts/
│   ├── inspect_data.py
│   ├── train.py
│   └── test_saved_model.py
│
├── tests/
│   └── test_api.py
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── Dockerfile
├── .dockerignore
├── .gitignore
├── requirements.txt
└── README.md
```

---

# 📊 Dataset

The project uses the **IBM Telco Customer Churn dataset**.

Dataset characteristics:

- **7,043 customer records**
- **21 columns**
- Binary target variable: `Churn`
- Target classes:
  - `No`
  - `Yes`

The dataset contains customer information such as:

- Gender
- Senior citizen status
- Partner/dependent status
- Tenure
- Phone service
- Internet service
- Online security
- Technical support
- Contract type
- Payment method
- Monthly charges
- Total charges

---

# 🧹 Data Preprocessing

The training pipeline performs preprocessing automatically.

### Numeric features

The following numerical columns are processed using:

1. Median imputation
2. Standard scaling

```text
SeniorCitizen
tenure
MonthlyCharges
TotalCharges
```

### Categorical features

Categorical columns are processed using:

```text
OneHotEncoder(handle_unknown="ignore")
```

This converts categorical values into numerical features suitable for machine learning.

### Missing `TotalCharges`

`TotalCharges` is originally loaded as a string.

It is converted using:

```python
pd.to_numeric(
    df["TotalCharges"],
    errors="coerce"
)
```

Missing values are then handled by the preprocessing pipeline using median imputation.

---

# 🤖 Machine Learning Model

The project uses:

```text
Logistic Regression
```

The complete preprocessing and model workflow is combined into a single Scikit-learn pipeline:

```text
Input Data
    ↓
Numeric Preprocessing
    ↓
Categorical Preprocessing
    ↓
Feature Transformation
    ↓
Logistic Regression
    ↓
Prediction
```

The pipeline is saved as:

```text
models/churn_pipeline.joblib
```

This allows the same preprocessing logic used during training to be reused during inference.

---

# 📈 Model Evaluation

The dataset is split using an 80/20 stratified train-test split.

```text
Training samples: 5,634
Testing samples:  1,409
```

Current evaluation results:

| Metric | Score |
|---|---:|
| Accuracy | 80.55% |
| Precision | 65.72% |
| Recall | 55.88% |
| F1 Score | 60.40% |

Confusion matrix:

```text
[[926 109]
 [165 209]]
```

These results are based on the current training configuration and test split.

---

# ⚡ FastAPI Backend

The trained model is served using FastAPI.

## Start the API

From the project root:

```powershell
.\venv\Scripts\Activate.ps1
```

Then:

```powershell
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

---

## API Documentation

FastAPI automatically provides interactive Swagger documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

You can test the prediction API directly from the Swagger interface.

---

# 🔌 API Endpoints

## GET `/`

Returns the API status message.

Example:

```json
{
  "message": "ML Model Deployment API is running"
}
```

---

## GET `/health`

Health-check endpoint.

Example:

```json
{
  "status": "healthy"
}
```

---

## POST `/predict`

Accepts customer information and returns a churn prediction.

Example request:

```json
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
  "TotalCharges": 666.00
}
```

Example response:

```json
{
  "prediction": 0,
  "result": "Customer may not churn"
}
```

Prediction values:

```text
0 → Customer may not churn
1 → Customer may churn
```

---

# ⚛️ React Frontend

The project includes a React dashboard for interacting with the prediction API.

The frontend contains:

### Dashboard

Provides:

- Model information
- Accuracy
- API status
- ML pipeline overview
- Model metrics

### Predict Churn

Interactive form containing the model's customer features.

The form sends the data to:

```text
POST /predict
```

and displays the returned prediction.

### Performance

Displays:

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion matrix

### API Status

Displays the current backend health status and available API endpoints.

---

# ▶️ Run the Frontend

Open a second terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

Make sure the FastAPI backend is running at the same time.

---

# 🧪 Testing

The project includes automated API tests using Pytest.

From the project root:

```powershell
python -m pytest
```

Current test coverage includes:

- Root endpoint
- Prediction endpoint
- Health endpoint

Expected result:

```text
3 passed
```

---

# 💾 Model Persistence

The trained model is stored as:

```text
models/churn_pipeline.joblib
```

The saved object contains the complete Scikit-learn pipeline, including:

```text
Preprocessing
     +
Feature Transformation
     +
Logistic Regression Model
```

This avoids having separate preprocessing logic between training and prediction.

---

# 🐳 Docker

A Docker configuration is included for containerized deployment.

Build the image:

```powershell
docker build -t ml-churn-api .
```

Run the container:

```powershell
docker run -p 8000:8000 ml-churn-api
```

The API can then be accessed at:

```text
http://localhost:8000
```

Swagger:

```text
http://localhost:8000/docs
```

---

# 🔄 Machine Learning Workflow

The training process can be reproduced using:

```powershell
python scripts/train.py
```

The workflow is:

```text
Load Dataset
     ↓
Inspect Data
     ↓
Clean Data
     ↓
Convert Target
     ↓
Train/Test Split
     ↓
Build Preprocessing Pipeline
     ↓
Train Logistic Regression
     ↓
Evaluate Model
     ↓
Save Pipeline
```

---

# 🔐 Engineering Practices

This project demonstrates several practical ML engineering concepts:

- Reproducible train/test splitting
- Stratified sampling
- Pipeline-based preprocessing
- Handling missing values
- Feature scaling
- Categorical encoding
- Model serialization
- REST API serving
- API health monitoring
- Automated testing
- Frontend/backend integration
- Docker configuration
- Git version control

---

# 🚧 Future Improvements

Possible next steps for the project include:

- [ ] GitHub Actions CI/CD pipeline
- [ ] Automated model training workflow
- [ ] Model versioning
- [ ] Experiment tracking
- [ ] MLflow integration
- [ ] Model monitoring
- [ ] Data drift detection
- [ ] Prediction logging
- [ ] Docker deployment
- [ ] Cloud deployment
- [ ] Improved class-imbalance handling
- [ ] Hyperparameter tuning
- [ ] Additional ML models for comparison

---

# 📌 Disclaimer

This project is developed for educational and demonstration purposes.

The churn predictions are machine learning outputs and should not be treated as definitive business decisions without appropriate validation and domain-specific analysis.

---

## 👨‍💻 Author

**Shaik Ismailuddin**

Computer Science & Engineering

GitHub:

`https://github.com/shaikismailuddin009`

---

## ⭐ Project Highlights

This project demonstrates an end-to-end transition from a trained machine learning model to a usable software system:

```text
Machine Learning
       ↓
Model Pipeline
       ↓
Model Persistence
       ↓
FastAPI
       ↓
Automated Tests
       ↓
React Dashboard
       ↓
Docker
       ↓
MLOps / CI-CD
```

Built to demonstrate practical **Machine Learning Engineering, API Development, and MLOps** skills.
