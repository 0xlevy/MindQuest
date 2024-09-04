# MindQuest

MindQuest is an interactive quiz application built with Python, Flask/Django, HTML, and CSS. The app allows users to take multiple-choice quizzes, tracks their scores, and provides feedback on their performance. The application is designed to be easily extensible, allowing for the addition of new quiz questions, and includes a REST API for accessing quiz data.

## Features

- **User Authentication**: Secure registration and login system to manage user accounts.
- **Session Management**: Tracks user sessions to store quiz progress and results.
- **Multiple-Choice Quizzes**: Users can take quizzes with various questions and receive instant feedback.
- **Scoring System**: Real-time scoring with feedback on correct and incorrect answers.
- **Time Limits**: Set time limits on quizzes to add a challenge.
- **Responsive Design**: The application is fully responsive, providing an optimal experience on mobile and desktop devices.
- **Extensible**: Easily add new quiz questions and categories.
- **REST API**: Expose quiz questions and results via a RESTful API.

## Tech Stack

- **Backend**: Python (Flask or Django)
- **Frontend**: HTML, CSS
- **Database**: SQLite/PostgreSQL
- **Authentication**: Flask-Login (Flask) or Django's built-in auth system
- **API**: Flask-RESTful (Flask) or Django REST framework

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mindquest.git
   cd mindquest
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows use `venv\Scripts\activate`
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:
   - For Flask:
     ```bash
     flask db init
     flask db migrate
     flask db upgrade
     ```
   - For Django:
     ```bash
     python manage.py migrate
     ```

5. Run the application:
   - For Flask:
     ```bash
     flask run
     ```
   - For Django:
     ```bash
     python manage.py runserver
     ```

6. Access the application in your browser at `http://127.0.0.1:5000` (Flask) or `http://127.0.0.1:8000` (Django).

## Usage

- **Registration & Login**: Create an account or log in with existing credentials.
- **Take a Quiz**: Start a quiz from the home page. Answer multiple-choice questions within the set time limit.
- **View Results**: After completing a quiz, view your score and feedback on your performance.
- **Add New Questions**: (For Admins) Add new questions via the admin interface or directly into the database.

## API Endpoints

- **GET /api/quizzes**: Retrieve a list of available quizzes.
- **GET /api/quizzes/<id>**: Retrieve a specific quiz and its questions.
- **POST /api/quizzes/<id>/submit**: Submit answers for a quiz and receive a score.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss improvements or new features.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community for the tools and libraries used in this project.
