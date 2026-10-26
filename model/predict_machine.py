import os
import pandas as pd 
import joblib

def placement_predictor(iq, cgpa):
    model_path = os.path.join(os.path.dirname(__file__), "model_pipeline.pkl")
    if not os.path.exists(model_path):
        model_path = "model_pipeline.pkl"
    pipeline = joblib.load(model_path)
    d = pd.DataFrame({
        'IQ' : [iq],
        'CGPA' : [cgpa] 
    })
    prediction = pipeline.predict(d)
    if prediction[0] == 1:
        return "Placed"
    else:
        return "Not Placed"
