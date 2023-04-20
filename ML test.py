import os
os.environ["CUDA_VISIBLE_DEVICES"] = "0"

import tensorflow as tf
from tensorflow import keras
import matplotlib.pyplot as plt
from tensorflow.keras.layers import *
from keras.preprocessing.image import ImageDataGenerator
import tensorflow_hub as hub
import numpy as np

train_path = './car_image2/train'
test_path = './car_image2/test'

def image_generator(image_size, validation_rate, batch_size):

    train_datagen = ImageDataGenerator(
                                        rescale=1./255,
                                        rotation_range=20,
                                        zoom_range=0.15,
                                        width_shift_range=0.2,
                                        height_shift_range=0.2,
                                        shear_range=0.15,
                                        horizontal_flip=True,
                                        fill_mode="nearest",
                                        validation_split = validation_rate)

    test_datagen = ImageDataGenerator(rescale=1./255,)



    train_generator = train_datagen.flow_from_directory(
        train_path,
        target_size = (image_size, image_size),
        subset = 'training', 
        batch_size=batch_size,
        color_mode = 'rgb')
    val_generator = train_datagen.flow_from_directory(
        train_path,
        target_size = (image_size, image_size),
        subset = 'validation', 
        batch_size=batch_size,
        color_mode = 'rgb')
    test_generator = test_datagen.flow_from_directory(test_path, 
                                                    target_size = (image_size, image_size),
                                                    batch_size=1)
    
    return train_generator, val_generator, test_generator

config = {}
config['image_size'] = 300
config['validation_rate'] = 0.2
config['batch_size'] = 16

train_generator, val_generator, test_generator = image_generator(config['image_size'], 
                                                                 config['validation_rate'], 
                                                                 config['batch_size'])

def get_model(
    handle="https://tfhub.dev/google/imagenet/efficientnet_v2_imagenet21k_ft1k_b3/classification/2", 
    num_classes=4):

    hub_layer = hub.KerasLayer(handle, trainable=True)
    model = tf.keras.Sequential(
        [
            tf.keras.layers.InputLayer((300, 300, 3)),
            hub_layer,
            tf.keras.layers.BatchNormalization(True),
            tf.keras.layers.Dense(1024, activation="swish"),
            tf.keras.layers.Dropout(0.25),
            tf.keras.layers.Dense(512, activation="swish"),
            tf.keras.layers.Dropout(0.25),
            tf.keras.layers.Dense(256, activation="swish"),
            tf.keras.layers.Dense(128, activation="swish"),
            tf.keras.layers.Dense(64, activation="swish"),
            tf.keras.layers.Dense(num_classes, activation="softmax")
        ]
    )

    return model

model = get_model()

top_2_acc = tf.keras.metrics.TopKCategoricalAccuracy(k=2, name='top_2_categorical_accuracy', dtype=None)
lr = 0.001
lr_schedule = tf.keras.optimizers.schedules.PiecewiseConstantDecay(boundaries=[100, 200], 
                                                                   values=[lr, 0.0005, 0.0001])
optimizer = tf.keras.optimizers.SGD(learning_rate=lr_schedule, momentum=0.9)

model.compile(loss = 'categorical_crossentropy', optimizer = optimizer, metrics=['accuracy', top_2_acc])

cp_callback = tf.keras.callbacks.ModelCheckpoint(filepath=f'./model',
                                                 save_weights_only = False,
                                                 save_best_only=True,
                                                 monitor="val_accuracy",
                                                 verbose=1)
print('start')
history = model.fit(train_generator, epochs = 100, validation_data = val_generator, callbacks = [cp_callback])

# 정확도
plt.plot(history.history['accuracy'])
plt.plot(history.history['val_accuracy'])
plt.xlabel('epochs')
plt.ylabel('accuracy')
plt.legend(['accuracy', 'val_accuracy'])
plt.show()

# 손실
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.xlabel('epochs')
plt.ylabel('loss')
plt.legend(['loss', 'val_loss'])
plt.show()