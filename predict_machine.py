import pandas as pd 
import joblib

def load_data():
    data = pd.read_csv('data.csv')
    return data

def ml_model_predict(iq, cgpa):
    pipeline = joblib.load("model_pipeline.pkl")
    d = pd.DataFrame({
        'IQ' : [iq],
        'CGPA' : [cgpa] 
    })
    prediction = pipeline.predict(d)
    if prediction[0] == 1:
        return "Placed"
    else:
        return "Not Placed"
