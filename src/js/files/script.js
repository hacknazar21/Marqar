// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";


document.addEventListener('DOMContentLoaded', (event) => {
    reverseElements();
    cutLongText();

    paintTable();
});

document.addEventListener('click', (event) => {
    console.log(event.target);

    (document.querySelector('.taped-card') != null) ? document.querySelector('.taped-card').classList.remove('taped-card') : null;
    if (event.target.classList.contains('face-case-card')) {
        event.target.classList.add('taped-card')
    }
    else if (event.target.closest('[data-tabs]')) {
        event.preventDefault();

        const tabsBoxes = document.querySelectorAll('[data-tabsbox]');
        for (let tabsBox of tabsBoxes) {
            if (tabsBox.contains(event.target)) {
                const tabId = event.target.dataset.tabs ? event.target.dataset.tabs : null;
                const tab = tabsBox.querySelector(`[data-tab = "${tabId}"]`);
                if (tab) {
                    const activeBtn = tabsBox.querySelector('.active-btn');
                    const activeTab = tabsBox.querySelector('.active-tab');

                    if (activeBtn && activeBtn != event.target) {
                        activeBtn.classList.remove('active-btn');
                        activeTab.classList.remove('active-tab');
                    }
                    event.target.classList.add('active-btn');
                    tab.classList.add('active-tab');

                }
                else console.log("No Found :(");
            }
        }

    }


})

function cutLongText() {
    var elem, size, text;
    elem = document.getElementsByClassName('case-card__text');
    size = 220; // Количество отображаемых символов
    for (let element of elem) {
        text = element.innerHTML;
        if (text.length > size) {
            while (true) {
                if (text.slice(0, size)[size - 1] == " " && text.slice(0, size)[size - 2] != ".") {
                    text = text.slice(0, size);
                    break;
                }
                else {
                    size++;
                }
            }
        }
        element.innerHTML = text + '...';
    }
}
function reverseElements() {
    const el = document.querySelectorAll('.about__item');
    if (el.length != 0) {
        for (let elIndex in el) {
            if ((parseInt(elIndex) + 1) % 2 == 0) {
                el[elIndex].classList.add('odd');
            }
        }
    }
}
function paintTable() {
    const el = document.querySelectorAll('[class*="__table-box"] [class*="__table-row"]');
    const elCell = document.querySelectorAll('[class*="__table-box"] [class*="__table-row"] [class*="__table-item"]');

    let mass2 = new Array();
    let mass3 = new Array();

    let sum1 = 0, sum2 = 0;

    for (const key in el) {
        if ((parseInt(key) + 1) % 2 == 0) {
            el[key].classList.add('_odd');
        }

        for (const keyCell in el[key].children) {
            if ((parseInt(keyCell) + 1) % 2 == 0) {
                mass2.push(parseFloat(el[key].children[keyCell].innerHTML.replace(",", ".").replace(" ", "")));
            }
            else if ((parseInt(keyCell) + 1) % 3 == 0) {
                mass3.push(parseFloat(el[key].children[keyCell].innerHTML.replace(",", ".").replace(" ", "")));
            }
        }
    }

    mass2.forEach(number => {
        if (!isNaN(number)) {
            console.log(number);
            sum1 = sum1 + number;
        }
    });
    mass3.forEach(number => {
        if (!isNaN(number)) {
            sum2 = sum2 + number;
        }
    });
    console.log(mass3);


    elCell[elCell.length - 2].innerHTML = sum1.toFixed(2);
    elCell[elCell.length - 1].innerHTML = sum2.toFixed(2);


}