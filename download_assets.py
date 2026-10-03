import os
import urllib.request
import urllib.parse

base_dir = r"c:\Users\joelj\OneDrive\Pictures\projects\ClashNet"
images_dir = os.path.join(base_dir, "public", "images")
fonts_dir = os.path.join(base_dir, "public", "fonts")

os.makedirs(images_dir, exist_ok=True)
os.makedirs(fonts_dir, exist_ok=True)

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

# 1. Fonts to download
font_files = [
    ("CardinalClassicMidWeb-Regular.woff2", "https://white-desert.com/fonts/CardinalClassicMidWeb-Regular.woff2"),
    ("CardinalClassicMidWeb-Italic.woff2", "https://white-desert.com/fonts/CardinalClassicMidWeb-Italic.woff2"),
    ("CardinalClassicMidWeb-Medium.woff2", "https://white-desert.com/fonts/CardinalClassicMidWeb-Medium.woff2"),
    ("CardinalClassicMidWeb-MediumItalic.woff2", "https://white-desert.com/fonts/CardinalClassicMidWeb-MediumItalic.woff2"),
    ("CardinalClassicLongWeb-SemiBold-Trial.woff2", "https://white-desert.com/fonts/CardinalClassicLongWeb-SemiBold-Trial.woff2"),
    ("CardinalClassicLongWeb-SemiBoldItalic-Trial.woff2", "https://white-desert.com/fonts/CardinalClassicLongWeb-SemiBoldItalic-Trial.woff2"),
    ("CardinalClassicLongWeb-Bold-Trial.woff2", "https://white-desert.com/fonts/CardinalClassicLongWeb-Bold-Trial.woff2"),
    ("CardinalClassicLongWeb-BoldItalic-Trial.woff2", "https://white-desert.com/fonts/CardinalClassicLongWeb-BoldItalic-Trial.woff2"),
    ("InterTight-VariableFont_wght.woff2", "https://white-desert.com/fonts/InterTight-VariableFont_wght.woff2"),
    ("InterTight-Italic-VariableFont_wght.woff2", "https://white-desert.com/fonts/InterTight-Italic-VariableFont_wght.woff2"),
    ("Oswald-VariableFont_wght.woff2", "https://white-desert.com/fonts/Oswald-VariableFont_wght.woff2"),
]

for filename, url in font_files:
    dest = os.path.join(fonts_dir, filename)
    if not os.path.exists(dest):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                with open(dest, "wb") as f:
                    f.write(data)
                print(f"Downloaded font: {filename} ({len(data)} bytes)")
        except Exception as e:
            print(f"Font download error {filename}: {e}")

# 2. Key images
image_files = [
    ("cloud-1-cropped.png", "https://white-desert.com/images/cloud-1-cropped.png"),
    ("cloud-2-full.png", "https://white-desert.com/images/cloud-2-full.png"),
    ("cloud-gradient.png", "https://white-desert.com/images/cloud-gradient.png"),
    ("WhiteDesertAntarcticaActivities02.jpg", "https://white-desert.com/images/WhiteDesertAntarcticaActivities02.jpg"),
    ("flight-path_large.jpg", "https://white-desert.com/images/flight-path_large.jpg"),
    ("1.Iaato.png", "https://white-desert.com/images/1.Iaato.png"),
    ("2.carbon-neutral.png", "https://white-desert.com/images/2.carbon-neutral.png"),
    ("3.global-vision-awards.png", "https://white-desert.com/images/3.global-vision-awards.png"),
    ("4.conde-nast.png", "https://white-desert.com/images/4.conde-nast.png"),
    ("5.trip-adviser.png", "https://white-desert.com/images/5.trip-adviser.png"),
    ("6.20-years.png", "https://white-desert.com/images/6.20-years.png"),
    # Trip Images
    ("trip_baby_penguins.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/16add1ee0bdc16862dc37b826abb1600887e7fbb-2000x1333.jpg"),
    ("trip_south_pole.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/fc3d4887c37b05526119edbc5db9d18a0b034c6b-2000x1250.jpg"),
    ("trip_blue_rivers.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/1748a379c910cb7c98b6c9acb5fb60be54c92d6b-2000x1250.jpg"),
    ("trip_long_stay.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/ba3ef9c03535715a86568b6f7d76baeecf698f12-2000x1333.jpg"),
    ("trip_day.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/0554de84a6e2cfa68bff6d38a7d7e1c975653f91-2000x1333.jpg"),
    # Mountain Banner
    ("mountain_banner.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/1a56d4190cee89b1fa408978753d1558a50d2639-3000x2014.jpg"),
    # Camps
    ("camp_whichaway.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/7f7efa50400ce9b425d21711fe3dbc6f34da5056-2000x1333.jpg"),
    ("camp_echo.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/997058a2941b8500aabe100c899a6443ae943494-2000x1250.jpg"),
    ("camp_explorer.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/be7f8922a9352273b56ca6798837ff6c95d3e060-2000x1250.jpg"),
    # Plane and runway
    ("runway_plane.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/61d6343c3239fb4e0df45fd4a35863549d97e73a-2535x1584.jpg"),
    ("runway_sky.jpg", "https://cdn.sanity.io/images/kq9qn5zn/production/545ecd31bdf0cdd5605316894111fb0f197e0129-2668x2000.jpg"),
]

for filename, url in image_files:
    dest = os.path.join(images_dir, filename)
    if not os.path.exists(dest):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                with open(dest, "wb") as f:
                    f.write(data)
                print(f"Downloaded image: {filename} ({len(data)} bytes)")
        except Exception as e:
            print(f"Image download error {filename}: {e}")

print("Asset downloads complete!")
