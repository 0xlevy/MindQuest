from django.core.management.base import BaseCommand
from quizzes.models import Quiz, Question, Answer

class Command(BaseCommand):
    help = 'Populate the database with sample quizzes, questions, and answers'

    def handle(self, *args, **kwargs):
        # Clear existing data (optional)
        Quiz.objects.all().delete()
        Question.objects.all().delete()
        Answer.objects.all().delete()
        
        # Create sample quizzes
        quiz_data = [
            {
                'title': 'General Knowledge',
                'questions': [
                    {
                        'text': 'What is the capital of France?',
                        'answers': [
                            {'text': 'Berlin', 'is_correct': False},
                            {'text': 'Madrid', 'is_correct': False},
                            {'text': 'Paris', 'is_correct': True},
                            {'text': 'Rome', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Who wrote "To Kill a Mockingbird"?',
                        'answers': [
                            {'text': 'Harper Lee', 'is_correct': True},
                            {'text': 'Mark Twain', 'is_correct': False},
                            {'text': 'Ernest Hemingway', 'is_correct': False},
                            {'text': 'J.K. Rowling', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the largest ocean on Earth?',
                        'answers': [
                            {'text': 'Atlantic Ocean', 'is_correct': False},
                            {'text': 'Indian Ocean', 'is_correct': False},
                            {'text': 'Arctic Ocean', 'is_correct': False},
                            {'text': 'Pacific Ocean', 'is_correct': True}
                        ]
                    },
                    {
                        'text': 'Which country is known as the Land of the Rising Sun?',
                        'answers': [
                            {'text': 'China', 'is_correct': False},
                            {'text': 'Japan', 'is_correct': True},
                            {'text': 'South Korea', 'is_correct': False},
                            {'text': 'Thailand', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Who painted the Mona Lisa?',
                        'answers': [
                            {'text': 'Vincent van Gogh', 'is_correct': False},
                            {'text': 'Leonardo da Vinci', 'is_correct': True},
                            {'text': 'Pablo Picasso', 'is_correct': False},
                            {'text': 'Claude Monet', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Science',
                'questions': [
                    {
                        'text': 'What is the chemical symbol for water?',
                        'answers': [
                            {'text': 'H2O', 'is_correct': True},
                            {'text': 'O2', 'is_correct': False},
                            {'text': 'CO2', 'is_correct': False},
                            {'text': 'NaCl', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What planet is known as the Red Planet?',
                        'answers': [
                            {'text': 'Earth', 'is_correct': False},
                            {'text': 'Mars', 'is_correct': True},
                            {'text': 'Jupiter', 'is_correct': False},
                            {'text': 'Saturn', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the hardest natural substance on Earth?',
                        'answers': [
                            {'text': 'Gold', 'is_correct': False},
                            {'text': 'Iron', 'is_correct': False},
                            {'text': 'Diamond', 'is_correct': True},
                            {'text': 'Platinum', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What element does "O" represent on the periodic table?',
                        'answers': [
                            {'text': 'Oxygen', 'is_correct': True},
                            {'text': 'Osmium', 'is_correct': False},
                            {'text': 'Oganesson', 'is_correct': False},
                            {'text': 'Oganesson', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the main gas found in the Earth’s atmosphere?',
                        'answers': [
                            {'text': 'Oxygen', 'is_correct': False},
                            {'text': 'Carbon Dioxide', 'is_correct': False},
                            {'text': 'Nitrogen', 'is_correct': True},
                            {'text': 'Hydrogen', 'is_correct': False}
                        ]
                    }
                ]
            },
            # Add more quizzes as needed
        ]
        
        for quiz_entry in quiz_data:
            quiz = Quiz.objects.create(title=quiz_entry['title'])
            for question_data in quiz_entry['questions']:
                question = Question.objects.create(quiz=quiz, text=question_data['text'])
                for answer_data in question_data['answers']:
                    Answer.objects.create(
                        question=question,
                        text=answer_data['text'],
                        is_correct=answer_data['is_correct']
                    )
        
        self.stdout.write(self.style.SUCCESS('Successfully populated the database'))
