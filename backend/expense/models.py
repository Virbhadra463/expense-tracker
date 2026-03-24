from django.db import models

class UserDetail(models.Model):
    FirstName = models.CharField(max_length=20)
    LastName = models.CharField(max_length=20)
    FullName = models.CharField(max_length=40, blank=True)
    Gender = models.CharField(max_length=10)
    BirthDate = models.DateField()
    Email = models.EmailField(max_length=100, unique=True)
    Password = models.CharField(max_length=50)
    MonthlySalary = models.FloatField(default=0.0)
    date_added = models.DateTimeField(auto_now_add=True)

    # to save full name automatically
    def save(self, *args, **kwargs):
        self.FullName = f"{self.FirstName} {self.LastName}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.FullName
    
class Expense(models.Model):    
    UserId = models.ForeignKey(UserDetail,on_delete=models.CASCADE)    
    ExpenseCategory = models.CharField(max_length=50)
    ExpenseAmount = models.FloatField()
    ExpenseDescription = models.CharField(max_length=200)
    ExpenseDate = models.DateField(null = True, blank = True)
    NoteDate = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.ExpenseCategory} - {self.ExpenseAmount}"


class ImpulseBuy(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('bought', 'Bought'),
        ('discarded', 'Discarded'),
    ]

    UserId = models.ForeignKey(UserDetail, on_delete=models.CASCADE, related_name='impulse_buys')
    Name = models.CharField(max_length=200)
    Amount = models.FloatField()
    Category = models.CharField(max_length=50, default='Other')
    Note = models.CharField(max_length=500, blank=True, default='')
    IntendedDate = models.DateField(null=True, blank=True)
    Status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    CreatedAt = models.DateTimeField(auto_now_add=True)
    ExpiresAt = models.DateTimeField()  # 24h after creation

    def __str__(self):
        return f"{self.Name} - ₹{self.Amount} ({self.Status})"