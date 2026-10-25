from fastapi import FastAPI
from model import predict_data
from predict_machine import ml_model_predict

app = FastAPI()



@app.post('/predict')
def predict(data: predict_data):
    placement = ml_model_predict(data.iq, data.cgpa)
    return {"placement" : placement}
