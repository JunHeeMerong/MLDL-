import os
import glob
from PIL import Image
files = glob.glob('./data/k9/*.jpg') # 경로/*.jpg
for f in files:
    img = Image.open(f).convert('RGB') 
    img_resize = img.resize((256,256)) # 크기 설정
    title, ext = os.path.splitext(f)
    img_resize.save(title + '_half' + ext) # 이름 설정