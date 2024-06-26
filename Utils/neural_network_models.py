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

from tensorflow.python.framework.convert_to_constants import (
    convert_variables_to_constants_v2,
)

import matplotlib.pyplot as plt

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
        image = np.repeat(image, 3, axis=-1)
        processed_images.append(image)

    return np.array(processed_images)


# ---------- Load the data ----------

base_folder = "D:/GitHub Repositories/Bachelor/Results"

# ---------- FER2013 Dataset ----------

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

# ---------- CK+ Dataset ----------

ck_plus_csv_file_path = os.path.join(base_folder, "ck_plus.csv")

ck_plus_data = pd.read_csv(ck_plus_csv_file_path)

ck_plus_training_data = ck_plus_data[ck_plus_data["usage"] == "Training"]
ck_plus_validation_data = ck_plus_data[ck_plus_data["usage"] == "PrivateTest"]

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

ck_plus_training_labels = to_categorical(ck_plus_raw_training_labels, 7)
ck_plus_validation_labels = to_categorical(ck_plus_raw_validation_labels, 7)

# ---------- AlexNet Model ----------


def AlexNetModel():
    model = Sequential()

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

    model.add(Conv2D(filters=256, kernel_size=(3, 3), activation="relu"))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Conv2D(filters=384, kernel_size=(3, 3), activation="relu"))
    model.add(MaxPooling2D(pool_size=(2, 2)))

    model.add(Flatten())
    model.add(Dense(units=1024, activation="relu"))
    model.add(Dropout(0.5))
    model.add(Dense(units=1024, activation="relu"))
    model.add(Dropout(0.5))

    model.add(Dense(units=7, activation="softmax"))

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ---------- Inception Based Model ----------


def inception_module(x, filters):
    conv1 = Conv2D(filters, (1, 1), padding="same", activation="relu")(x)

    conv3 = Conv2D(filters, (3, 3), padding="same", activation="relu")(x)

    conv5 = Conv2D(filters, (5, 5), padding="same", activation="relu")(x)

    pool = MaxPooling2D((3, 3), strides=(1, 1), padding="same")(x)

    output = concatenate([conv1, conv3, conv5, pool], axis=-1)
    return output


def InceptionModel():
    input_layer = Input(shape=(48, 48, 1))

    x = inception_module(input_layer, 64)
    x = MaxPooling2D(pool_size=(3, 3), strides=(2, 2), padding="same")(x)

    x = inception_module(x, 128)
    x = MaxPooling2D(pool_size=(3, 3), strides=(2, 2), padding="same")(x)

    x = Flatten()(x)
    x = Dense(1024, activation="relu")(x)
    output = Dense(7, activation="softmax")(x)

    model = Model(inputs=input_layer, outputs=output)

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ---------- Custom Model ----------


