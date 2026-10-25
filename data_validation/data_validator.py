from pydantic import BaseModel

class predict_data(BaseModel):
    iq: int
    cgpa: float