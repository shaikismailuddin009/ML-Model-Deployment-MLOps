from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.model_service import ModelService


app = FastAPI(
    title="ML Model Deployment API",
    description="Customer churn prediction API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


model_service = ModelService()


model_service = ModelService()


class CustomerData(BaseModel):
    gender: str
    SeniorCitizen: int
    Partner: str
    Dependents: str
    tenure: int
    PhoneService: str
    MultipleLines: str
    InternetService: str
    OnlineSecurity: str
    OnlineBackup: str
    DeviceProtection: str
    TechSupport: str
    StreamingTV: str
    StreamingMovies: str
    Contract: str
    PaperlessBilling: str
    PaymentMethod: str
    MonthlyCharges: float
    TotalCharges: float


@app.get("/")
def root():
    return {
        "message": "ML Model Deployment API is running"
    }


@app.post("/predict")
def predict(customer: CustomerData):

    prediction = model_service.predict(
        customer.model_dump()
    )

    if prediction == 1:
        result = "Customer may churn"
    else:
        result = "Customer may not churn"

    return {
        "prediction": prediction,
        "result": result
    }
@app.get("/health")
def health():
    return {
        "status": "healthy"
    }