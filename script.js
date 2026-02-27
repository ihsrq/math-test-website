class MathTest {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.selectedAnswer = null;
        
        this.initializeElements();
        this.generateQuestions();
        this.bindEvents();
    }
    
    initializeElements() {
        this.startScreen = document.getElementById('start-screen');
        this.questionScreen = document.getElementById('question-screen');
        this.resultScreen = document.getElementById('result-screen');
        
        this.startBtn = document.getElementById('start-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options');
        this.questionNumber = document.getElementById('question-number');
        this.timerDisplay = document.getElementById('timer');
        this.progressBar = document.getElementById('progress');
        
        this.finalScore = document.getElementById('final-score');
        this.totalQuestions = document.getElementById('total-questions');
        this.correctAnswers = document.getElementById('correct-answers');
        this.totalTime = document.getElementById('total-time');
    }
    
    generateQuestions() {
        const operations = ['+', '-', '*', '/'];
        const questions = [];
        
        for (let i = 0; i < 10; i++) {
            const operation = operations[Math.floor(Math.random() * operations.length)];
            let num1, num2, correctAnswer;
            
            switch (operation) {
                case '+':
                    num1 = Math.floor(Math.random() * 50) + 1;
                    num2 = Math.floor(Math.random() * 50) + 1;
                    correctAnswer = num1 + num2;
                    break;
                case '-':
                    num1 = Math.floor(Math.random() * 50) + 20;
                    num2 = Math.floor(Math.random() * num1);
                    correctAnswer = num1 - num2;
                    break;
                case '*':
                    num1 = Math.floor(Math.random() * 12) + 1;
                    num2 = Math.floor(Math.random() * 12) + 1;
                    correctAnswer = num1 * num2;
                    break;
                case '/':
                    num2 = Math.floor(Math.random() * 10) + 1;
                    correctAnswer = Math.floor(Math.random() * 10) + 1;
                    num1 = num2 * correctAnswer;
                    break;
            }
            
            const question = {
                text: `What is ${num1} ${operation} ${num2}?`,
                correctAnswer: correctAnswer,
                options: this.generateOptions(correctAnswer)
            };
            
            questions.push(question);
        }
        
        this.questions = questions;
    }
    
    generateOptions(correctAnswer) {
        const options = [correctAnswer];
        
        while (options.length < 4) {
            const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
            if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
                options.push(wrongAnswer);
            }
        }
        
        return this.shuffleArray(options);
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.showZoomLink());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartTest());
    }
    
    showZoomLink() {
        const zoomLink = "https://us05web.zoom.us/j/3262290369?pwd=a0xaMll2enVXUWRHMStPeDF6ZkFaUT09";
        
        this.startScreen.classList.add('hidden');
        this.questionScreen.classList.remove('hidden');
        
        this.questionText.textContent = "Join Zoom Meeting for Test";
        this.questionNumber.textContent = "Meeting Link";
        this.timerDisplay.textContent = "";
        
        this.optionsContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 20px;">
                <p style="font-size: 1.2em; color: #667eea; margin-bottom: 20px;">
                    Please join the Zoom meeting using the link below:
                </p>
                <div style="background: #f0f0f0; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <a href="${zoomLink}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: bold; font-size: 1.1em;">
                        ${zoomLink}
                    </a>
                </div>
                <p style="color: #666; margin-top: 20px;">
                    Click the link above to join the meeting. The test will be conducted by Imran.
                </p>
            </div>
        `;
        
        this.nextBtn.classList.add('hidden');
        this.progressBar.style.width = '100%';
    }
    
    startTest() {
        this.startScreen.classList.add('hidden');
        this.questionScreen.classList.remove('hidden');
        this.currentQuestion = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.startTimer();
        this.showQuestion();
    }
    
    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.timerDisplay.textContent = `Time: ${this.timer}s`;
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    showQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionText.textContent = question.text;
        this.questionNumber.textContent = `Question ${this.currentQuestion + 1} of ${this.questions.length}`;
        
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        this.progressBar.style.width = `${progress}%`;
        
        this.optionsContainer.innerHTML = '';
        this.selectedAnswer = null;
        
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            optionDiv.textContent = option;
            optionDiv.addEventListener('click', () => this.selectOption(option, optionDiv));
            this.optionsContainer.appendChild(optionDiv);
        });
        
        this.nextBtn.classList.add('hidden');
    }
    
    selectOption(answer, element) {
        if (this.selectedAnswer !== null) return;
        
        this.selectedAnswer = answer;
        element.classList.add('selected');
        
        const question = this.questions[this.currentQuestion];
        const isCorrect = answer === question.correctAnswer;
        
        setTimeout(() => {
            if (isCorrect) {
                element.classList.add('correct');
                this.score++;
            } else {
                element.classList.add('incorrect');
                this.showCorrectAnswer(question.correctAnswer);
            }
            
            this.nextBtn.classList.remove('hidden');
        }, 300);
    }
    
    showCorrectAnswer(correctAnswer) {
        const options = this.optionsContainer.querySelectorAll('.option');
        options.forEach(option => {
            if (parseInt(option.textContent) === correctAnswer) {
                option.classList.add('correct');
            }
        });
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion < this.questions.length) {
            this.showQuestion();
        } else {
            this.showResults();
        }
    }
    
    showResults() {
        this.stopTimer();
        this.questionScreen.classList.add('hidden');
        this.resultScreen.classList.remove('hidden');
        
        const percentage = Math.round((this.score / this.questions.length) * 100);
        this.finalScore.textContent = `${percentage}%`;
        this.totalQuestions.textContent = this.questions.length;
        this.correctAnswers.textContent = this.score;
        this.totalTime.textContent = `${this.timer}s`;
        
        let message = '';
        if (percentage >= 90) {
            message = 'Excellent! Outstanding performance!';
        } else if (percentage >= 70) {
            message = 'Good job! Well done!';
        } else if (percentage >= 50) {
            message = 'Nice effort! Keep practicing!';
        } else {
            message = 'Keep trying! Practice makes perfect!';
        }
        
        const messageDiv = document.createElement('p');
        messageDiv.textContent = message;
        messageDiv.style.fontSize = '1.2em';
        messageDiv.style.color = '#667eea';
        messageDiv.style.marginTop = '20px';
        messageDiv.style.fontWeight = 'bold';
        
        this.resultScreen.querySelector('.result-container').appendChild(messageDiv);
    }
    
    restartTest() {
        this.resultScreen.classList.add('hidden');
        this.startScreen.classList.remove('hidden');
        
        const messageDiv = this.resultScreen.querySelector('.result-container p:last-child');
        if (messageDiv && messageDiv.textContent.includes('Excellent') || 
            messageDiv.textContent.includes('Good') || 
            messageDiv.textContent.includes('Nice') || 
            messageDiv.textContent.includes('Keep')) {
            messageDiv.remove();
        }
        
        this.generateQuestions();
        this.stopTimer();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MathTest();
});
