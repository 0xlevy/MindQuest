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
                'title': 'Computer Science',
                'questions': [
                    {
                        'text': 'What does CPU stand for?',
                        'answers': [
                            {'text': 'Central Process Unit', 'is_correct': False},
                            {'text': 'Central Processing Unit', 'is_correct': True},
                            {'text': 'Computer Personal Unit', 'is_correct': False},
                            {'text': 'Central Process Utility', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which data structure uses LIFO?',
                        'answers': [
                            {'text': 'Queue', 'is_correct': False},
                            {'text': 'Stack', 'is_correct': True},
                            {'text': 'Array', 'is_correct': False},
                            {'text': 'Linked List', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the time complexity of binary search?',
                        'answers': [
                            {'text': 'O(n)', 'is_correct': False},
                            {'text': 'O(log n)', 'is_correct': True},
                            {'text': 'O(n^2)', 'is_correct': False},
                            {'text': 'O(1)', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which language is primarily used for web development?',
                        'answers': [
                            {'text': 'C++', 'is_correct': False},
                            {'text': 'Python', 'is_correct': False},
                            {'text': 'HTML', 'is_correct': True},
                            {'text': 'Java', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a compiler?',
                        'answers': [
                            {'text': 'A tool that executes programs', 'is_correct': False},
                            {'text': 'A tool that interprets code', 'is_correct': False},
                            {'text': 'A tool that converts source code into machine code', 'is_correct': True},
                            {'text': 'A tool that checks for syntax errors', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Software Engineering',
                'questions': [
                    {
                        'text': 'What does SDLC stand for?',
                        'answers': [
                            {'text': 'Software Design Life Cycle', 'is_correct': False},
                            {'text': 'Software Development Life Cycle', 'is_correct': True},
                            {'text': 'System Development Life Cycle', 'is_correct': False},
                            {'text': 'Software Design Logic Cycle', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which model is known as the "Waterfall Model"?',
                        'answers': [
                            {'text': 'Incremental Model', 'is_correct': False},
                            {'text': 'Spiral Model', 'is_correct': False},
                            {'text': 'Waterfall Model', 'is_correct': True},
                            {'text': 'V-Model', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is a version control system?',
                        'answers': [
                            {'text': 'Eclipse', 'is_correct': False},
                            {'text': 'Git', 'is_correct': True},
                            {'text': 'Android Studio', 'is_correct': False},
                            {'text': 'Oracle', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is refactoring?',
                        'answers': [
                            {'text': 'Adding new features to the software', 'is_correct': False},
                            {'text': 'Removing bugs from the software', 'is_correct': False},
                            {'text': 'Improving the code without changing its external behavior', 'is_correct': True},
                            {'text': 'Documenting the software', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a design pattern?',
                        'answers': [
                            {'text': 'A code generation tool', 'is_correct': False},
                            {'text': 'A pre-written piece of code', 'is_correct': False},
                            {'text': 'A reusable solution to a common problem', 'is_correct': True},
                            {'text': 'A software testing method', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Information Technology (IT)',
                'questions': [
                    {
                        'text': 'Which protocol is used for web browsing?',
                        'answers': [
                            {'text': 'FTP', 'is_correct': False},
                            {'text': 'HTTP', 'is_correct': True},
                            {'text': 'SMTP', 'is_correct': False},
                            {'text': 'SSH', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the main purpose of a firewall?',
                        'answers': [
                            {'text': 'To store data', 'is_correct': False},
                            {'text': 'To block unauthorized access', 'is_correct': True},
                            {'text': 'To speed up network performance', 'is_correct': False},
                            {'text': 'To encrypt data', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is a type of malware?',
                        'answers': [
                            {'text': 'Trojan', 'is_correct': True},
                            {'text': 'HTTP', 'is_correct': False},
                            {'text': 'SQL', 'is_correct': False},
                            {'text': 'Ping', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What does VPN stand for?',
                        'answers': [
                            {'text': 'Virtual Private Network', 'is_correct': True},
                            {'text': 'Virtual Public Network', 'is_correct': False},
                            {'text': 'Variable Private Network', 'is_correct': False},
                            {'text': 'Virtual Protocol Network', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which device is used to connect a computer to a network?',
                        'answers': [
                            {'text': 'Monitor', 'is_correct': False},
                            {'text': 'Mouse', 'is_correct': False},
                            {'text': 'Router', 'is_correct': True},
                            {'text': 'Keyboard', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Actuarial Science',
                'questions': [
                    {
                        'text': 'What is the main purpose of actuarial science?',
                        'answers': [
                            {'text': 'To calculate taxes', 'is_correct': False},
                            {'text': 'To assess financial risk', 'is_correct': True},
                            {'text': 'To design financial software', 'is_correct': False},
                            {'text': 'To audit financial statements', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which type of insurance uses actuarial science the most?',
                        'answers': [
                            {'text': 'Health insurance', 'is_correct': False},
                            {'text': 'Life insurance', 'is_correct': True},
                            {'text': 'Auto insurance', 'is_correct': False},
                            {'text': 'Home insurance', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a mortality table?',
                        'answers': [
                            {'text': 'A chart showing death rates at various ages', 'is_correct': True},
                            {'text': 'A list of insurance premiums', 'is_correct': False},
                            {'text': 'A table for calculating interest rates', 'is_correct': False},
                            {'text': 'A table for assessing financial losses', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the discount rate?',
                        'answers': [
                            {'text': 'The rate at which future cash flows are discounted', 'is_correct': True},
                            {'text': 'The rate of return on investments', 'is_correct': False},
                            {'text': 'The interest rate on loans', 'is_correct': False},
                            {'text': 'The rate at which premiums are reduced', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is risk pooling?',
                        'answers': [
                            {'text': 'Combining multiple risks to reduce overall risk', 'is_correct': True},
                            {'text': 'Dividing risk among multiple parties', 'is_correct': False},
                            {'text': 'Calculating risk using a pool of data', 'is_correct': False},
                            {'text': 'Avoiding risk by pooling resources', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Computer Engineering',
                'questions': [
                    {
                        'text': 'What is an FPGA?',
                        'answers': [
                            {'text': 'Field-Programmable Gate Array', 'is_correct': True},
                            {'text': 'Field-Programmable Graphic Array', 'is_correct': False},
                            {'text': 'Fast Programmable Gate Array', 'is_correct': False},
                            {'text': 'Field-Pipeline Gate Array', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the function of an ALU in a CPU?',
                        'answers': [
                            {'text': 'Arithmetic and Logic Unit', 'is_correct': True},
                            {'text': 'Array Logic Unit', 'is_correct': False},
                            {'text': 'Asynchronous Logic Unit', 'is_correct': False},
                            {'text': 'Automatic Logic Unit', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What does VLSI stand for?',
                        'answers': [
                            {'text': 'Very-Large-Scale Integration', 'is_correct': True},
                            {'text': 'Variable-Large-Scale Integration', 'is_correct': False},
                            {'text': 'Very-Low-Scale Integration', 'is_correct': False},
                            {'text': 'Variable-Logic-Scale Integration', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is a primary function of an operating system?',
                        'answers': [
                            {'text': 'Managing hardware resources', 'is_correct': True},
                            {'text': 'Developing software applications', 'is_correct': False},
                            {'text': 'Providing network security', 'is_correct': False},
                            {'text': 'Creating web content', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which type of memory is volatile?',
                        'answers': [
                            {'text': 'RAM', 'is_correct': True},
                            {'text': 'ROM', 'is_correct': False},
                            {'text': 'Hard Disk', 'is_correct': False},
                            {'text': 'SSD', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Machine Learning',
                'questions': [
                    {
                        'text': 'What is supervised learning?',
                        'answers': [
                            {'text': 'Learning without labeled data', 'is_correct': False},
                            {'text': 'Learning with labeled data', 'is_correct': True},
                            {'text': 'Learning with unsorted data', 'is_correct': False},
                            {'text': 'Learning with unstructured data', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which algorithm is used for classification tasks?',
                        'answers': [
                            {'text': 'K-Means Clustering', 'is_correct': False},
                            {'text': 'Support Vector Machines (SVM)', 'is_correct': True},
                            {'text': 'Apriori Algorithm', 'is_correct': False},
                            {'text': 'A* Search Algorithm', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is overfitting in machine learning?',
                        'answers': [
                            {'text': 'When a model performs well on training data but poorly on new data', 'is_correct': True},
                            {'text': 'When a model performs poorly on training data but well on new data', 'is_correct': False},
                            {'text': 'When a model performs equally well on all data', 'is_correct': False},
                            {'text': 'When a model does not converge during training', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is a loss function used in neural networks?',
                        'answers': [
                            {'text': 'Mean Squared Error (MSE)', 'is_correct': True},
                            {'text': 'Precision', 'is_correct': False},
                            {'text': 'Recall', 'is_correct': False},
                            {'text': 'Gradient Descent', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a neural network?',
                        'answers': [
                            {'text': 'A computational model inspired by the human brain', 'is_correct': True},
                            {'text': 'A type of database', 'is_correct': False},
                            {'text': 'A genetic algorithm', 'is_correct': False},
                            {'text': 'A decision tree model', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Artificial Intelligence (AI)',
                'questions': [
                    {
                        'text': 'What is artificial intelligence?',
                        'answers': [
                            {'text': 'The study of algorithms', 'is_correct': False},
                            {'text': 'The simulation of human intelligence in machines', 'is_correct': True},
                            {'text': 'The creation of physical robots', 'is_correct': False},
                            {'text': 'The study of mathematical models', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is the Turing Test used for?',
                        'answers': [
                            {'text': 'To test a computer\'s speed', 'is_correct': False},
                            {'text': 'To measure a machine\'s ability to exhibit human-like intelligence', 'is_correct': True},
                            {'text': 'To check a program\'s efficiency', 'is_correct': False},
                            {'text': 'To evaluate a neural network\'s performance', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is a branch of AI?',
                        'answers': [
                            {'text': 'Natural Language Processing (NLP)', 'is_correct': True},
                            {'text': 'Database Management', 'is_correct': False},
                            {'text': 'Cloud Computing', 'is_correct': False},
                            {'text': 'Network Security', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What does "reinforcement learning" involve?',
                        'answers': [
                            {'text': 'Learning from a dataset', 'is_correct': False},
                            {'text': 'Learning through trial and error with rewards and punishments', 'is_correct': True},
                            {'text': 'Learning by mimicking human behavior', 'is_correct': False},
                            {'text': 'Learning from labeled data', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is considered an AI technique?',
                        'answers': [
                            {'text': 'Genetic Algorithms', 'is_correct': True},
                            {'text': 'SQL Queries', 'is_correct': False},
                            {'text': 'Binary Search', 'is_correct': False},
                            {'text': 'Merge Sort', 'is_correct': False}
                        ]
                    }
                ]
            },
            {
                'title': 'Blockchain',
                'questions': [
                    {
                        'text': 'What is blockchain?',
                        'answers': [
                            {'text': 'A type of database', 'is_correct': False},
                            {'text': 'A distributed ledger technology', 'is_correct': True},
                            {'text': 'A cloud storage solution', 'is_correct': False},
                            {'text': 'A type of encryption', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a "block" in blockchain?',
                        'answers': [
                            {'text': 'A unit of data storage', 'is_correct': False},
                            {'text': 'A record of transactions', 'is_correct': True},
                            {'text': 'A type of encryption', 'is_correct': False},
                            {'text': 'A software program', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which of the following is a popular cryptocurrency?',
                        'answers': [
                            {'text': 'Ethereum', 'is_correct': True},
                            {'text': 'US Dollar', 'is_correct': False},
                            {'text': 'Yen', 'is_correct': False},
                            {'text': 'Euro', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'What is a "smart contract"?',
                        'answers': [
                            {'text': 'A physical contract that is digitally signed', 'is_correct': False},
                            {'text': 'A self-executing contract with the terms written in code', 'is_correct': True},
                            {'text': 'A contract stored on a cloud server', 'is_correct': False},
                            {'text': 'A legally binding digital document', 'is_correct': False}
                        ]
                    },
                    {
                        'text': 'Which consensus algorithm is commonly used in blockchain?',
                        'answers': [
                            {'text': 'Proof of Work (PoW)', 'is_correct': True},
                            {'text': 'Dijkstra\'s Algorithm', 'is_correct': False},
                            {'text': 'Breadth-First Search', 'is_correct': False},
                            {'text': 'Quick Sort', 'is_correct': False}
                        ]
                    }
                ]
            },
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
