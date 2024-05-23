import os
import csv
import cv2
from imutils import face_utils

# http://dlib.net/face_detector.py.html
# This face detector is made using the now classic Histogram of Oriented Gradients (HOG) feature combined with a linear classifier, an image pyramid, and sliding window detection scheme.
import dlib


# This function extracts the face from an image using the Haar Cascade Classifier.
# The function takes the path to the image as input and returns the extracted face as a grayscale image.
def extract_face_using_haarcascade(image_path):
    # Load the image from the given path.
    input_image = cv2.imread(image_path)

    # Convert the image to grayscale.
    gray_input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

    # Load the Haar Cascade Classifier for detecting faces.
    faceCascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    # Detect the face in the image.
    face_coordinates = faceCascade.detectMultiScale(gray_input_image, 1.1, 5)[0]

    # Extract the face from the image.
    (x, y, w, h) = face_coordinates
    cropped_gray_image = gray_input_image[y + 3 : y + h - 2, x + 3 : x + w - 2]

    return cropped_gray_image


# This function extracts the face from an image using the Dlib library.
# The function takes the path to the image as input and returns the extracted face as a grayscale image.
def extract_face_using_dlib(image_path):
    # Load the image from the given path.
    input_image = cv2.imread(image_path)

    # Convert the image to grayscale.
    gray_input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

    # Load the face detector for detecting faces.
    detector = dlib.get_frontal_face_detector()

    # Detect the face in the image.
    face_rectangle = detector(gray_input_image, 1)[0]

    # Extract the face from the image.
    cropped_gray_image = gray_input_image[
        face_rectangle.top() : face_rectangle.bottom(),
        face_rectangle.left() : face_rectangle.right(),
    ]

    return cropped_gray_image


# This function saves a 48x48 grayscaled image at a specified path.
# The function takes the image and the path to save the resized image as input.
def save_image_at_given_path(image, save_path):
    # Save the resized image to the specified path.
    cv2.imwrite(save_path, image)


# This function saves a 48x48 grayscaled image pixels to a text file.
# The function takes the image and the path of the text file as input.
def save_image_to_txt(image, file_path):
    with open(file_path, "a") as file:
        for row in image:
            for pixel in row:
                file.write(str(pixel) + " ")
        file.write("\n")


def extract_feature_vectors_from_shape(shape):
    try:
        final_list = [[], [], [], [], [], [], []]

        for name, (i, j) in face_utils.FACIAL_LANDMARKS_IDXS.items():
            shape_list = []
            for x, y in shape[i:j]:
                shape_list.append([x, y])

                if name == "jaw":
                    final_list[0] = shape_list
                elif name == "right_eyebrow":
                    final_list[1] = shape_list
                elif name == "left_eyebrow":
                    final_list[2] = shape_list
                elif name == "nose":
                    final_list[3] = shape_list
                elif name == "right_eye":
                    final_list[4] = shape_list
                elif name == "left_eye":
                    final_list[5] = shape_list
                elif name == "mouth":
                    final_list[6] = shape_list

        truly_final_list = []

        for temp_list in final_list:
            for element in temp_list:
                truly_final_list.append(element)

        return truly_final_list
    except:
        return []


def extract_feature_vectors_from_full_image(image_path):
    try:
        input_image = cv2.imread(image_path)

        gray_input_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor(
            "D:/GitHub Repositories/Bachelor/Code/shape_predictor_68_face_landmarks.dat"
        )

        face_rectangle = detector(gray_input_image, 1)[0]

        face_shape = predictor(gray_input_image, face_rectangle)
        face_shape = face_utils.shape_to_np(face_shape)

        return extract_feature_vectors_from_shape(face_shape)
    except:
        return []


def extract_feature_vectors_from_resized_image(image):
    try:
        detector = dlib.get_frontal_face_detector()
        predictor = dlib.shape_predictor(
            "D:/GitHub Repositories/Bachelor/Code/shape_predictor_68_face_landmarks.dat"
        )

        face_rectangle = detector(image, 1)[0]

        face_shape = predictor(image, face_rectangle)
        face_shape = face_utils.shape_to_np(face_shape)

        return extract_feature_vectors_from_shape(face_shape)
    except:
        return []


def save_feature_vectors_to_txt(feature_vector, file_path):
    with open(file_path, "a") as file:
        for element in feature_vector:
            file.write(str(element) + " ")
        file.write("\n")


def save_image_to_csv(emotion_number, image, usage, csv_file_path):
    pixels_string = ""
    for row in image:
        for pixel in row:
            pixels_string += str(pixel) + " "
    pixels_string = pixels_string[:-1]

    with open(csv_file_path, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([emotion_number, pixels_string, usage])


def save_feature_vectors_to_csv(emotion_number, feature_vector, usage, csv_file_path):
    feature_vector_string = ""
    for element in feature_vector:
        for coordinate in element:
            feature_vector_string += str(coordinate) + " "
    feature_vector_string = feature_vector_string[:-1]

    with open(csv_file_path, "a", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([emotion_number, feature_vector_string, usage])


datasets_folder = "D:/GitHub Repositories/Bachelor/Datasets"
base_output_folder = "D:/GitHub Repositories/Bachelor/Results"

emotions = {
    "angry": 0,
    "disgust": 1,
    "fear": 2,
    "happy": 3,
    "neutral": 4,
    "sad": 5,
    "surprise": 6,
}


def process_kaggle_dataset():
    feature_vectors_csv_file_path = os.path.join(
        base_output_folder, "Kaggle", "feature_vectors.csv"
    )
    image_pixels_csv_file_path = os.path.join(
        base_output_folder, "Kaggle", "image_pixels.csv"
    )

    feature_vectors_csv_header = ["emotion", "feature_vector", "usage"]
    image_pixels_csv_header = ["emotion", "image", "usage"]

    feature_vectors_csv_file = open(feature_vectors_csv_file_path, "w", newline="")
    image_pixels_csv_file = open(image_pixels_csv_file_path, "w", newline="")

    feature_vectors_csv_writer = csv.writer(feature_vectors_csv_file)
    image_pixels_csv_writer = csv.writer(image_pixels_csv_file)

    feature_vectors_csv_writer.writerow(feature_vectors_csv_header)
    image_pixels_csv_writer.writerow(image_pixels_csv_header)

    current_dataset_folder = os.path.join(datasets_folder, "Kaggle", "images")

    usages = os.listdir(current_dataset_folder)

    for usage in usages:
        current_usage_folder = os.path.join(current_dataset_folder, usage)

        emotion_folders = os.listdir(current_usage_folder)

        for emotion_folder in emotion_folders:
            current_emotion_folder = os.path.join(current_usage_folder, emotion_folder)

            image_names = os.listdir(current_emotion_folder)

            for image_name in image_names:
                image_path = os.path.join(current_emotion_folder, image_name)

                input_image = cv2.imread(image_path)

                feature_vector = extract_feature_vectors_from_full_image(image_path)
                if len(feature_vector) == 68:
                    save_feature_vectors_to_csv(
                        emotions[emotion_folder],
                        feature_vector,
                        usage,
                        feature_vectors_csv_file_path,
                    )

                image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)

                save_image_to_csv(
                    emotions[emotion_folder], image, usage, image_pixels_csv_file_path
                )

                print(image_name + " processed.")


def main():
    # process_kaggle_dataset()
    pass


if __name__ == "__main__":
    main()
