
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


def seed_february():

    start = datetime(2026, 2, 1)
    end = datetime(2026, 2, 28)

    cafe_days = random.sample(range(1, 29), random.randint(2, 3))
    burger_day = random.randint(1, 28)

    current = start

    while current <= end:

        weekday = current.weekday()
        date = current.strftime("%Y-%m-%d")

        # Monday–Friday only
        if weekday < 5:

            # Morning auto
            post_expense("Transport", 50, "Auto to Thane Station", date)

            # Random return option (50-50)
            if random.choice([True, False]):
                post_expense("Transport", 10, "Sharing Mulund Station to Home", date)
            else:
                post_expense("Transport", 25, "Sharing Thane Station to Home", date)

            # Bread Pattis
            post_expense("Food", 25, "Bread Pattis - College Canteen", date)

            # Diet Coke once per week (Monday)
            if weekday == 0:
                post_expense("Food", 40, "Diet Coke", date)

        # Cafe visits
        if current.day in cafe_days:
            cafe = random.choice([
                "Third Wave Coffee - Cofeee",
                "De Baileys Cafe - Loaded Nachos",
                "Cafe Hangout"
            ])
            post_expense("Food", 200, cafe, date)

        # Burger King once
        if current.day == burger_day:
            post_expense("Food", 300, "Burger King Whopper Meal", date)

        current += timedelta(days=1)


if __name__ == "__main__":
    seed_february()