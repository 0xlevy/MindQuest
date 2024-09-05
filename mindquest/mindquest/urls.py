# mindquest/urls.py
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views
from quizzes import views as quiz_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', quiz_views.quiz_list, name='quiz_list'),
    path('quiz/<int:quiz_id>/', quiz_views.quiz_detail, name='quiz_detail'),
    path('accounts/login/', auth_views.LoginView.as_view(), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('accounts/register/', quiz_views.register, name='register'),
    path('quizzes/', quiz_views.quizzes_view, name='quizzes_view'),
]
