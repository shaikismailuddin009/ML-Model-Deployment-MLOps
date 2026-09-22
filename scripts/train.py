import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)


DATA_PATH = "data/raw/Telco-Customer-Churn.csv"


# ==========================================
# 1. LOAD DATASET
# ==========================================

df = pd.read_csv(DATA_PATH)

print("Original dataset shape:", df.shape)


# ==========================================
# 2. CONVERT TOTALCHARGES TO NUMERIC
# ==========================================

df["TotalCharges"] = pd.to_numeric(
    df["TotalCharges"],
    errors="coerce"
)

print("\nMissing values after conversion:")
print(df.isnull().sum())


# ==========================================
# 3. REMOVE CUSTOMER ID
# ==========================================

df = df.drop(columns=["customerID"])


# ==========================================
# 4. ENCODE TARGET
# ==========================================

df["Churn"] = df["Churn"].map({
    "No": 0,
    "Yes": 1
})


X = df.drop(columns=["Churn"])
y = df["Churn"]

print("\nFeatures shape:", X.shape)
print("Target shape:", y.shape)


# ==========================================
# 5. TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\n===== TRAIN/TEST SPLIT =====")
print("Training features:", X_train.shape)
print("Testing features:", X_test.shape)

print("\nTraining target distribution:")
print(y_train.value_counts(normalize=True))

print("\nTesting target distribution:")
print(y_test.value_counts(normalize=True))


# ==========================================
# 6. DEFINE FEATURES
# ==========================================

numeric_features = [
    "SeniorCitizen",
    "tenure",
    "MonthlyCharges",
    "TotalCharges",
]

categorical_features = [
    "gender",
    "Partner",
    "Dependents",
    "PhoneService",
    "MultipleLines",
    "InternetService",
    "OnlineSecurity",
    "OnlineBackup",
    "DeviceProtection",
    "TechSupport",
    "StreamingTV",
    "StreamingMovies",
    "Contract",
    "PaperlessBilling",
    "PaymentMethod",
]


# ==========================================
# 7. NUMERIC PREPROCESSING
# ==========================================

numeric_pipeline = Pipeline(
    steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler()),
    ]
)


# ==========================================
# 8. CATEGORICAL PREPROCESSING
# ==========================================

categorical_pipeline = Pipeline(
    steps=[
        (
            "onehot",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False,
            ),
        ),
    ]
)


# ==========================================
# 9. COMBINE PREPROCESSING
# ==========================================

preprocessor = ColumnTransformer(
    transformers=[
        ("numeric", numeric_pipeline, numeric_features),
        ("categorical", categorical_pipeline, categorical_features),
    ]
)

print("\nPreprocessor created successfully.")


# ==========================================
# 10. CREATE ML PIPELINE
# ==========================================

model = LogisticRegression(
    max_iter=1000,
    random_state=42
)

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)

print("\nML pipeline created successfully.")


# ==========================================
# 11. TRAIN ML PIPELINE
# ==========================================

pipeline.fit(X_train, y_train)

print("\n===== MODEL TRAINING =====")
print("Logistic Regression model trained successfully.")


# ==========================================
# 12. MAKE TEST PREDICTIONS
# ==========================================

y_pred = pipeline.predict(X_test)


# ==========================================
# 13. MODEL EVALUATION
# ==========================================

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

cm = confusion_matrix(y_test, y_pred)

print("\n===== MODEL EVALUATION =====")
print(f"Accuracy:  {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall:    {recall:.4f}")
print(f"F1 Score:  {f1:.4f}")

print("\nConfusion Matrix:")
print(cm)


# ==========================================
# 14. SAVE MODEL PIPELINE
# ==========================================

MODEL_PATH = "models/churn_pipeline.joblib"

joblib.dump(pipeline, MODEL_PATH)

print("\n===== MODEL SAVED =====")
print(f"Model pipeline saved to: {MODEL_PATH}")