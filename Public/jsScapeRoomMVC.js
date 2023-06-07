// __________________________________________ Declaração de variáveis __________________________________________
var contagemVidas = 0;
var perguntasExibidas = [];
var blocoQuestaoRespondido = [];
var container = document.getElementById('container');
var character = document.getElementById('character');
var obstaculos = document.getElementsByClassName('obstaculo');
var vida1 = document.querySelector('.vida1');
var vida2 = document.querySelector('.vida2');
var vida3 = document.querySelector('.vida3');
var wasted = document.querySelector('.gameOver');
var blocoQuestao = document.getElementsByClassName('blocoQuestao');
var containerWidth = container.offsetWidth;
var containerHeight = container.offsetHeight;
var positionTop = parseInt(character.style.top) || character.offsetHeight ;
var positionLeft = parseInt(character.style.left) || character.offsetWidth + 5;
var stepSize = 10;
character.style.top = positionTop + 'px';
character.style.left = positionLeft + 'px';

// Variáveis globais
var minutos = 20;
var segundos = 0;
var cronometro;

// Função para atualizar o cronômetro
function atualizarCronometro() {
  segundos--;

  if (segundos < 0) {
    minutos--;
    segundos = 59;
  }

  document.getElementById("minutos").textContent = ("0" + minutos).slice(-2);
  document.getElementById("segundos").textContent = ("0" + segundos).slice(-2);

  if (minutos === 0 && segundos === 0) {
    clearInterval(cronometro);
    wasted.style.display = 'flex'
    setTimeout(function() {
        location.reload();
        }, 5000);
  }
}

cronometro = setInterval(atualizarCronometro, 1000);



// __________________________________________ Movimentação do personagem __________________________________________

document.addEventListener('keydown', function (event) {
    
    switch (event.keyCode) {
        case 37: // Left arrow key
            positionLeft = Math.max(positionLeft - stepSize, character.offsetWidth + 5);
            break;
        case 38: // Up arrow key
            positionTop = Math.max(positionTop - stepSize, character.offsetHeight );
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
        var pergunta = document.querySelector('.pergunta' + parseInt(perguntaAleatoria));
        pergunta.style.display = 'none';

        if (resposta != 'C - Mundial' && 
        resposta !='A - Separar a lógica de apresentação dos dados' && 
        resposta != 'B - Responsável pela lógica de negócio e manipulação dos dados' &&
        resposta != 'D - Responsável pela manipulação das requisições e respostas HTTP' &&
        resposta != 'B - Torna o código mais organizado e modular'
        ) {
            switch (contagemVidas){
                case 0:
                    contagemVidas ++; 
                    alert('Cuidado em, lá se vai uma vida');
                    vida1.style.display = "none";
                    break;

                case 1:
                    contagemVidas ++; 
                    alert('Fica esperto senão logo logo você perde');
                    vida2.style.display = "none";
                    break;

                case 2:
                    contagemVidas ++; 
                    alert('Ih amigão tá dificil em. É a última chance');
                    vida3.style.display = "none";
                    break;

                case 3:
                    contagemVidas ++; 
                    wasted.style.display = 'flex'
                    setTimeout(function() {
                        location.reload();
                      }, 5000);
                    break;
            }
            
        } else {
            blocoQuestaoRespondido.push(blocoSelecionado);
            console.log('Os blocos respondidos foram: ', blocoQuestaoRespondido);
            blocoQuestao[blocoSelecionado].style.filter='contrast(0.25)';
        }
    }
});
