// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";

function cutLongText() {
    var elem, size, text;
    elem = document.getElementsByClassName('case-card__text');
    size = 900; // Количество отображаемых символов
    for (let element of elem) {
        text = element.innerHTML;
        if (text.length > size) {
            text = text.slice(0, size);
        }
        element.innerHTML = text + '...';
    }
}
function ListenBtnMenu() {
    const buttonsMenu = document.getElementsByClassName('menu_arrow');
    let flag = false;
    for (let buttonMenu of buttonsMenu) {
        console.log(buttonMenu);
        buttonMenu.addEventListener('click', (event) => {
            event.preventDefault();
            if (!flag) event.target.classList.add("_active");
            else event.target.classList.remove("_active");
            flag = !flag;
        });
    }
}
ListenBtnMenu();
cutLongText();