def CustomModel1():
    model = Sequential()

    model.add(Conv2D(32, (3, 3), activation="relu", input_shape=(48, 48, 1)))
    model.add(MaxPooling2D((2, 2)))
    model.add(Dropout(0.25))

    model.add(Conv2D(32, (3, 3), activation="relu"))
    model.add(MaxPooling2D((2, 2)))
    model.add(Dropout(0.25))

    model.add(Flatten())
    model.add(Dense(256, activation="relu"))
    model.add(
        Dense(7, activation="softmax")
    )

    model.compile(
        optimizer="adam",
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ---------- Faster R-CNN Model Without BBox ----------


def FasterRCNNWithoutBBox():
    vgg = VGG16(include_top=False, weights="imagenet", input_shape=(48, 48, 3))
    for layer in vgg.layers:
        layer.trainable = False

    feature_map = vgg.output
    flat_feature_map = Flatten()(feature_map)
    fc_layer = Dense(4096, activation="relu")(flat_feature_map)
    dropout = Dropout(0.5)(fc_layer)

    emotion_classifier = Dense(7, activation="softmax", name="emotion_classifier")(
        dropout
    )

    model = Model(inputs=vgg.input, outputs=emotion_classifier)

    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ---------- Faster R-CNN Model ----------


def generate_full_image_bboxes(images):
    bboxes = []
    for i in range(len(images)):
        bboxes.append([0, 0, 48, 48])
    return np.array(bboxes)


def generate_bboxes(images):
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    bboxes = []
    for img in images:
        if img.ndim == 3 and img.shape[2] == 1:
            img = img.squeeze()
            
        img_uint8 = (
            (img * 255).astype(np.uint8) if np.max(img) <= 1.0 else img.astype(np.uint8)
        )
        img_rgb = np.stack([img_uint8] * 3, axis=-1)
        
        faces = face_cascade.detectMultiScale(
            img_rgb, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )

        if len(faces) > 0:
            faces = sorted(faces, key=lambda x: x[2] * x[3], reverse=True)
            x, y, w, h = faces[0]
            bboxes.append([x, y, x + w, y + h])
        else:
            bboxes.append([0, 0, 48, 48])

    return np.array(bboxes)


def generate_cls_labels(images):
    return np.ones((len(images), 1))


def FasterRCNN():
    vgg = VGG16(include_top=False, weights="imagenet", input_shape=(48, 48, 3))
    for layer in vgg.layers:
        layer.trainable = False

    base_layers = vgg.output

    rpn = Conv2D(256, (3, 3), padding="same", activation="relu")(base_layers)
    
    cls = Conv2D(1, (1, 1), activation="sigmoid")(rpn)
    cls = Reshape((-1,))(cls)
    
    regr = Conv2D(4, (1, 1), activation="linear")(rpn)
    regr = Reshape((-1, 4))(regr)

    out_roi_pool = Flatten()(base_layers)
    out = Dense(4096, activation="relu")(out_roi_pool)
    out = Dropout(0.5)(out)
    out_class = Dense(7, activation="softmax")(out)

    model = Model(inputs=vgg.input, outputs=[cls, regr, out_class])

    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss=["binary_crossentropy", "mean_squared_error", "categorical_crossentropy"],
        metrics={
            "reshape": [],
            "reshape_1": [],
            "dense_1": ["accuracy"],
        },
    )

    return model


# ---------- Models Fit ----------


def fit_alexnet_model(
    dataset_name, training_images, validation_images, training_labels, validation_labels
):
    alexnet_model_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "alexnet_log.csv")
    )

    alexnet_model = AlexNetModel()

    history = alexnet_model.fit(
        training_images,
        training_labels,
        batch_size=64,
        epochs=50,
        validation_data=(validation_images, validation_labels),
        callbacks=[alexnet_model_csv_logger],
    )

    alexnet_model.save(os.path.join(base_folder, dataset_name, "alexnet_model.h5"))

    print_model_history(history)


def fit_inception_based_model(
    dataset_name, training_images, validation_images, training_labels, validation_labels
):
    inception_based_model_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "inception_based_log.csv")
    )

    inception_based_model = InceptionModel()

    history = inception_based_model.fit(
        training_images,
        training_labels,
        batch_size=64,
        epochs=50,
        validation_data=(validation_images, validation_labels),
        callbacks=[inception_based_model_csv_logger],
    )

    inception_based_model.save(
        os.path.join(base_folder, dataset_name, "inception_based_model.h5")
    )

    print_model_history(history)


