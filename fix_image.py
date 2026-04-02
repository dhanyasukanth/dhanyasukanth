from PIL import Image

path = r"c:\Users\dhany\Desktop\portfolio\assets\images\astronaut.png"
img = Image.open(path).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    # Calculate grayscale brightness (0 to 255)
    brightness = int((item[0] + item[1] + item[2]) / 3)
    # The new pixel is always white, but its opacity varies by how bright it was!
    # A black pixel (brightness 0) becomes 100% transparent.
    # A white pixel (brightness 255) becomes 100% opaque white.
    newData.append((255, 255, 255, brightness))

img.putdata(newData)
img.save(path, "PNG")
print("Perfect transparency achieved!")
