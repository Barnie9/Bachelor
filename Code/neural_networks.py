import os
import pandas as pd
import numpy as np
import tensorflow as tf

import cv2

from keras.models import Sequential, Model
from keras.layers import (
    Conv2D,
    MaxPooling2D,
    Flatten,
    Dense,
    Dropout,
    Input,
    concatenate,
    Reshape,
)
from keras.optimizers import Adam
from keras.utils import to_categorical
from keras.callbacks import CSVLogger
from keras.applications import VGG16

# ---------- Helper functions ----------


def process_images(images):
    processed_images = []

    for i in range(len(images)):
        image = images[i].split(" ")
        image = np.array([int(pixel) for pixel in image], dtype=np.float32) / 255.0
        image = image.reshape(48, 48, 1)
        processed_images.append(image)

    return np.array(processed_images)


def process_images_with_3_layers(images):
    processed_images = []

    for i in range(len(images)):
        image = images[i].split(" ")
        image = np.array([int(pixel) for pixel in image], dtype=np.float32) / 255.0
        image = image.reshape(48, 48, 1)
        # Convert grayscale to RGB by repeating the grayscale data across 3 channels for the VGG16 model
        image = np.repeat(image, 3, axis=-1)
        processed_images.append(image)

    return np.array(processed_images)


# ---------- Load the data ----------

base_folder = "D:/GitHub Repositories/Bachelor/Results"

# ---------- FER2013 Dataset ----------
"""
fer2013_csv_file_path = os.path.join(base_folder, "fer2013.csv")

fer2013_data = pd.read_csv(fer2013_csv_file_path)

fer2013_training_data = fer2013_data[fer2013_data["usage"] == "train"]
fer2013_validation_data = fer2013_data[fer2013_data["usage"] == "validation"]

fer2013_raw_training_images = fer2013_training_data["image"].values
fer2013_raw_validation_images = fer2013_validation_data["image"].values

fer2013_raw_training_labels = fer2013_training_data["emotion"].values
fer2013_raw_validation_labels = fer2013_validation_data["emotion"].values

fer2013_training_images = process_images(fer2013_raw_training_images)
fer2013_validation_images = process_images(fer2013_raw_validation_images)

fer2013_training_images_3_layers = process_images_with_3_layers(
    fer2013_raw_training_images
)
fer2013_validation_images_3_layers = process_images_with_3_layers(
    fer2013_raw_validation_images
)

fer2013_training_labels = to_categorical(fer2013_raw_training_labels, 7)
fer2013_validation_labels = to_categorical(fer2013_raw_validation_labels, 7)
"""
# ---------- CK+ Dataset ----------

ck_plus_csv_file_path = os.path.join(base_folder, "ck_plus.csv")

ck_plus_data = pd.read_csv(ck_plus_csv_file_path)

ck_plus_training_data = ck_plus_data[ck_plus_data["Usage"] == "Training"]
ck_plus_validation_data = ck_plus_data[ck_plus_data["Usage"] == "PrivateTest"]

ck_plus_raw_training_images = ck_plus_training_data["pixels"].values
ck_plus_raw_validation_images = ck_plus_validation_data["pixels"].values

ck_plus_raw_training_labels = ck_plus_training_data["emotion"].values
ck_plus_raw_validation_labels = ck_plus_validation_data["emotion"].values

ck_plus_training_images = process_images(ck_plus_raw_training_images)
ck_plus_validation_images = process_images(ck_plus_raw_validation_images)

ck_plus_training_images_3_layers = process_images_with_3_layers(
    ck_plus_raw_training_images
)
ck_plus_validation_images_3_layers = process_images_with_3_layers(
    ck_plus_raw_validation_images
)

print(ck_plus_raw_validation_labels)

ck_plus_training_labels = to_categorical(ck_plus_raw_training_labels, 7)
ck_plus_validation_labels = to_categorical(ck_plus_raw_validation_labels, 7)

# ---------- AlexNet Model ----------


def AlexNetModel():
    model = Sequential()

    # Adjusted first convolutional layer with smaller stride
    model.add(
        Conv2D(
            filters=96,
            kernel_size=(3, 3),
            strides=(1, 1),
            activation="relu",
            input_shape=(48, 48, 1),
        )
    )
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Second convolutional layer
    model.add(Conv2D(filters=256, kernel_size=(3, 3), activation="relu"))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Reduced number of layers with smaller kernels to maintain feature map size
    model.add(Conv2D(filters=384, kernel_size=(3, 3), activation="relu"))

    # Less aggressive max pooling to preserve spatial dimensions
    model.add(MaxPooling2D(pool_size=(2, 2)))

    # Flattening the layers
    model.add(Flatten())

    # Fully connected layers
    model.add(
        Dense(units=1024, activation="relu")
    )  # Reduced units to fit the smaller model size
    model.add(Dropout(0.5))
    model.add(Dense(units=1024, activation="relu"))
    model.add(Dropout(0.5))

    # Output layer for classification
    model.add(
        Dense(units=7, activation="softmax")
    )  # Assuming 7 classes as per your labels

    # Compile the model
    model.compile(
        optimizer=Adam(), loss="categorical_crossentropy", metrics=["accuracy"]
    )

    return model


