import pandas as pd

DATA_PATH = "data/raw/Telco-Customer-Churn.csv"


# Load dataset
df = pd.read_csv(DATA_PATH)

print("\n===== DATASET SHAPE =====")
print(df.shape)

print("\n===== COLUMNS =====")
print(df.columns.tolist())

print("\n===== FIRST 5 ROWS =====")
print(df.head())

print("\n===== DATA TYPES =====")
print(df.dtypes)

print("\n===== MISSING VALUES =====")
print(df.isnull().sum())

print("\n===== TARGET DISTRIBUTION =====")
print(df["Churn"].value_counts())

print("\n===== TARGET PERCENTAGE =====")
print(df["Churn"].value_counts(normalize=True) * 100)

print("\n===== BASIC NUMERICAL SUMMARY =====")
print(df.describe())
print("\n===== TOTALCHARGES NON-NUMERIC VALUES =====")

total_charges_numeric = pd.to_numeric(
    df["TotalCharges"],
    errors="coerce"
)

print("Non-numeric/invalid values:", total_charges_numeric.isna().sum())

print("\nRows with invalid TotalCharges:")
print(df.loc[total_charges_numeric.isna(), ["customerID", "tenure", "TotalCharges", "Churn"]])