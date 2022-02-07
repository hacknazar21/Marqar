// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

function circleText() {
    const angleToRadian = (angle) => {
        return angle * (Math.PI / 180);
    }
    const radius = 55;
    const diameter = radius * 2;

    const circle = document.querySelector('.circle');

    const textCircle = circle.innerHTML;
    console.log(textCircle);
    const characterCircle = textCircle.split('');


    let angle = -90;
    const deltaAngle = (320 / characterCircle.length);
    circle.innerText = null;
    characterCircle.forEach((char, index) => {
        if (char != ' ') {
            const charElement = document.createElement('span');
            charElement.innerText = char;
            const xPos = radius * Math.cos(angleToRadian(angle));
            const yPos = radius * Math.sin(angleToRadian(angle));

            const translate = `translate(${xPos}px, ${yPos}px)`;
            const rotate = `rotate(${(index * deltaAngle)}deg)`;

            //charElement.style.animation = 'rotateLetters 3s infinite ease';
            charElement.style.transform = `${translate} ${rotate}`;


            circle.appendChild(charElement);
        }
        angle += deltaAngle;

    });


}

document.addEventListener('DOMContentLoaded', (event) => {

    circleText();
    cutLongText();
});

document.addEventListener('click', (event) => {
    console.log(event.target);
    event.target.classList.contains('case-card__hover-box') ? document.querySelector('.taped-card').classList.remove('taped-card') : null;
    event.target.classList.contains('face-case-card') ? event.target.classList.add('taped-card') : null;
    if (event.target.classList.contains('menu_arrow')) {
        event.preventDefault();
        event.target.classList.toggle("_active");
    }
    else if (document.querySelector('.menu_arrow') != null) {
        document.querySelector('._active').classList.remove("_active");
    }

})

function cutLongText() {
    var elem, size, text;
    elem = document.getElementsByClassName('case-card__text');
    size = 450; // Количество отображаемых символов
    for (let element of elem) {
        text = element.innerHTML;
        if (text.length > size) {
            text = text.slice(0, size);
        }
        element.innerHTML = text + '...';
    }
}
