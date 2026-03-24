from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import * 

# SignUp Api
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print("Received data:", data)  # <-- shows payload in Django terminal

            firstname = data.get('FirstName')
            lastname = data.get('LastName')
            gender = data.get('Gender')
            birthdate = data.get('BirthDate')
            email = data.get('Email')
            password = data.get('Password')

            print(f"FirstName={firstname}, LastName={lastname}, Gender={gender}, BirthDate={birthdate}, Email={email}")

            if UserDetail.objects.filter(Email=email).exists():
                return JsonResponse({'message': 'Email already exists'}, status=400)

            UserDetail.objects.create(FirstName=firstname, LastName=lastname, Email=email, Gender=gender, BirthDate=birthdate, Password=password)
            return JsonResponse({'message': 'User registered successfully'}, status=201)

        except Exception as e:
            print("ERROR:", str(e))
            return JsonResponse({'message': str(e)}, status=400)

    return JsonResponse({'message': 'Method not allowed'}, status=405)

# Login Api
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print("Received data:", data)  # shows payload in Django terminal
        
        email = data.get('Email')
        password = data.get('Password')

        print(f"Email={email}")

        try:
            user = UserDetail.objects.get(Email=email, Password=password)
            return JsonResponse({'message': 'Login Successful','userId':user.id,'userName':user.FullName}, status = 200)
        except UserDetail.DoesNotExist:
            return JsonResponse({'message': 'Invalid Credentials'}, status=400)
        except Exception as e:
            return JsonResponse({'message': 'Server Error'}, status=500)

    return JsonResponse({'message': 'Method not allowed'}, status=405)

# Add expense Api
@csrf_exempt
def add_expense(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print("Received data:", data)  # shows payload in Django terminal

        user_id = data.get('UserId')
        expense_category = data.get('ExpenseCategory') 
        expense_amount = data.get('ExpenseAmount')           
        expense_description = data.get('ExpenseDescription')            
        expense_date = data.get('ExpenseDate')              

        try:
            user = UserDetail.objects.get(id=user_id)
            
            # Record the new expense
            expense = Expense.objects.create(
                UserId=user,
                ExpenseCategory=expense_category,
                ExpenseAmount=expense_amount,
                ExpenseDescription=expense_description,
                ExpenseDate=expense_date
            )
            return JsonResponse({'message': 'Expense Added Successfully'}, status=201)
        
        except UserDetail.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=401)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': 'Failed to add expense'}, status=400)

    return JsonResponse({'message': 'Method not allowed'}, status=405)

