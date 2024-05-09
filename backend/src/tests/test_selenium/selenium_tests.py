from helpers import APP_URL, driver

LOGIN_PAGE_URL = f"{APP_URL}/Admin"

def test_login(db):
    driver.get(LOGIN_PAGE_URL)
