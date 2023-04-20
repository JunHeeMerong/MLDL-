# rembg 패키지에서 remove 클래스 불러오기
from rembg import remove
# PIL 패키지에서 Image 클래스 불러오기
from PIL import Image
import os
import glob
files = glob.glob('./avante n/*.png') # 경로/*.jpg
count = 0
for f in files:
    img = Image.open(f).convert('RGB')
    title, ext = os.path.splitext(f)
    index = title.find('\\')
    title = title[:index]
    out = remove(img)
    new_name = title+'_remove'+str(count)+ext
    if not os.path.exists(title+'_remove'):
        os.mkdir(title+'_remove')
    out.save(title+'_remove/'+new_name)
    count+=1