# ---------- Inception Based Model ----------
# https://ieeexplore.ieee.org/abstract/document/7477450


def inception_module(x, filters):
    # 1x1 conv
    conv1 = Conv2D(filters, (1, 1), padding="same", activation="relu")(x)

    # 3x3 conv
    conv3 = Conv2D(filters, (3, 3), padding="same", activation="relu")(x)

    # 5x5 conv
    conv5 = Conv2D(filters, (5, 5), padding="same", activation="relu")(x)

    # 3x3 max pooling
    pool = MaxPooling2D((3, 3), strides=(1, 1), padding="same")(x)

    # concatenate filters, assumes filters/channels last
    output = concatenate([conv1, conv3, conv5, pool], axis=-1)
    return output


def InceptionModel():
    input_layer = Input(shape=(48, 48, 1))  # (height, width, depth)

    # Applying inception modules
    x = inception_module(input_layer, 64)  # Modify filters based on your specific needs
    x = MaxPooling2D(pool_size=(3, 3), strides=(2, 2), padding="same")(x)

    # Add more inception blocks as needed
    x = inception_module(x, 128)
    x = MaxPooling2D(pool_size=(3, 3), strides=(2, 2), padding="same")(x)

    # Flattening to connect to fully connected layers
    x = Flatten()(x)
    x = Dense(1024, activation="relu")(
        x
    )  # Example of a dense layer before the final output
    output = Dense(7, activation="softmax")(
        x
    )  # Assuming 10 output classes for classification

    model = Model(inputs=input_layer, outputs=output)

    # Compile the model
    model.compile(
        optimizer="adam", loss="categorical_crossentropy", metrics=["accuracy"]
    )

    return model


# ---------- Custom Model ----------
# https://ieeexplore.ieee.org/document/9074302


