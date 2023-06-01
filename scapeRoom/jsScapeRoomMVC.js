var container = document.getElementById('container');
var character = document.getElementById('character');
var obstaculos = document.getElementsByClassName('obstaculo');
var blocoQuestao = document.getElementsByClassName('blocoQuestao');

var containerWidth = container.offsetWidth;
var containerHeight = container.offsetHeight;
var positionTop = parseInt(character.style.top) || character.offsetHeight + 25;
var positionLeft = parseInt(character.style.left) || character.offsetWidth + 5;
var stepSize = 30;
character.style.top = positionTop + 'px';
character.style.left = positionLeft + 'px';

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 37: // Left arrow key
            positionLeft = Math.max(positionLeft - stepSize, character.offsetWidth + 5);
            break;
        case 38: // Up arrow key
            positionTop = Math.max(positionTop - stepSize, character.offsetHeight + 25);
            break;
        case 39: // Right arrow key
            positionLeft = Math.min(positionLeft + stepSize, containerWidth - character.offsetWidth);
            break;
        case 40: // Down arrow key
            positionTop = Math.min(positionTop + stepSize, containerHeight - character.offsetHeight);
            break;
    }

    character.style.top = positionTop + 'px';
    character.style.left = positionLeft + 'px';

    for (var i = 0; i < obstaculos.length; i++) {
        var positionObstaculo = obstaculos[i].getBoundingClientRect();
        var positionCharacter = character.getBoundingClientRect();

        if (positionCharacter.right > positionObstaculo.left &&
            positionCharacter.bottom > positionObstaculo.top &&
            positionCharacter.left < positionObstaculo.right &&
            positionCharacter.top < positionObstaculo.bottom) {
            switch (event.keyCode) {
                case 37: // Left arrow key
                    positionLeft = positionLeft + stepSize;
                    break;
                case 38: // Up arrow key
                    positionTop = positionTop + stepSize;
                    break;
                case 39: // Right arrow key
                    positionLeft = positionLeft - stepSize;
                    break;
                case 40: // Down arrow key
                    positionTop = positionTop - stepSize;
                    break;
            }
            character.style.top = positionTop + 'px';
            character.style.left = positionLeft + 'px';
        }
    }

    var personagemColideBlocoQuestao = false; // Variável para rastrear se o personagem está em colisão com algum blocoQuestao

    for (var i = 0; i < blocoQuestao.length; i++) {
        var positionBlocoQuestao = blocoQuestao[i].getBoundingClientRect();
        var positionCharacter = character.getBoundingClientRect();

        if (positionCharacter.right > positionBlocoQuestao.left &&
            positionCharacter.bottom > positionBlocoQuestao.top &&
            positionCharacter.left < positionBlocoQuestao.right &&
            positionCharacter.top < positionBlocoQuestao.bottom) {
            personagemColideBlocoQuestao = true; // O personagem está em colisão com um blocoQuestao
            console.log('entrou');
            break; // Não é necessário continuar verificando colisões com outros blocos se já houve uma colisão
        }
    }

    var exclamacao = document.querySelector('.exclamacao');

    if (personagemColideBlocoQuestao) {
        exclamacao.style.display = 'block';
    } else {
        exclamacao.style.display = 'none';
    }
});

