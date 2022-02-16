// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";


document.addEventListener('DOMContentLoaded', (event) => {
    reverseElements();
    cutLongText();
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