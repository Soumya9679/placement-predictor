# Placement Predictor 🎓

A full-stack Machine Learning web application and API that predicts student campus placement outcomes based on **IQ** and **CGPA**. Built with **FastAPI**, **Scikit-Learn**, and a minimalist, monochrome dashboard UI.

---

## 📌 Features

- **Machine Learning Pipeline**: Trained on student records using a Scikit-Learn pipeline (`StandardScaler` + `LogisticRegression`).
- **RESTful API**: FastAPI backend with data validation using Pydantic.
- **Minimalist Dashboard**: Clean, slate/monochrome user interface designed with zero loud RGB colors.
- **Real-Time Assessment Log**: Tracks and displays previous session predictions in an assessment log table.
- **Production Ready**: One-click deployable to Render, Railway, or Docker with auto-configured ports and CORS enabled.

---

## 📁 Project Structure

```text
predict_placements/
├── data_validation/
│   └── data_validator.py       # Pydantic schema for input validation
├── frontend/
│   ├── index.html              # Dashboard interface
│   ├── styles.css              # Minimalist monochrome design system
│   └── app.js                  # Frontend client logic & API handler
├── model/
│   ├── model_pipeline.pkl      # Serialized Scikit-Learn pipeline
│   └── predict_machine.py      # Inference logic
├── model__training/
│   ├── data/
│   │   └── data.csv            # Training dataset
│   └── model_training.py       # Model training & serialization script
├── main.py                     # FastAPI application & static server
├── Procfile                    # Cloud deployment process file (Render/Railway)
├── requirements.txt            # Python dependencies
└── README.md
```

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/Soumya9679/placement-predictor.git
cd placement-predictor
```

### 2. Set Up Virtual Environment
```bash
# Windows
python -m venv myenv
.\myenv\Scripts\activate

# macOS / Linux
python3 -m venv myenv
source myenv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the Application
```bash
uvicorn main:app --reload
```
The application will be live at **`http://127.0.0.1:8000/`**.

---

## 📡 API Documentation

### **Predict Placement Endpoint**

- **URL**: `/predict`
- **Method**: `POST`
- **Content-Type**: `application/json`

#### Request Body:
```json
{
  "iq": 110,
  "cgpa": 8.5
}
```

#### Field Constraints:
| Field | Type | Description | Range |
|-------|------|-------------|-------|
| `iq` | Integer | Candidate IQ score | e.g. `50 - 200` |
| `cgpa` | Float | Candidate CGPA | `0.00 - 10.00` |

#### Successful Response (`200 OK`):
```json
{
  "Placement": "Placed"
}
```
*(Returns `"Placed"` or `"Not Placed"`)*

#### Interactive API Docs:
FastAPI automatically provides interactive Swagger documentation at:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

---

## 🚢 Deployment Guide

This project is configured for one-click deployment on platforms like **Render**, **Railway**, or **Heroku**.

### Deploying to Render
1. Push your repository to GitHub.
2. Go to [Render](https://render.com) and create a **New Web Service**.
3. Link your repository.
4. Set the following build and run commands:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Click **Deploy**. Both the API and dashboard will be available at your assigned Render URL.

---

## 🛠️ Tech Stack

- **Backend**: [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/)
- **Machine Learning**: [Scikit-Learn](https://scikit-learn.org/), [Joblib](https://joblib.readthedocs.io/), [Pandas](https://pandas.pydata.org/)
- **Validation**: [Pydantic](https://docs.pydantic.dev/)
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (Monochrome / Slate UI)

---

## 📄 License
MIT License. Feel free to use and adapt this project for your own machine learning deployments!
