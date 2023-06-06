// __________________________________________ Declaração de variáveis __________________________________________
var perguntasExibidas = [];
var blocoQuestaoRespondido = [];
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

// __________________________________________ Movimentação do personagem __________________________________________

document.addEventListener('keydown', function (event) {
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

    // __________________________________________ Identificação de colisão com o labirinto __________________________________________

    character.style.top = positionTop + 'px';
    character.style.left = positionLeft + 'px';

    for (var i = 0; i < obstaculos.length; i++) {
        var positionObstaculo = obstaculos[i].getBoundingClientRect();
        var positionCharacter = character.getBoundingClientRect();

        if (
            positionCharacter.right > positionObstaculo.left &&
            positionCharacter.bottom > positionObstaculo.top &&
            positionCharacter.left < positionObstaculo.right &&
            positionCharacter.top < positionObstaculo.bottom
        ) {
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

    // __________________________________________ Identificação de colisão com o blocoQuestao __________________________________________

    var blocoQuestaoColidido = null;
    var personagemColideBlocoQuestao = false; // Variável para rastrear se o personagem está em colisão com algum blocoQuestao

    for (var i = 0; i < blocoQuestao.length; i++) {
        var positionBlocoQuestao = blocoQuestao[i].getBoundingClientRect();
        var positionCharacter = character.getBoundingClientRect();

        if (
            positionCharacter.right > positionBlocoQuestao.left &&
            positionCharacter.bottom > positionBlocoQuestao.top &&
            positionCharacter.left < positionBlocoQuestao.right &&
            positionCharacter.top < positionBlocoQuestao.bottom
        ) {
            personagemColideBlocoQuestao = true;
            blocoQuestaoColidido = blocoQuestao[i]; // O personagem está em colisão com um blocoQuestao
            break; // Não é necessário continuar verificando colisões com outros blocos se já houve uma colisão
        }
    }

    // __________________________________________ Aparecer exclamação/Aparecer pergunta/Tratamento da pergunta __________________________________________

    var exclamacao = document.querySelector('.exclamacao');
    var loopInterrompido = false;

    if (
        personagemColideBlocoQuestao &&
        !blocoQuestaoRespondido.includes(blocoQuestaoColidido.getAttribute('data-bloco'))
    ) {
        exclamacao.style.display = 'block';

        if (event.keyCode === 32) {
            if (blocoQuestaoColidido) {
                var blocoSelecionado = blocoQuestaoColidido.getAttribute('data-bloco');
                console.log('Bloco selecionado: ' + blocoSelecionado);

                var perguntaAleatoria;
                do {
                    perguntaAleatoria = Math.floor(Math.random() * 11) + 1;
                } while (perguntasExibidas.includes(perguntaAleatoria));

                perguntasExibidas.push(perguntaAleatoria);

                var pergunta = document.querySelector('.pergunta' + parseInt(perguntaAleatoria));
                pergunta.style.display = 'block';

                var respostas = document.getElementsByClassName('caixaRespostas' + parseInt(perguntaAleatoria))[0]
                    .children;
                for (var i = 0; i < respostas.length; i++) {
                    respostas[i].addEventListener('click', function () {
                        if (loopInterrompido) return;
                        var respostaClicada = this.querySelector('p').innerText;
                        lidarComResposta(respostaClicada);
                        loopInterrompido = true;
                    });
                }
            }
        }
    } else {
        exclamacao.style.display = 'none';
    }

    function lidarComResposta(resposta) {
        alert('Resposta clicada: ' + resposta);

        var pergunta = document.querySelector('.pergunta' + parseInt(perguntaAleatoria));
        pergunta.style.display = 'none';

        if (resposta != 'C - Mundial') {
            alert('wasted');
        } else {
            alert('great!');
            blocoQuestaoRespondido.push(blocoSelecionado);
            console.log('Os blocos respondidos foram: ', blocoQuestaoRespondido);
        }
    }
});
