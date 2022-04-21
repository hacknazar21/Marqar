// Подключение функционала "Чертогов Фрилансера"
import { isMobile } from "./functions.js";
// Подключение списка активных модулей
import { flsModules } from "./modules.js";
import { Canvas } from "./Canvas.js";
import { getRandomBetween } from "./functions.js";



if (document.querySelector('#canvasGraph') != null) {
    const canvasGrid = new Canvas({
        canvasID: "canvasGraph",
        w: 256 * 2,
        h: 91 * 2
    });
    const { width, height } = canvasGrid.view.getBoundingClientRect();
    canvasGrid.view.width = width * 2;
    canvasGrid.view.height = height * 2;

    /* data - массив данных отображаемых на графике */
    const data = [];

    /* заполнение массива data случайными данными, заменить на реальные данные */
    for (let index = 0; index < 10; index++) {
        data.push([getRandomBetween(0, 100), getRandomBetween(0, 100)]);
    }

    const chartObj = chart(data);
    chartObj.init();


    function chart(data) {

        const ROWS_COUNT = 4;
        const RADIUS_CIRCLE = 6;
        let raf;
        const step = (canvasGrid.view.height - 2) / ROWS_COUNT;

        const proxy = new Proxy({}, {
            set(...args) {
                const result = Reflect.set(...args);
                raf = requestAnimationFrame(paint);
                return result;
            }
        });

        function clear() {
            canvasGrid.context.clearRect(0, 0, canvasGrid.view.width, canvasGrid.view.height);
        }

        function paint() {
            clear();
            const [minY, maxY] = computeBoudaries(data);
            const yRatio = (maxY - minY) / (canvasGrid.view.height - 60);
            const xRatio = canvasGrid.view.width / data.length;
            const coords = data.map((y, i) => [
                Math.floor(i * xRatio),
                Math.floor(canvasGrid.view.height - 20 - (y[1] - minY) / yRatio),
            ])
            let region = new Path2D();
            let circle = new Path2D();

            /* Рисование линии графика */
            canvasGrid.context.beginPath();
            canvasGrid.context.setLineDash([]);
            canvasGrid.context.lineWidth = 4;
            region.lineTo(0, canvasGrid.view.height);
            let xCircle, yCircle;
            for (const [x, y] of coords) {
                xCircle = x;
                yCircle = y;
                canvasGrid.context.lineTo(x, y);
                region.lineTo(x, y);
                if (isOver(proxy.mouse, x, data.length)) {
                    canvasGrid.context.arc(x, y, RADIUS_CIRCLE, 0, Math.PI * 2);
                    canvasGrid.context.shadowBlur = 0;
                    canvasGrid.context.strokeStyle = "#DAA520";
                    canvasGrid.context.stroke(circle, 'evenodd')
                }
            }
            canvasGrid.context.strokeStyle = "#DAA520";
            canvasGrid.context.shadowBlur = 0;
            canvasGrid.context.stroke();
            /* Рисование линии графика */

            /* Рисование следящего кружка  */
            circle.arc(xCircle, yCircle, RADIUS_CIRCLE, 0, Math.PI * 2);
            canvasGrid.context.shadowBlur = 20;
            canvasGrid.context.shadowColor = "green";
            canvasGrid.context.fillStyle = "#DAA520";
            canvasGrid.context.fill(circle, 'evenodd')
            circle.closePath();
            /* Рисование следящего кружка  */

            /* Рисование линии при наведении  */
            canvasGrid.context.beginPath();
            canvasGrid.context.shadowBlur = 0;
            canvasGrid.context.strokeStyle = "grey";
            canvasGrid.context.lineWidth = 0.7;
            for (let i = 1; i < data.length; i++) {
                const x = i * xRatio;
                if (isOver(proxy.mouse, x, data.length)) {
                    canvasGrid.context.save()
                    canvasGrid.context.moveTo(x, 0)
                    canvasGrid.context.lineTo(x, canvasGrid.view.height)
                    canvasGrid.context.restore()
                }
            }
            canvasGrid.context.stroke();
            canvasGrid.context.closePath();
            /* Рисование линии при наведении  */

            /* Рисование области под графиком  */
            canvasGrid.context.shadowBlur = 0;
            region.lineTo(canvasGrid.view.width - xRatio, canvasGrid.view.height);
            region.closePath();
            canvasGrid.context.fillStyle = 'rgba(218, 196, 113, 0.2)';
            canvasGrid.context.fill(region, 'evenodd')
            canvasGrid.context.closePath();
            /* Рисование области под графиком  */

            /* Рисование линий заднего фона графика */
            canvasGrid.context.beginPath();
            console.log(step);
            for (let i = 1; i <= ROWS_COUNT; i++) {
                const y = step * i;
                canvasGrid.context.moveTo(0, y);
                canvasGrid.context.lineTo(canvasGrid.view.width, y);
            }
            canvasGrid.context.lineWidth = 1;
            canvasGrid.context.lineDashOffset = 4;
            canvasGrid.context.setLineDash([4, 3]);
            canvasGrid.context.strokeStyle = "#A7A7A7";
            canvasGrid.context.stroke();
            canvasGrid.context.closePath();
            /* Рисование линий заднего фона графика */
        }

        function isOver(mouse, x, length) {

            if (!mouse) return false;
            const width = canvasGrid.view.width / length;
            console.log([mouse.x, x])
            return Math.abs(x - mouse.x) < (width / 2);
        }
        canvasGrid.view.addEventListener('mousemove', mousemove)
        canvasGrid.view.addEventListener('mouseleave', mouseleave)

        function mousemove({ clientX }) {
            const { left } = canvasGrid.view.getBoundingClientRect();
            proxy.mouse = {
                x: (clientX - left) * 2,
            }
        }

        function mouseleave() {
            proxy.mouse = {}
        }
        return {
            update() {
                paint();
            },
            init() {

                paint();
            },
            destroy() {
                cancelAnimationFrame(raf);
                canvasGrid.view.removeEventListener('mousemove', mousemove);
            }
        }
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


    start_animate(8000);
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
                /* динамическое добавление данных в график */
                data.push([getRandomBetween(0, 100), getRandomBetween(0, 100)]);

                chartObj.update();
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
}
if (document.querySelector('[data-submenubtn]') != null) {

    const submenubtn = document.querySelector('[data-submenubtn]');
    let submenuParams = {};

    if (document.querySelector('[data-submenu]') != null) {
        const submenu = document.querySelector('[data-submenu]');
        const { height } = submenu.getBoundingClientRect();
        submenuParams = {
            el: submenu,
            h: height
        }
        if (window.innerWidth <= 767)
            submenuParams.el.style.height = '0px';
        else
            submenuParams.el.style.height = submenuParams.height;
        window.onresize = () => {
            if (window.innerWidth <= 767)
                submenuParams.el.style.height = '0px';
            else
                submenuParams.el.style.height = `${submenuParams.h}px`;
        }


    }
    submenubtn.addEventListener('click', (event) => {
        event.preventDefault();
        document.documentElement.classList.toggle('submenu-open');
        if (document.documentElement.classList.contains('submenu-open') && submenuParams.el != '') submenuParams.el.style.height = `${submenuParams.h}px`;
        else submenuParams.el.style.height = '0px';
    });
}
if (document.querySelector('.inner-rates') != null) {
    const buttons = document.querySelectorAll('.inner-rates .inner-item__button');
    const baseValute = "KZT";
    let valute = "USD";
    const date = new Date();
    const month = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'нояб', 'дек'];
    const response = fetch(`https://api.fastforex.io/fetch-one?from=${valute}&to=${baseValute}&api_key=240c18310d-0a514f6b0a-r9nl1f`);
    response.then((response) => {
        return response.json();
    })
        .then((data) => {
            if (data.error == null) {
                document.querySelector('.currency-item__value span').innerHTML = valute;
                document.querySelector('._get-value').innerHTML = `${data.result[baseValute]}<span>${baseValute}</span>`;
                const date = new String(data.updated).split(' ');
                document.querySelector('.lastupdate__value').innerHTML = `${date[0].split('-')[2]} ${month[parseInt(date[0].split('-')[1]) - 1]}., ${date[1].split(':')[0]}:${date[1].split(':')[1]} UTC`;
            }
            else alert(data.error)
        }).catch((error) => {
            alert(error)
        });
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!e.target.classList.contains('active')) {
                document.querySelector('.inner-rates .inner-item__button.active').classList.remove('active');
                e.target.classList.add('active');
                valute = e.target.querySelector('span').innerHTML;
                const response = fetch(`https://api.fastforex.io/fetch-one?from=${valute}&to=${baseValute}&api_key=240c18310d-0a514f6b0a-r9nl1f`);
                response.then((response) => {
                    return response.json();
                })
                    .then((data) => {
                        if (data.error == null) {
                            document.querySelector('.currency-item__value span').innerHTML = valute;
                            document.querySelector('._get-value').innerHTML = `${data.result[baseValute]}<span>${baseValute}</span>`;
                            const date = new String(data.updated).split(' ');
                            document.querySelector('.lastupdate__value').innerHTML = `${date[0].split('-')[2]} ${month[parseInt(date[0].split('-')[1]) - 1]}., ${date[1].split(':')[0]}:${date[1].split(':')[1]} UTC`;
                        }
                        else alert(data.error)

                    }).catch((error) => {
                        alert(error)
                    });
            }
        })
    });

}
if (document.querySelectorAll('.inner-item__changes-value').length != 0) {
    for (const changesLabel of document.querySelectorAll('.inner-item__changes-value')) {
        const change = parseInt(changesLabel.innerHTML.replace(',', '').replace('+', ''))
        if (change < 0) changesLabel.classList.add('_graph-minus')
        else changesLabel.classList.add('_graph-plus')
    }
}
document.addEventListener('DOMContentLoaded', () => {
    reverseElements();
    cutLongText();

    const el = document.querySelectorAll('[class*="__table-box"] [class*="__table-row"]');
    const elCell = document.querySelectorAll('[class*="__table-box"] [class*="__table-row"] [class*="__table-item"]');

    if (el.length != 0 && elCell.length) paintTable(el, elCell);
});

document.addEventListener('click', (event) => {

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
    size = 240; // Количество отображаемых символов
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
            element.innerHTML = text + '...';
        }

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
function paintTable(el, elCell) {


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

