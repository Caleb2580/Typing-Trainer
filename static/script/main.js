
let typing = document.getElementsByClassName('typing')[0];
let errorsDiv = document.getElementsByClassName('errors')[0];

training = .8
errors = []

function updateTraining(amt) {
    training = Math.min(training+amt, 1);
    training = Math.max(training, 0);
    let tr_perc = document.getElementById('tr');
    tr_perc.innerHTML = Math.round(training * 100, 0) + '%';
}

// Training Stuff
let trDiv = document.getElementsByClassName('tr')[0];

let leftButton = document.createElement('button');
leftButton.innerHTML = '<';
leftButton.onclick = function() { updateTraining(-.1); };
let perc = document.createElement('h1');
perc.id = 'tr';
perc.innerHTML = '';
let rightButton = document.createElement('button');
rightButton.innerHTML = '>';
rightButton.onclick = function() { updateTraining(.1); };

trDiv.appendChild(leftButton);
trDiv.appendChild(perc);
trDiv.appendChild(rightButton);

updateTraining(0);


function getCommonErrors() {
    error_dict = {}
    error_words = {};
    for (let e in errors) {
        if (errors[e] in error_dict) {
            error_dict[errors[e]]++;
        } else {
            error_dict[errors[e]] = 1;
        }
        error_words[errors[e]] = [];
    }

    let items = Object.keys(error_dict).map(function(w) {
        return [w, error_dict[w]];
    });
    
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    
    let sorted_error_dict = {}
    items.forEach(function(item) {
        sorted_error_dict[item[0]] = item[1];
    });

    return sorted_error_dict;
}

function getWords() {
    let words = "";

    error_dict = {}
    error_words = {};
    for (let e in errors) {
        if (errors[e] in error_dict) {
            error_dict[errors[e]]++;
        } else {
            error_dict[errors[e]] = 1;
        }
        error_words[errors[e]] = [];
    }

    for (let w in dictionary) {
        for (let e in error_dict) {
            if (e[0] == ' ') {
                if (dictionary[w][0] == e[1]) {
                    error_words[e].push(dictionary[w]);
                }
            } else if (e[1] == ' ') {
                if (dictionary[w][dictionary[w].length-1] == e[0]) {
                    error_words[e].push(dictionary[w]);
                }
            } else {
                if (dictionary[w].indexOf(e) != -1) {
                    error_words[e].push(dictionary[w]);
                }
            }
        }
    }

    for (let i = 0; i < 10; i++) {
        if (errors.length > 0 && Math.random() < training) {
            contains = errors[Math.floor(Math.random() * errors.length)];
            let w = error_words[contains][Math.floor(Math.random() * error_words[contains].length)];
            words += w + " ";
        } else {
            words += dictionary[Math.floor(Math.random() * dictionary.length)] + " ";
        }
    }

    getCommonErrors();
    return words;
}

function editTraining(amt) {
    console.log(amt);
}

let toType;

let letters = [];
let rw = [];  // Right or Wrong

let typingIndex = 0;

let htmlLetters = [];
let lettersLength = 44;

for (let i = 0; i < lettersLength; i++) {
    htmlLetters.push(document.createElement('h1'));
    htmlLetters[i].classList.add("letter");
    if (i < lettersLength/2) {
        htmlLetters[i].classList.add("finished");
    } else if (i == lettersLength/2) {
        htmlLetters[i].classList.add("middle");
    }
    typing.appendChild(htmlLetters[i]);
}


let htmlErrors = [];
let htmlErrorsLength = 10;

for (let i = 0; i < htmlErrorsLength; i++) {
    htmlErrors.push(document.createElement('h1'));
    htmlErrors[i].style = 'margin: 0; padding: 0; color: rgba(255, 255, 255, ' + (htmlErrorsLength-1-i)/(htmlErrorsLength) + ');'
    errorsDiv.appendChild(htmlErrors[i]);
}

function updateErrorDiv() {
    let e_dict = getCommonErrors();
    for (let i = 0; i < htmlErrorsLength; i++) {
        htmlErrors[i].innerHTML = '';
    }
    let i = 0;
    for (let e in e_dict) {
        if (i >= htmlErrorsLength) {break;}
        
        htmlErrors[i].innerHTML = e.replace(' ', '_');
        i++;
    }
}

function reset() {
    let toType = getWords();

    letters = [];
    rw = [];  // Right or Wrong
    for (let c in toType) {
        letters.push(toType[c]);
        rw.push(1);
    }

    typingIndex = 0;

    updateErrorDiv();
}


function updateTyping() {
    for (let i = 0; i < lettersLength; i++) {
        htmlLetters[i].innerHTML = '';
    }
    let start = parseInt(typingIndex - lettersLength/2);
    for (let i = start; i < start + lettersLength; i++) {
        if (i-start >= 0 && i >= 0 && i < letters.length) {
            if (letters[i] == ' ' && rw[i] == 0) {
                htmlLetters[i-start].innerHTML = '&nbsp';
            } else {
                htmlLetters[i-start].innerHTML = letters[i];
            }
            
            if (rw[i] == 0) {
                htmlLetters[i-start].classList.add('wrong');
            } else {
                htmlLetters[i-start].classList.remove('wrong');
            }
        }
    }
}

function next() {
    typingIndex++;
    if (typingIndex >= letters.length) {
        typingIndex = letters.length;
        reset();
    }
    updateTyping();
}

function back() {
    rw[typingIndex] = 1;
    typingIndex--;
    if (typingIndex < 0) {
        typingIndex = 0;
    }
    updateTyping();
}

reset();

updateTyping();


window.addEventListener("keydown", function (evt) {
    if (32 <= evt.keyCode) {
        if (typingIndex > 0 && rw[typingIndex-1] == 0) {
            rw[typingIndex] = 0;
            if (typingIndex < letters.length-1)
                next();
        } else {
            if (evt.key == letters[typingIndex]) {
                rw[typingIndex] = 1;
                next();
            } else {
                if (typingIndex > 0) {
                    errors.push(letters[typingIndex-1] + letters[typingIndex]);
                }
                if (typingIndex < letters.length-1) {
                    errors.push(letters[typingIndex] + letters[typingIndex+1]);
                }
                rw[typingIndex] = 0;
                if (typingIndex < letters.length-1)
                    next();
            }
        }
    } else if (evt.keyCode == 8) {
        back();
    } else if (evt.keyCode == 13 && typingIndex == letters.length-1 && rw[typingIndex-1] == 1) {
        next();
    }
});



