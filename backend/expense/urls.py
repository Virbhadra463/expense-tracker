from django.urls import path

from .views import *

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('login/', login, name='login'),
    path('add_expense/', add_expense, name='add_expense'),
    path('get_expenses/', get_expenses, name='get_expenses'),
    path('delete_expenses/', delete_expenses, name='delete_expenses'),
    path('update_expense/<int:expense_id>/', update_expense, name='update_expense'),
    path('update_salary/<int:user_id>/', update_salary, name='update_salary'),
    # Impulse Buy
    path('add_impulse/', add_impulse, name='add_impulse'),
    path('get_impulses/', get_impulses, name='get_impulses'),
    path('update_impulse/<int:impulse_id>/', update_impulse, name='update_impulse'),
    path('delete_impulse/<int:impulse_id>/', delete_impulse, name='delete_impulse'),
]
