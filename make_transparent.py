import io
from rembg import remove
from PIL import Image

path = r"c:\Users\dhany\Desktop\portfolio\assets\images\astronaut.png"
with open(path, 'rb') as i:
    input_data = i.read()

output_data = remove(input_data)

with open(path, 'wb') as o:
    o.write(output_data)

print("Transparency achieved!")
