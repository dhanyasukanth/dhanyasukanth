from rembg import remove
from PIL import Image
import traceback

input_path = r"C:\Users\dhany\Downloads\new_img.png"
output_path = r"c:\Users\dhany\Desktop\portfolio\assets\images\astronaut.png"

try:
    print("Loading image...")
    input_image = Image.open(input_path)
    print("Removing background...")
    output_image = remove(input_image)
    print("Saving cleaned image...")
    output_image.save(output_path)
    print("Done! Background successfully removed.")
except Exception as e:
    print("Error processing image:")
    traceback.print_exc()