# Get expenses Api
@csrf_exempt
def get_expenses(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')

        if not user_id:
            return JsonResponse({'message': 'User ID is required'}, status=400)

        try:
            # Check if user exists
            user_detail = UserDetail.objects.get(id=user_id)
            
            expenses = Expense.objects.filter(UserId=user_id).order_by('-ExpenseDate', '-NoteDate')
            
            expenses_list = [
                {
                    'id': expense.id,
                    'category': expense.ExpenseCategory,
                    'amount': str(expense.ExpenseAmount),
                    'description': expense.ExpenseDescription,
                    'date': expense.ExpenseDate.strftime('%Y-%m-%d') if expense.ExpenseDate else '',
                }
                for expense in expenses
            ]

            return JsonResponse({
                'expenses': expenses_list,
                'monthly_salary': float(user_detail.MonthlySalary)
            }, status=200)

        except UserDetail.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': 'Failed to fetch expenses', 'error': str(e)}, status=500)

    return JsonResponse({'message': 'Method not allowed'}, status=405)

# Delete expenses Api
@csrf_exempt
def delete_expenses(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            expense_ids = data.get('expense_ids', [])
            
            if not expense_ids:
                return JsonResponse({'message': 'No expense IDs provided'}, status=400)
            
            deleted_count, _ = Expense.objects.filter(id__in=expense_ids).delete()
            return JsonResponse({'message': f'{deleted_count} expense(s) deleted successfully'}, status=200)
        
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': 'Failed to delete expenses'}, status=500)

    return JsonResponse({'message': 'Method not allowed'}, status=405)

# Update expense Api
@csrf_exempt
def update_expense(request, expense_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)

            expense = Expense.objects.get(id=expense_id)
            expense.ExpenseDate = data.get('ExpenseDate', expense.ExpenseDate)
            expense.ExpenseDescription = data.get('ExpenseDescription', expense.ExpenseDescription)
            expense.ExpenseAmount = data.get('ExpenseAmount', expense.ExpenseAmount)
            expense.ExpenseCategory = data.get('ExpenseCategory', expense.ExpenseCategory)
            expense.save()
            return JsonResponse({'message': 'Expense updated successfully!'}, status=200)

        except Expense.DoesNotExist:
            return JsonResponse({'message': 'Expense not found'}, status=404)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': 'Failed to update expense'}, status=500)

    return JsonResponse({'message': 'Method not allowed'}, status=405)


# Update Monthly Salary Api
@csrf_exempt
def update_salary(request, user_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            
            user = UserDetail.objects.get(id=user_id)
            user.MonthlySalary = float(data.get('MonthlySalary', user.MonthlySalary))
            user.save()
            return JsonResponse({'message': 'Salary updated successfully!', 'monthly_salary': float(user.MonthlySalary)}, status=200)

        except UserDetail.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': 'Failed to update salary'}, status=500)

    return JsonResponse({'message': 'Method not allowed'}, status=405)


# ---- Impulse Buy APIs ----

from datetime import timedelta
from django.utils import timezone

# Add impulse buy
@csrf_exempt
def add_impulse(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_id = data.get('UserId')
            user = UserDetail.objects.get(id=user_id)

            impulse = ImpulseBuy.objects.create(
                UserId=user,
                Name=data.get('Name', ''),
                Amount=float(data.get('Amount', 0)),
                Category=data.get('Category', 'Other'),
                Note=data.get('Note', ''),
                IntendedDate=data.get('IntendedDate') or None,
                ExpiresAt=timezone.now() + timedelta(hours=24)
            )
            return JsonResponse({
                'message': 'Impulse buy logged',
                'impulse': {
                    'id': impulse.id,
                    'name': impulse.Name,
                    'amount': impulse.Amount,
                    'category': impulse.Category,
                    'note': impulse.Note,
                    'intendedDate': str(impulse.IntendedDate) if impulse.IntendedDate else '',
                    'status': impulse.Status,
                    'createdAt': impulse.CreatedAt.isoformat(),
                    'expiresAt': impulse.ExpiresAt.isoformat(),
                }
            }, status=201)
        except UserDetail.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': str(e)}, status=400)
    return JsonResponse({'message': 'Method not allowed'}, status=405)


# Get all impulse buys for a user
@csrf_exempt
def get_impulses(request):
    if request.method == 'GET':
        user_id = request.GET.get('user_id')
        if not user_id:
            return JsonResponse({'message': 'User ID is required'}, status=400)
        try:
            UserDetail.objects.get(id=user_id)
            impulses = ImpulseBuy.objects.filter(UserId=user_id).order_by('-CreatedAt')

            now = timezone.now()
            impulse_list = []
            saved_amount = 0

            for imp in impulses:
                item = {
                    'id': imp.id,
                    'name': imp.Name,
                    'amount': imp.Amount,
                    'category': imp.Category,
                    'note': imp.Note,
                    'intendedDate': str(imp.IntendedDate) if imp.IntendedDate else '',
                    'status': imp.Status,
                    'createdAt': imp.CreatedAt.isoformat(),
                    'expiresAt': imp.ExpiresAt.isoformat(),
                }
                impulse_list.append(item)
                if imp.Status == 'discarded':
                    saved_amount += imp.Amount

            return JsonResponse({
                'impulses': impulse_list,
                'savedAmount': saved_amount
            }, status=200)

        except UserDetail.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse({'message': 'Method not allowed'}, status=405)


# Update impulse status (bought / discarded)
@csrf_exempt
def update_impulse(request, impulse_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            impulse = ImpulseBuy.objects.get(id=impulse_id)
            new_status = data.get('Status', impulse.Status)

            if new_status not in ['pending', 'bought', 'discarded']:
                return JsonResponse({'message': 'Invalid status'}, status=400)

            impulse.Status = new_status
            impulse.save()
            return JsonResponse({'message': f'Impulse marked as {new_status}'}, status=200)

        except ImpulseBuy.DoesNotExist:
            return JsonResponse({'message': 'Impulse buy not found'}, status=404)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse({'message': 'Method not allowed'}, status=405)


# Delete impulse buy
@csrf_exempt
def delete_impulse(request, impulse_id):
    if request.method == 'DELETE':
        try:
            impulse = ImpulseBuy.objects.get(id=impulse_id)
            impulse.delete()
            return JsonResponse({'message': 'Impulse buy deleted'}, status=200)
        except ImpulseBuy.DoesNotExist:
            return JsonResponse({'message': 'Impulse buy not found'}, status=404)
        except Exception as e:
            print("ERROR", str(e))
            return JsonResponse({'message': str(e)}, status=500)
    return JsonResponse({'message': 'Method not allowed'}, status=405)