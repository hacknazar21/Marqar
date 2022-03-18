// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";
import { Canvas } from "./Canvas.js";
import { getRandomBetween } from "./functions.js";



const canvasGrid = new Canvas({
    canvasID: "canvasGraph",
    w: 256 * 2,
    h: 91 * 2
});

function chart(data) {

    canvasGrid.context.clearRect(0, 0, canvasGrid.view.width, canvasGrid.view.height);
    const ROWS_COUNT = 4;
    const step = canvasGrid.view.height / ROWS_COUNT;


    canvasGrid.context.beginPath();
    canvasGrid.context.lineWidth = 1;
    canvasGrid.context.setLineDash([5, 3]);
    canvasGrid.context.strokeStyle = "#A7A7A7";

    canvasGrid.context.lineDashOffset = 4;
    for (let i = 1; i <= ROWS_COUNT; i++) {
        const y = step * i;
        canvasGrid.context.moveTo(0, y);
        canvasGrid.context.lineTo(canvasGrid.view.width, y);
    }
    canvasGrid.context.stroke();
    canvasGrid.context.closePath();

    const [minY, maxY] = computeBoudaries(data);
    const yRatio = (maxY - minY) / (canvasGrid.view.height - 60);
    const xRatio = canvasGrid.view.width / data.length;

    canvasGrid.context.beginPath();

    canvasGrid.context.setLineDash([]);

    canvasGrid.context.lineWidth = 4;

    const coords = data.map((y, i) => [
        Math.floor(i * xRatio),
        Math.floor(canvasGrid.view.height - 20 - (y[1] - minY) / yRatio),
    ])
    let region = new Path2D();
    region.lineTo(0, canvasGrid.view.height);

    for (const [x, y] of coords) {
        canvasGrid.context.lineTo(x, y);
        region.lineTo(x, y);

    }
    region.lineTo(canvasGrid.view.width - xRatio, canvasGrid.view.height);

    region.closePath();

    canvasGrid.context.strokeStyle = "#DAA520";
    canvasGrid.context.fillStyle = 'rgba(218, 196, 113, 0.2)';
    canvasGrid.context.fill(region, 'evenodd')
    canvasGrid.context.stroke();
    canvasGrid.context.closePath();

}

function computeBoudaries(data) {
    let max, min;

    for (const [, y] of data) {
        if (typeof min !== 'number') min = y;
        if (typeof max !== 'number') max = y;

        if (min > y) min = y;
        if (max < y) max = y;
    }

    return [min, max];
}
const data = [];
for (let x = 0; x < 50; x++) {
    data.push(new Array());
    for (let y = 0; y < 50; y++) {
    }
}


function dataSet() {
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            data[x][y] = getRandomBetween(10, 100);
        }
    }
    chart(data)
}


start_animate(300);
function start_animate(duration) {
    var requestID;
    var startTime = null;
    var animate = function (time) {
        time = new Date().getTime(); //millisecond-timstamp
        if (startTime === null) {
            startTime = time;
        }
        var progress = time - startTime;

        startTime++;

        if (progress > duration) {
            dataSet();

            requestID = requestAnimationFrame(animate);
            startTime = null;

        }
        else {
            cancelAnimationFrame(requestID);
        }
        requestID = requestAnimationFrame(animate);
    }



    animate();
}


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

