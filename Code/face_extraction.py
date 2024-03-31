import cv2

imagePath = "D:/GitHub Repositories/Bachelor/Datasets/test1.jpg"
# imagePath = "D:/GitHub Repositories/Bachelor/Datasets/test2.png"

img = cv2.imread(imagePath)

print(img.shape)

grayImage = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

print(grayImage.shape)

cv2.imwrite("D:/GitHub Repositories/Bachelor/Test_Results/1_gray.jpg", grayImage)

faceCascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

face = faceCascade.detectMultiScale(grayImage, 1.1, 5)

for x, y, w, h in face:
    cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)
    # cv2.rectangle(grayImage, (x, y), (x + w, y + h), (0, 255, 0), 2)

cv2.imwrite("D:/GitHub Repositories/Bachelor/Test_Results/1.jpg", img)

crop_img = img[y + 3 : y + h - 2, x + 3 : x + w - 2]

cv2.imwrite("D:/GitHub Repositories/Bachelor/Test_Results/2.jpg", crop_img)


