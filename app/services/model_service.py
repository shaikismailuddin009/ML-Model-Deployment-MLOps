import joblib
import pandas as pd


MODEL_PATH = "models/churn_pipeline.joblib"


class ModelService:

    def __init__(self):
        self.pipeline = joblib.load(MODEL_PATH)

    def predict(self, customer_data: dict):

        data = pd.DataFrame(
            [customer_data]
        )

        prediction = self.pipeline.predict(data)

        return int(prediction[0])