def fit_custom_model_1(
    dataset_name, training_images, validation_images, training_labels, validation_labels
):
    custom_model_1_csv_logger = CSVLogger(
        os.path.join(base_folder, dataset_name, "custom_model_1_log.csv")
    )

    custom_model_1 = CustomModel1()

    history = custom_model_1.fit(
        training_images,
        training_labels,
        batch_size=64,
        epochs=50,
        validation_data=(validation_images, validation_labels),
        callbacks=[custom_model_1_csv_logger],
    )

    custom_model_1.save(os.path.join(base_folder, dataset_name, "custom_model_1.h5"))

    print_model_history(history)


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

    history = faster_rcnn_without_bbox_model.fit(
        training_images_3_layers,
        training_labels,
        batch_size=32,
        epochs=50,
        validation_data=(validation_images_3_layers, validation_labels),
        callbacks=[faster_rcnn_without_bbox_model_csv_logger],
    )

    faster_rcnn_without_bbox_model.save(
        os.path.join(base_folder, dataset_name, "faster_rcnn_without_bbox_model.h5")
    )

    print_model_history(history)


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

    history = faster_rcnn_model.fit(
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

    faster_rcnn_model.save(
        os.path.join(
            base_folder, dataset_name, "faster_rcnn_with_full_image_bbox_model.h5"
        )
    )

    print_rcnn_model_history(history)


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

    history = faster_rcnn_model.fit(
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

    faster_rcnn_model.save(
        os.path.join(base_folder, dataset_name, "faster_rcnn_with_bbox_model.h5")
    )

    print_rcnn_model_history(history)


# ---------- Main ----------


def print_model_history(history):
    print(history.history.keys())
    
    plt.plot(history.history["accuracy"])
    plt.plot(history.history["val_accuracy"])
    plt.title("model accuracy")
    plt.ylabel("accuracy")
    plt.xlabel("epoch")
    plt.legend(["train", "test"], loc="upper left")
    plt.show()

    plt.plot(history.history["loss"])
    plt.plot(history.history["val_loss"])
    plt.title("model loss")
    plt.ylabel("loss")
    plt.xlabel("epoch")
    plt.legend(["train", "test"], loc="upper left")
    plt.show()


def print_rcnn_model_history(history):
    print(history.history.keys())

    plt.plot(history.history["dense_1_accuracy"])
    plt.plot(history.history["val_dense_1_accuracy"])
    plt.title("model accuracy")
    plt.ylabel("accuracy")
    plt.xlabel("epoch")
    plt.legend(["train", "test"], loc="upper left")
    plt.show()

    plt.plot(history.history["loss"])
    plt.plot(history.history["val_loss"])
    plt.title("model loss")
    plt.ylabel("loss")
    plt.xlabel("epoch")
    plt.legend(["train", "test"], loc="upper left")
    plt.show()


def main():
    fit_alexnet_model(
        "fer2013",
        fer2013_training_images,
        fer2013_validation_images,
        fer2013_training_labels,
        fer2013_validation_labels,
    )
    fit_inception_based_model(
        "fer2013",
        fer2013_training_images,
        fer2013_validation_images,
        fer2013_training_labels,
        fer2013_validation_labels,
    )
    fit_custom_model_1(
        "fer2013",
        fer2013_training_images,
        fer2013_validation_images,
        fer2013_training_labels,
        fer2013_validation_labels,
    )
    fit_faster_rcnn_without_bbox_model(
        "fer2013",
        fer2013_training_images_3_layers,
        fer2013_validation_images_3_layers,
        fer2013_training_labels,
        fer2013_validation_labels,
    )
    fit_faster_rcnn_with_full_image_bbox_model(
        "fer2013",
        fer2013_training_images_3_layers,
        fer2013_validation_images_3_layers,
        fer2013_training_images,
        fer2013_validation_images,
        fer2013_training_labels,
        fer2013_validation_labels,
    )
    fit_faster_rcnn_with_bbox_model(
        "fer2013",
        fer2013_training_images_3_layers,
        fer2013_validation_images_3_layers,
        fer2013_training_images,
        fer2013_validation_images,
        fer2013_training_labels,
        fer2013_validation_labels,
    )

    fit_alexnet_model(
        "ck_plus",
        ck_plus_training_images,
        ck_plus_validation_images,
        ck_plus_training_labels,
        ck_plus_validation_labels,
    )
    fit_inception_based_model(
        "ck_plus",
        ck_plus_training_images,
        ck_plus_validation_images,
        ck_plus_training_labels,
        ck_plus_validation_labels,
    )
    fit_custom_model_1(
        "ck_plus",
        ck_plus_training_images,
        ck_plus_validation_images,
        ck_plus_training_labels,
        ck_plus_validation_labels,
    )
    fit_faster_rcnn_without_bbox_model(
        "ck_plus",
        ck_plus_training_images_3_layers,
        ck_plus_validation_images_3_layers,
        ck_plus_training_labels,
        ck_plus_validation_labels,
    )
    fit_faster_rcnn_with_full_image_bbox_model(
        "ck_plus",
        ck_plus_training_images_3_layers,
        ck_plus_validation_images_3_layers,
        ck_plus_training_images,
        ck_plus_validation_images,
        ck_plus_training_labels,
        ck_plus_validation_labels,
    )
    fit_faster_rcnn_with_bbox_model(
        "ck_plus",
        ck_plus_training_images_3_layers,
        ck_plus_validation_images_3_layers,
        ck_plus_training_images,
        ck_plus_validation_images,
        ck_plus_training_labels,
        ck_plus_validation_labels,
    )


if __name__ == "__main__":
    main()
