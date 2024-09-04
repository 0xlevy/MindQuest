from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, login as auth_login
from django.contrib.auth.forms import UserCreationForm
from .forms import UserRegistrationForm, UserLoginForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages

# quizzes/views.py
from django.shortcuts import render, get_object_or_404
from .models import Quiz, Question, Answer

def quiz_list(request):
    quizzes = Quiz.objects.all()
    return render(request, 'quizzes/quiz_list.html', {'quizzes': quizzes})

@login_required
def quiz_detail(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    questions = quiz.questions.all()

    if request.method == 'POST':
        # Process the quiz answers
        score = 0
        total_questions = 0

        for question in questions:
            selected_answer_id = request.POST.get(f'question_{question.id}')
            if selected_answer_id:
                selected_answer = get_object_or_404(Answer, id=selected_answer_id)
                if selected_answer.is_correct:
                    score += 1
                total_questions += 1

        # Provide feedback
        percentage = (score / total_questions) * 100 if total_questions > 0 else 0
        messages.success(request, f'You scored {score} out of {total_questions} ({percentage:.2f}%)')

        return redirect('quiz_detail', quiz_id=quiz.id)

    return render(request, 'quizzes/quiz_detail.html', {'quiz': quiz, 'questions': questions})

def register(request):
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('quiz_list')
    else:
        form = UserRegistrationForm()
    return render(request, 'registration/register.html', {'form': form})

def user_login(request):
    if request.method == 'POST':
        form = UserLoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('quiz_list')  # Redirect to the home page or dashboard
            else:
                # Handle invalid login
                return render(request, 'registration/login.html', {'form': form, 'error': 'Invalid username or password'})
    else:
        form = UserLoginForm()
    return render(request, 'registration/login.html', {'form': form})