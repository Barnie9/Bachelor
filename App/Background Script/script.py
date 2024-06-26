import os
import cv2
import time
import requests
import json
from datetime import datetime


time_interval = 5 * 60


url = 'http://localhost:5175/api/Predictor'

headers = {
    'accept': '*/*',
    'Content-Type': 'application/json',
}


def extract_face_using_haarcascade(image):
    gray_input_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    faceCascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    face_coordinates_list = faceCascade.detectMultiScale(gray_input_image, 1.1, 5)
    
    if len(face_coordinates_list) == 0:
        return None
    
    face_coordinates = face_coordinates_list[0]

    (x, y, w, h) = face_coordinates
    cropped_gray_image = gray_input_image[y + 3 : y + h - 2, x + 3 : x + w - 2]

    return cropped_gray_image


def send_request(username, timestamp, image_pixels):
    data = {
        "Username": username,
        "Timestamp": timestamp,
        "ImagePixels": image_pixels
    }

    response = requests.post(url, headers=headers, data=json.dumps(data), verify=False)

    if response.status_code == 200:
        print("Request sent successfully.")
    else:
        print("Failed to send request.")


def main():
    current_username = os.getlogin()

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open camera.")
        return

    try:
        while True:
            ret, frame = cap.read()

            if not ret:
                continue

            cropped_gray_image = extract_face_using_haarcascade(frame)

            if cropped_gray_image is None:
                print("No face detected.")
                continue
            
            resized_image = cv2.resize(cropped_gray_image, (48, 48))
            
            image_pixels = resized_image.flatten().tolist()

            timestamp = datetime.now().isoformat()
            
            send_request(current_username, timestamp, image_pixels)

            time.sleep(time_interval)

    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
