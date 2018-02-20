questions = [
	{
		question: 'Our Sun is just one of many millions of stars in a group of stars called a:',
		answers: ['universe', 'black hole', 'galaxy', 'solar system'],
		correctIndex: 3
	},
	{
		question: 'In order from the hottest to the coolest stars, the order of the stellar spectral sequence is:',
		answers: ['MKGFABO', 'ABFGKMO', 'OBAFGKM', 'OBFGAMK'],
		correctIndex: 2
	},
	{
		question: 'What is the largest planet in the solar system?',
		answers: ['earth', 'mars', 'jupiter', 'mercury'],
		correctIndex: 2
	},
	{
		question: 'Hubble\'s Law enables astronomers to estimate the distance to a galaxy if they can determine the galaxy\'s:',
		answers: ['velocity of recession', 'mass', 'spectral type', 'temperature'],
		correctIndex: 0
	},
	{
		question: 'The age of a star cluster can be deduced from:',
		answers: ['the turn-off point of stars on its main sequence', 'the number of stars it contains', 
		'its radial velocity', 'its location in the Milky Way galaxy'],
		correctIndex: 0
	},
	{
		question: 'Most of the helium in the Universe is believed to have been produced in:',
		answers: ['red giants', 'the big bang', 'supernovae', 'main sequence stars'],
		correctIndex: 1
	},
	{
		question: 'In about 5 billion years, the sun will become:',
		answers: ['a supernova', 'a black hole', 'a red giant', 'a neutron star'],
		correctIndex: 2
	},
	{
		question: 'When neutron degeneracy fails in a high-mass star, it becomes a:',
		answers: ['white dwarf', 'black hole', 'pulsar', 'neutron star'],
		correctIndex: 1
	},
	{
		question: 'The cosmic micorwave background radiation comes from:',
		answers: ['quasars', 'the solar nebula', 'the big bang', 'radio galaxies'],
		correctIndex: 2
	},
	{
		question: 'The main sequence is primarily a sequence in stellar:',
		answers: ['size', 'age', 'mass', 'composition'],
		correctIndex: 2
	}
];

questionTemplate = '<p class="question"></p>';

answersTemplate = 
	'<div class="answer-block">\
		<input type="radio" name="choice" id="" value="" required>\
		<label for=""></label>\
	</div>';

questionPageRestTemplate = 
	'<button class="question-button js-question-button-submit">Submit</button>\
	 <button type="submit" class="question-button js-question-button-next">Next</button>\
	 <footer class="question-status">\
		<span class="question-status-number"></span>\
		<span class="correct-number"></span>\
		<span class="incorrect-number"></span>\
	 </footer>';

finalPageTemplate =
	'<div>\
		<h1 class="correct-number"></h1>\
	 	<h1 class="incorrect-number"></h1>\
	 	<button class="start-button js-start-over-button">Start Over</button>\
	 </div>';

function renderNextPage(rootElement, stats, questions, questionTemplate, answersTemplate, questionPageRestTemplate, finalPageTemplate)
{
	if (stats.questionCount < questions.length - 1)
	{
		renderQuestionPage(rootElement, stats, questions, questionTemplate, answersTemplate, questionPageRestTemplate);
	}
	else
	{
		renderFinalPage(rootElement, stats, finalPageTemplate);
	}
}

function renderQuestionPage(rootElement, stats, questions, questionTemplate, answersTemplate, questionPageRestTemplate)
{
	var elementArray = [];

	var questionElement = $(questionTemplate).text(questions[stats.questionCount].question);

	var answersElement = questions[stats.questionCount].answers.map(function(item, index){
		var element = $(answersTemplate);

		var radioElement = element.find('input[type="radio"]');
		radioElement.attr('id', 'answer-' + index);
		radioElement.attr('value', index);

		var labelElement = element.find('label');
		labelElement.attr('for', 'answer-' + index);
		labelElement.text(item);
		return element;
	});

	var otherElement = $(questionPageRestTemplate);
	otherElement.find('.question-status-number').text((stats.questionCount + 1) + '/' + questions.length);
	otherElement.find('.correct-number').text('correct: ' + stats.correctCount);
	otherElement.find('.incorrect-number').text('incorrect: ' + stats.incorrectCount);

	elementArray.push(questionElement);
	answersElement.forEach(function(item){
		elementArray.push(item)});
	elementArray.push(otherElement);

	rootElement.html(elementArray);
	stats.submitted = false;
}

function renderFinalPage(rootElement, stats, finalPageTemplate)
{
	var element = $(finalPageTemplate);
	element.find('.correct-number').text('Correct: ' + stats.correctCount);
	element.find('.incorrect-number').text('Incorrect: ' + stats.incorrectCount);

	rootElement.html(element);
}

function submitAnswer(rootElement, questions, stats)
{
	if (stats.submitted)
	{
		return;
	}

	var correctIndex = questions[stats.questionCount].correctIndex;

	var checkedRadioElement = rootElement.find('input[type="radio"]').filter(':checked');

	if (checkedRadioElement.length === 0)
	{
		return;
	}

	var checkedIndex = parseInt(checkedRadioElement.attr('value'));
	var checkedLabelElement = checkedRadioElement.closest('div').find('label');
	
	if (checkedIndex === correctIndex)
	{
		checkedLabelElement.css('background-color', 'green');
		stats.correctCount++;
	}
	else
	{
		checkedLabelElement.css('background-color', 'red');
		correctLabelElement = rootElement.find('label').eq(correctIndex);
		correctLabelElement.css('background-color', 'green');
		stats.incorrectCount++;
	}

	stats.questionCount++;
	stats.submitted = true;
}

function onLoad(){
	var stats = {correctCount: 0, incorrectCount: 0, questionCount: 0, submitted: false};

	$('.form').submit(function(event){
		event.preventDefault();
		renderNextPage($(this).closest('.form'), stats, questions, questionTemplate, answersTemplate, 
			questionPageRestTemplate, finalPageTemplate);
	})

	$('.form').on('click', '.js-question-button-submit', function(event){
		event.preventDefault();
		submitAnswer($(this).closest('.form'), questions, stats);
	})

	$('.form').on('click', '.js-start-over-button', function(){
		location.reload();
	})
}

$(onLoad);