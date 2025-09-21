# ML/app.py
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from tensorflow.keras.models import load_model
from tensorflow.keras.utils import img_to_array
from PIL import Image
import numpy as np
import uvicorn
import io
from pathlib import Path
import sys
import json

app = FastAPI()

# Allow local frontend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173", "http://localhost:8080"," http://192.168.1.174:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve model path
BASE_DIR = Path(__file__).resolve().parent
MODEL_FILENAME = "garbage_pothole_streetlight.keras"  # adjust if different
MODEL_PATH = BASE_DIR / MODEL_FILENAME

# Load model safely
def safe_load_model(path: Path):
    if not path.exists():
        raise FileNotFoundError(f"Model file not found at: {path}")
    try:
        print("Trying default load_model()...")
        model = load_model(str(path))
        print("Loaded model successfully.")
        return model
    except Exception as e1:
        try:
            print("Trying load_model(..., compile=False)...")
            model = load_model(str(path), compile=False)
            print("Loaded model with compile=False.")
            return model
        except Exception as e2:
            try:
                print("Trying load_model(..., safe_mode=False)...")
                model = load_model(str(path), safe_mode=False)
                print("Loaded model with safe_mode=False.")
                return model
            except Exception as e3:
                raise RuntimeError(
                    "Failed to load model. Errors:\n"
                    f"1) default: {repr(e1)}\n"
                    f"2) compile=False: {repr(e2)}\n"
                    f"3) safe_mode=False: {repr(e3)}\n"
                )

try:
    model = safe_load_model(MODEL_PATH)
except Exception as exc:
    print("ERROR loading model:", exc)
    sys.exit(1)

# Only 3 categories
CLASS_NAMES = ["garbage", "pothole", "streetlight"]

# Preprocess image bytes for prediction
def preprocess_image_bytes(image_bytes: bytes):
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize((222,222))  # model input size
    arr = img_to_array(img)
    arr = arr.astype("float32") / 255.0
    arr = np.expand_dims(arr, axis=0)  # batch dimension
    return arr

# POST endpoint for image prediction
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and preprocess
        image_bytes = await file.read()
        x = preprocess_image_bytes(image_bytes)

        # Predict
        preds = model.predict(x)
        print("Prediction raw:", preds)
        print("Prediction shape:", preds.shape)

        # Slice to first 3 values for your 3 categories
        preds = preds[:, :3]

        if len(preds) == 0 or len(preds[0]) == 0:
            return {"error": "Model returned empty predictions. Check input image and preprocessing."}

        class_index = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0]))
        result = {"prediction": CLASS_NAMES[class_index], "confidence": confidence}

        # Save JSON
        with open("prediction.json", "w") as f:
            json.dump(result, f, indent=4)

        return result

    except Exception as e:
        print("Prediction error:", repr(e))
        return {"error": str(e)}

# Run with python app.py
if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, log_level="info")
