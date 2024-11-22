let currentQuestion;

function getRandomQuestion() {
    return dsaQuestions[Math.floor(Math.random() * dsaQuestions.length)];
}

function displayQuestion() {
    currentQuestion = getRandomQuestion();
    document.getElementById('question').textContent = currentQuestion.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const input = document.createElement('input');
        input.type = 'radio';
        input.id = `option${index}`;
        input.name = 'answer';
        input.value = index;
        
        const label = document.createElement('label');
        label.htmlFor = `option${index}`;
        label.textContent = option;
        
        optionDiv.appendChild(input);
        optionDiv.appendChild(label);
        optionsContainer.appendChild(optionDiv);
    });
    
    document.getElementById('result').textContent = '';
}

function checkAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    
    if (!selectedOption) {
        document.getElementById('result').textContent = 'Please select an answer!';
        document.getElementById('result').style.color = 'red';
        return;
    }
    
    const userAnswer = parseInt(selectedOption.value);
    
    if (userAnswer === currentQuestion.answer) {
        document.getElementById('result').textContent = 'Correct! You can now browse.';
        document.getElementById('result').style.color = 'green';
        chrome.storage.local.set({ 'questionAnswered': true });
        document.body.classList.remove('blocked');
    } else {
        document.getElementById('result').textContent = 'Incorrect! Try again.';
        document.getElementById('result').style.color = 'red';
    }
}

// Initial setup
document.addEventListener('DOMContentLoaded', async () => {
    // Reset question state for new tab
    await chrome.storage.local.set({ 'questionAnswered': false });
    
    const result = await chrome.storage.local.get('questionAnswered');
    
    // Always show quiz in new tab
    displayQuestion();
    document.body.style.pointerEvents = 'auto';
    document.querySelector('.quiz-box').style.pointerEvents = 'auto';
    document.querySelector('.quiz-box').style.display = 'block';
    
    document.getElementById('submit').addEventListener('click', checkAnswer);
}); 