def CustomModel1():
    model = Sequential()

    # First convolutional layer
    model.add(Conv2D(32, (3, 3), activation="relu", input_shape=(48, 48, 1)))
    model.add(MaxPooling2D((2, 2)))

    # Optional: Add dropout to reduce overfitting
    model.add(Dropout(0.25))

    # Second convolutional layer
    model.add(Conv2D(32, (3, 3), activation="relu"))
    model.add(MaxPooling2D((2, 2)))

    # Optional: Add another dropout layer
    model.add(Dropout(0.25))

    # Flatten before passing to the dense layers
    model.add(Flatten())

    # Dense layer
    model.add(Dense(256, activation="relu"))

    # Output layer with softmax activation for multi-class classification
    model.add(
        Dense(7, activation="softmax")
    )  # Assuming 5 classes as per your model summary

    # Compile the model
    model.compile(
        optimizer=Adam(learning_rate=0.01),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ---------- Faster R-CNN Model Without BBox ----------


def FasterRCNNWithoutBBox():
    # Load VGG16 without the top layer and freeze its layers
    vgg = VGG16(include_top=False, weights="imagenet", input_shape=(48, 48, 3))
    for layer in vgg.layers:
        layer.trainable = False

    # Output from VGG16 used as feature map
    feature_map = vgg.output
    flat_feature_map = Flatten()(feature_map)
    fc_layer = Dense(4096, activation="relu")(flat_feature_map)
    dropout = Dropout(0.5)(fc_layer)

    # Output layer for emotion classification with 7 classes
    emotion_classifier = Dense(7, activation="softmax", name="emotion_classifier")(
        dropout
    )

    # Create the model
    model = Model(inputs=vgg.input, outputs=emotion_classifier)

    # Compile the model with categorical crossentropy for multi-class classification
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ---------- Faster R-CNN Model ----------
# https://ieeexplore.ieee.org/document/10435819


def generate_full_image_bboxes(images):
    bboxes = []
    for i in range(len(images)):
        bboxes.append([0, 0, 48, 48])  # Assuming the entire image is the bounding box
    return np.array(bboxes)


def generate_bboxes(images):
    # Load a pre-trained face detection model
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    bboxes = []  # List to hold bounding boxes
    for img in images:
        # Ensure the image is a 2D array of shape (48, 48)
        if img.ndim == 3 and img.shape[2] == 1:
            img = img.squeeze()  # Remove single-channel dimension if necessary

        # Convert the single channel image to 3 channel image
        # First ensure the image is of type uint8
        img_uint8 = (
            (img * 255).astype(np.uint8) if np.max(img) <= 1.0 else img.astype(np.uint8)
        )
        img_rgb = np.stack([img_uint8] * 3, axis=-1)  # Stack along the channel axis

        # Detect faces
        faces = face_cascade.detectMultiScale(
            img_rgb, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )

        # Assume the largest detected face is the target face
        if len(faces) > 0:
            faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
            x, y, w, h = faces[0]
            bboxes.append([x, y, x + w, y + h])
        else:
            # No face found, use a default box (or you might handle this case differently)
            bboxes.append([0, 0, 48, 48])

    return np.array(bboxes)


def generate_cls_labels(images):
    # Since every image in FER2013 is centered on a face, we can simply return ones
    return np.ones((len(images), 1))  # Shape (None, 1)


def FasterRCNN():
    # Load the VGG16 model, pretrained on ImageNet
    vgg = VGG16(include_top=False, weights="imagenet", input_shape=(48, 48, 3))
    for layer in vgg.layers:
        layer.trainable = False  # Freeze the layers

    # Define the RPN, built on the feature map outputs from VGG16
    base_layers = vgg.output
    rpn = Conv2D(256, (3, 3), padding="same", activation="relu")(base_layers)
    cls = Conv2D(1, (1, 1), activation="sigmoid")(rpn)  # Classifier layer
    cls = Reshape((-1,))(cls)  # Flatten cls to match (None, 1)
    regr = Conv2D(4, (1, 1), activation="linear")(rpn)  # Regression layer
    regr = Reshape((-1, 4))(regr)  # Flatten regr to match (None, 4)

    # Define the classifier model that uses the output of the RPN
    out_roi_pool = Flatten()(base_layers)  # Simplified for explanation
    out = Dense(4096, activation="relu")(out_roi_pool)
    out = Dropout(0.5)(out)
    out_class = Dense(7, activation="softmax")(out)  # For 7 emotions

    model = Model(inputs=vgg.input, outputs=[cls, regr, out_class])

    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss=["binary_crossentropy", "mse", "categorical_crossentropy"],
        metrics={
            "reshape": [],  # cls output
            "reshape_1": [],  # regr output
            "dense_1": ["accuracy"],  # out_class output
        },
    )

    return model


# ---------- Main function ----------


def fit_alexnet_model(
    dataset_name, training_images, validation_images, training_labels, validation_labels
):
    alexnet_model_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "alexnet_log.csv")
    )

    alexnet_model = AlexNetModel()

    alexnet_model.fit(
        training_images,
        training_labels,
        batch_size=64,
        epochs=50,
        validation_data=(validation_images, validation_labels),
        callbacks=[alexnet_model_csv_logger],
    )


def fit_inception_based_model(
    dataset_name, training_images, validation_images, training_labels, validation_labels
):
    inception_based_model_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "inception_based_log.csv")
    )

    inception_based_model = InceptionModel()

    inception_based_model.fit(
        training_images,
        training_labels,
        batch_size=64,
        epochs=50,
        validation_data=(validation_images, validation_labels),
        callbacks=[inception_based_model_csv_logger],
    )


def fit_custom_model_1(
    dataset_name, training_images, validation_images, training_labels, validation_labels
):
    custom_model_1_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "custom_model_1_log.csv")
    )

    custom_model_1 = CustomModel1()

    custom_model_1.fit(
        training_images,
        training_labels,
        batch_size=64,
        epochs=50,
        validation_data=(validation_images, validation_labels),
        callbacks=[custom_model_1_csv_logger],
    )


def fit_faster_rcnn_without_bbox_model(
    dataset_name,
    training_images_3_layers,
    validation_images_3_layers,
    training_labels,
    validation_labels,
):
    faster_rcnn_without_bbox_model_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "faster_rcnn_without_bbox_log.csv")
    )

    faster_rcnn_without_bbox_model = FasterRCNNWithoutBBox()

    faster_rcnn_without_bbox_model.fit(
        training_images_3_layers,
        training_labels,
        batch_size=32,
        epochs=50,
        validation_data=(validation_images_3_layers, validation_labels),
        callbacks=[faster_rcnn_without_bbox_model_csv_logger],
    )


