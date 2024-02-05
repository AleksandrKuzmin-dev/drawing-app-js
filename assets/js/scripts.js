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
          
    const settings = {
        shapes: '',
        fill: false,
        type: 'brush',
        size: '1',
        color: '#000',
        x: '',
        y: '',
        prevX: '',
        prevY: '',
        copyCanvas: '',
        isDrawing: false,
        canvasCopy: ""
    };

    function changeActiveClass (elements, newActiveElement, activeClass) {
        elements.forEach(item => {
            item.classList.remove(activeClass);
            newActiveElement.classList.add(activeClass);
        });
    };

    /* Добавляем события для изменений настроек рисования */
    function addEventChangeSettings(){

        /* Тип инструмента */
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
            });
        });

        /* Заливка цветом */
        fillElem.addEventListener('change', () => settings.fill = fillElem.checked);

        /* Размер элемента */

        sizeElem.addEventListener('change', () => {
            settings.size = sizeElem.value;
        });

        /* цвет */
        colorElems.forEach(item => {
            item.addEventListener('click', () => {
                changeActiveClass(colorElems, item, 'selected');
                settings.color = window.getComputedStyle(item).backgroundColor;
            });
        });

        allColorsElem.addEventListener('input', () => {
            allColorsElem.parentElement.style.backgroundColor = allColorsElem.value;
            settings.color = allColorsElem.value;
        });

        clearElem.addEventListener('click', () => {
            ctx.clearRect(0,0, canvasElem.width, canvasElem.height);
        });

        saveElem.addEventListener('click', () => {
            saveImage();
        });

    };

    function drawingStart(){
        settings.prevX = settings.x;
        settings.prevY = settings.y;
        settings.canvasCopy = ctx.getImageData(0,0, canvasElem.width, canvasElem.height);
        ctx.lineWidth = settings.size;
        ctx.strokeStyle = settings.type == 'eraser' ? 'rgb(255,255,255)' : settings.color;
        ctx.fillStyle = settings.color;
        settings.isDrawing = true;
        ctx.moveTo(settings.x, settings.y);
        ctx.beginPath();
        
    };
    
    function drawing() {
        ctx.putImageData(settings.canvasCopy, 0, 0);
        ctx.lineTo(settings.x, settings.y);
        ctx.stroke();
    };

    function rectangle() {
        ctx.putImageData(settings.canvasCopy, 0, 0);
        ctx.beginPath();
        ctx.rect(settings.prevX, settings.prevY, settings.x - settings.prevX, settings.y - settings.prevY)
        ctx.stroke();
        ctx.closePath();

        if(settings.fill) ctx.fill();
    };

    function circle(){
        const radius = Math.sqrt(Math.pow(settings.prevX - settings.x, 2)) + Math.sqrt(Math.pow(settings.prevY - settings.y, 2));

        ctx.putImageData(settings.canvasCopy, 0, 0);
        ctx.beginPath();
        ctx.arc(settings.prevX, settings.prevY, radius,50,0,2*Math.PI);
        ctx.stroke();
        ctx.closePath();

        if(settings.fill) ctx.fill();
    };

    function triangle() {
        ctx.putImageData(settings.canvasCopy, 0, 0);
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

    canvasElem.addEventListener('mousedown', () => {
        drawingStart();
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
                    rectangle();
                    break;

                case 'circle':
                    circle();
                    break;

                case 'triangle':
                    triangle();
                    break;

                default:
                    break;
            }
        };

    });

    canvasElem.addEventListener('mouseup', () => settings.isDrawing = false);
    addEventChangeSettings();

});