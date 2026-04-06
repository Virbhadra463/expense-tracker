import requests
import random
from datetime import datetime, timedelta

API_URL = "http://127.0.0.1:8000/api/add_expense/"
USER_ID = 5

def post_expense(category, amount, description, date):
    payload = {
        "UserId": USER_ID,
        "ExpenseCategory": category,
        "ExpenseAmount": amount,
        "ExpenseDescription": description,
        "ExpenseDate": date
    }

    try:
        response = requests.post(API_URL, json=payload)
        if response.status_code in [200, 201]:
            print(f"{date} | {description} | ₹{amount}")
        else:
            print("Error:", response.text)
    except Exception as e:
        print("Request failed:", e)


def seed_march():

    start = datetime(2026, 3, 1)
    end = datetime(2026, 3, 25)

    # Pick one random day per week (4 weeks approx)
    weeks = [
        range(1, 8),
        range(8, 15),
        range(15, 22),
        range(22, 26)
    ]

    stationery_days = [random.choice(week) for week in weeks]

    current = start

    while current <= end:

        weekday = current.weekday()
        date = current.strftime("%Y-%m-%d")

        # Monday–Friday only
        if weekday < 5:

            # Morning auto
            post_expense("Transport", 50, "Auto to Thane Station", date)

            # Random return option
            if random.choice([True, False]):
                post_expense("Transport", 10, "Sharing Mulund Station to Home", date)
            else:
                post_expense("Transport", 25, "Sharing Thane Station to Home", date)

            # Bread Pattis
            post_expense("Food", 25, "Bread Pattis - College Canteen", date)

            # Diet Coke every Monday
            if weekday == 0:
                post_expense("Food", 40, "Diet Coke", date)

        # Weekly stationery expense
        if current.day in stationery_days:
            post_expense("Stationery", 20, "File", date)
            post_expense("Stationery", 30, "Terna Pages", date)

        current += timedelta(days=1)


if __name__ == "__main__":
    seed_march()