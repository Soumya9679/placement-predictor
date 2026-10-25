import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score
from sklearn.pipeline import Pipeline
from predict_machine import load_data

data = load_data()

X = data.drop("Placement", axis=1)
Y = data["Placement"]

scaler = StandardScaler()
model = LogisticRegression()

pipeline = Pipeline([
    ("scaler", scaler),
    ("model", model)
])


X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.1)


pipeline.fit(X_train, Y_train)

prediction = pipeline.predict(X_test)

print(accuracy_score(prediction, Y_test))

joblib.dump(pipeline, "model_pipeline.pkl")

