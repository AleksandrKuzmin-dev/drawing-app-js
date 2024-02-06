document.addEventListener('DOMContentLoaded', () => {
    const singleOptionsElems = document.querySelectorAll('.toolbar__option'),
          fillElem = document.querySelector('#toolbar__fill-color'),
          sizeElem = document.querySelector('.toolbar__brush-size'),
          colorElems = document.querySelectorAll('.toolbar__option-color'),
          allColorsElem = document.querySelector('[data-color]'),
          canvasElem = document.querySelector('.drawing-board__canvas'),
          clearElem = document.querySelector('.toolbar__clear-btn'),
          saveElem = document.querySelector('.toolbar__save-img'),
          canvasCoord = canvasElem.getBoundingClientRect(),
          ctx = canvasElem.getContext("2d", { willReadFrequently: true });

    let canvasCopy;
          
    let settings = {
        fill: false,
        type: 'brush',
        size: '1',
        color: '#000',
        x: '0',
        y: '0',
        prevX: '0',
        prevY: '0',
        isDrawing: false
    };

    function start() {
        canvasElem.addEventListener('mousedown', () => {
            drawingStart();
        });

        clearElem.addEventListener('click', () => {
            ctx.clearRect(0,0, canvasElem.width, canvasElem.height);
        });

        saveElem.addEventListener('click', () => {
            saveImage();
        });
    
        canvasElem.addEventListener('mousemove', (e) => {
            settings.x = e.clientX - canvasCoord.x;
            settings.y = e.clientY - canvasCoord.y;
            if(settings.isDrawing){
                switch (settings.type) {
                    case 'brush':
                    case 'eraser':
                        drawing();
                        break;
                
                    case 'rectangle':
                        drawRectangle();
                        break;
    
                    case 'circle':
                        drawCircle();
                        break;
    
                    case 'triangle':
                        drawTriangle();
                        break;
    
                    default:
                        break;
                }
            };
    
        });
    
        canvasElem.addEventListener('mouseup', () => settings.isDrawing = false);
        addEventChangeSettings();
        setSaveSettings();
    };

    function setSaveSettings() {
        if (localStorage.getItem('settings')){
            const saveSettings = JSON.parse(localStorage.getItem('settings'));

            /* Настройки типа инструмента */
            if (saveSettings.type == 'rectangle' || saveSettings.type == 'circle' || saveSettings.type == 'triangle') {
                const element = document.querySelector(`[data-shapes="${saveSettings.type}"]`);
                changeActiveClass(singleOptionsElems, element, 'active');
            } else {
                const element = document.querySelector(`[data-type="${saveSettings.type}"]`);
                changeActiveClass(singleOptionsElems, element, 'active');
            }

            settings.type = saveSettings.type;

            /* Настройки размера кисти/бордера */
            sizeElem.value = saveSettings.size;
            settings.size = saveSettings.size;

            /* Настройки заливки */
            fillElem.checked = saveSettings.fill;
            settings.fill = saveSettings.fill;

            /* Настройки цвета */
            allColorsElem.value = saveSettings.color.includes('#') ?  saveSettings.color : rgbToHex(saveSettings.color);
            settings.color = saveSettings.color;
            allColorsElem.parentElement.style.backgroundColor = saveSettings.color;
            changeActiveClass(colorElems, allColorsElem.parentElement, 'selected');
        };
    };

    function rgbToHex(rgbCode) {
        const rgbValue = rgbCode.match(/\d+/g);

        let r = parseInt(rgbValue[0]).toString(16),
            g = parseInt(rgbValue[1]).toString(16),
            b = parseInt(rgbValue[2]).toString(16);

        if (r.length == 1) r = "0" + r;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;

        return '#' + r + g + b;
    };

    function changeActiveClass (elements, newActiveElement, activeClass) {
        elements.forEach(item => {
            item.classList.remove(activeClass);
            newActiveElement.classList.add(activeClass);
        });
    };
    
    function addEventChangeSettings(){
        singleOptionsElems.forEach((elem, index) => {
            elem.addEventListener('click', (event) => {
                changeActiveClass(singleOptionsElems, singleOptionsElems[index], 'active');
                
                if (elem.hasAttribute('data-shapes')){
                    settings.type = elem.getAttribute('data-shapes');
                } else {
                    fillElem.checked = false;
                    settings.fill = false;
                    settings.type = elem.getAttribute('data-type');
                };

                localStorage.setItem('settings', JSON.stringify(settings));
            });
        });

        fillElem.addEventListener('change', () => {
            settings.fill = fillElem.checked;
            localStorage.setItem('settings', JSON.stringify(settings));
        });

        sizeElem.addEventListener('change', () => {
            settings.size = sizeElem.value;
            localStorage.setItem('settings', JSON.stringify(settings));
        });

        colorElems.forEach(item => {
            item.addEventListener('click', () => {
                changeActiveClass(colorElems, item, 'selected');
                settings.color = window.getComputedStyle(item).backgroundColor;
                localStorage.setItem('settings', JSON.stringify(settings));
            });
        });

        allColorsElem.addEventListener('input', () => {
            allColorsElem.parentElement.style.backgroundColor = allColorsElem.value;
            settings.color = allColorsElem.value;
            localStorage.setItem('settings', JSON.stringify(settings));
        });
    };

    function drawingStart(){
        settings.prevX = settings.x;
        settings.prevY = settings.y;
        canvasCopy = ctx.getImageData(0,0, canvasElem.width, canvasElem.height);
        ctx.lineWidth = settings.size;
        ctx.strokeStyle = settings.type == 'eraser' ? 'rgb(255,255,255)' : settings.color;
        ctx.fillStyle = settings.color;
        settings.isDrawing = true;
        ctx.moveTo(settings.x, settings.y);
        ctx.beginPath();
    };
    
    function drawing() {
        ctx.putImageData(canvasCopy, 0, 0);
        ctx.lineTo(settings.x, settings.y);
        ctx.stroke();
    };

    function drawRectangle() {
        ctx.putImageData(canvasCopy, 0, 0);
        ctx.beginPath();
        ctx.rect(settings.prevX, settings.prevY, settings.x - settings.prevX, settings.y - settings.prevY)
        ctx.stroke();
        ctx.closePath();

        if(settings.fill) ctx.fill();
    };

    function drawCircle(){
        const radius = Math.sqrt(Math.pow(settings.prevX - settings.x, 2)) + Math.sqrt(Math.pow(settings.prevY - settings.y, 2));

        ctx.putImageData(canvasCopy, 0, 0);
        ctx.beginPath();
        ctx.arc(settings.prevX, settings.prevY, radius,50,0,2*Math.PI);
        ctx.stroke();
        ctx.closePath();

        if(settings.fill) ctx.fill();
    };

    function drawTriangle() {
        ctx.putImageData(canvasCopy, 0, 0);
        ctx.beginPath();
        ctx.moveTo(settings.prevX, settings.prevY)
        ctx.lineTo(settings.x, settings.y);
        ctx.lineTo(settings.prevX - (settings.x - settings.prevX), settings.y);
        ctx.closePath();
        ctx.stroke();
    
        if(settings.fill) ctx.fill();
    };

    function saveImage(){
        const link = document.createElement('a');

        link.setAttribute("href", canvasElem.toDataURL());
        link.setAttribute("download", `Рисунок ${Date.now(new Date())}`);
        link.click();
    };

    start();

});