def fit_faster_rcnn_with_full_image_bbox_model(
    dataset_name,
    training_images_3_layers,
    validation_images_3_layers,
    training_images,
    validation_images,
    training_labels,
    validation_labels,
):
    faster_rcnn_with_full_image_bbox_model_csv_logger = CSVLogger(
        os.path.join(
            base_folder, dataset_name, "faster_rcnn_with_full_image_bbox_log.csv"
        )
    )

    faster_rcnn_model = FasterRCNN()

    faster_rcnn_model.fit(
        training_images_3_layers,
        [
            generate_cls_labels(training_labels),
            generate_full_image_bboxes(training_images),
            training_labels,
        ],
        validation_data=(
            validation_images_3_layers,
            [
                generate_cls_labels(validation_labels),
                generate_full_image_bboxes(validation_images),
                validation_labels,
            ],
        ),
        epochs=50,
        batch_size=32,
        callbacks=[faster_rcnn_with_full_image_bbox_model_csv_logger],
    )


def fit_faster_rcnn_with_bbox_model(
    dataset_name,
    training_images_3_layers,
    validation_images_3_layers,
    training_images,
    validation_images,
    training_labels,
    validation_labels,
):
    faster_rcnn_with_bbox_model_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "faster_rcnn_with_bbox_log.csv")
    )

    faster_rcnn_model = FasterRCNN()

    faster_rcnn_model.fit(
        training_images_3_layers,
        [
            generate_cls_labels(training_labels),
            generate_bboxes(training_images),
            training_labels,
        ],
        validation_data=(
            validation_images_3_layers,
            [
                generate_cls_labels(validation_labels),
                generate_bboxes(validation_images),
                validation_labels,
            ],
        ),
        epochs=50,
        batch_size=32,
        callbacks=[faster_rcnn_with_bbox_model_csv_logger],
    )


def main():
    # fit_alexnet_model(
    #     "fer2013",
    #     fer2013_training_images,
    #     fer2013_validation_images,
    #     fer2013_training_labels,
    #     fer2013_validation_labels,
    # )
    # fit_inception_based_model(
    #     "fer2013",
    #     fer2013_training_images,
    #     fer2013_validation_images,
    #     fer2013_training_labels,
    #     fer2013_validation_labels,
    # )
    # fit_custom_model_1(
    #     "fer2013",
    #     fer2013_training_images,
    #     fer2013_validation_images,
    #     fer2013_training_labels,
    #     fer2013_validation_labels,
    # )
    # fit_faster_rcnn_without_bbox_model(
    #     "fer2013",
    #     fer2013_training_images_3_layers,
    #     fer2013_validation_images_3_layers,
    #     fer2013_training_labels,
    #     fer2013_validation_labels,
    # )
    # fit_faster_rcnn_with_full_image_bbox_model(
    #     "fer2013",
    #     fer2013_training_images_3_layers,
    #     fer2013_validation_images_3_layers,
    #     fer2013_training_images,
    #     fer2013_validation_images,
    #     fer2013_training_labels,
    #     fer2013_validation_labels,
    # )
    # fit_faster_rcnn_with_bbox_model(
    #     "fer2013",
    #     fer2013_training_images_3_layers,
    #     fer2013_validation_images_3_layers,
    #     fer2013_training_images,
    #     fer2013_validation_images,
    #     fer2013_training_labels,
    #     fer2013_validation_labels,
    # )

    fit_alexnet_model(
        "ck_plus",
        ck_plus_training_images,
        ck_plus_validation_images,
        ck_plus_training_labels,
        ck_plus_validation_labels,
    )
    # fit_inception_based_model(
    #     "ck_plus",
    #     ck_plus_training_images,
    #     ck_plus_validation_images,
    #     ck_plus_training_labels,
    #     ck_plus_validation_labels,
    # )
    # fit_custom_model_1(
    #     "ck_plus",
    #     ck_plus_training_images,
    #     ck_plus_validation_images,
    #     ck_plus_training_labels,
    #     ck_plus_validation_labels,
    # )
    # fit_faster_rcnn_without_bbox_model(
    #     "ck_plus",
    #     ck_plus_training_images_3_layers,
    #     ck_plus_validation_images_3_layers,
    #     ck_plus_training_labels,
    #     ck_plus_validation_labels,
    # )
    # fit_faster_rcnn_with_full_image_bbox_model(
    #     "ck_plus",
    #     ck_plus_training_images_3_layers,
    #     ck_plus_validation_images_3_layers,
    #     ck_plus_training_images,
    #     ck_plus_validation_images,
    #     ck_plus_training_labels,
    #     ck_plus_validation_labels,
    # )
    # fit_faster_rcnn_with_bbox_model(
    #     "ck_plus",
    #     ck_plus_training_images_3_layers,
    #     ck_plus_validation_images_3_layers,
    #     ck_plus_training_images,
    #     ck_plus_validation_images,
    #     ck_plus_training_labels,
    #     ck_plus_validation_labels,
    # )


if __name__ == "__main__":
    main()
