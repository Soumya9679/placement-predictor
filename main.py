from fastapi import FastAPI
from data_validation.data_validator import predict_data
from model.predict_machine import placement_predictor

app = FastAPI()



@app.post('/predict')
def predict(data: predict_data):
    placement = placement_predictor(data.iq, data.cgpa)
    return {"placement" : placement}
