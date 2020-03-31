# import requests

# r = requests.get("http://127.0.0.1:3000")

# # print(r.url)
# # print(r.text)

# import socketio

# # standard Python
# sio = socketio.Client()
# sio.connect('http://localhost:3000')

# while True:
# 	continue

from selenium import webdriver 
from selenium.webdriver.chrome.options import Options
chrome_options = Options()
#chrome_options.add_argument("--disable-extensions")
#chrome_options.add_argument("--disable-gpu")
#chrome_options.add_argument("--no-sandbox) # linux only
chrome_options.add_argument("--headless")
l = [webdriver.Chrome(executable_path="/Users/lukefahmy/Downloads/chromedriver", options=chrome_options) for _ in range(5)]

#driver = webdriver.PhantomJS(executable_path="/Users/lukefahmy/Downloads/phantomjs-2.1.1-macosx/bin/phantomjs")
for i in range(5):
	l[i].get("http://127.0.0.1:3000")
#driver.quit()