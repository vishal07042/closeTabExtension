let currentQuestion;

function getRandomQuestion() {
    return dsaQuestions[Math.floor(Math.random() * dsaQuestions.length)];
}

function displayQuestion() {
    currentQuestion = getRandomQuestion();
    document.getElementById('question').textContent = currentQuestion.question;
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
    const correctAnswer = currentQuestion.answer.toLowerCase();

    if (userAnswer === correctAnswer) {
        document.getElementById('result').textContent = 'Correct! You can now browse.';
        document.getElementById('result').style.color = 'green';
        // Enable browsing
        chrome.storage.local.set({ 'questionAnswered': true });
        document.body.style.pointerEvents = 'auto';
    } else {
        document.getElementById('result').textContent = 'Incorrect! Try again.';
        document.getElementById('result').style.color = 'red';
    }
}

// Initial setup
document.addEventListener('DOMContentLoaded', async () => {
    const result = await chrome.storage.local.get('questionAnswered');
    
    if (!result.questionAnswered) {
        displayQuestion();
        document.body.style.pointerEvents = 'none';
    } else {
        document.body.style.pointerEvents = 'auto';
        document.querySelector('.quiz-box').style.display = 'none';
    }
    
    document.getElementById('submit').addEventListener('click', checkAnswer);
    document.getElementById('answer').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
}); 