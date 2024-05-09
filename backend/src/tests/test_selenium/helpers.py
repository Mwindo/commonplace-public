from selenium import webdriver
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

# Set capabilities and point to the hub URL

SERVER_URL = "http://selenium-hub:4444/wd/hub"
APP_URL = "http://dev.commonplace.com"

capabilities = DesiredCapabilities.CHROME

driver = webdriver.Remote(
   command_executor='http://<hub-ip>:4444/wd/hub',
   desired_capabilities=capabilities
)

