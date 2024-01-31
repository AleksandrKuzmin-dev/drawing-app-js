document.addEventListener('DOMContentLoaded', () => {
    const singleOptionsElems = document.querySelectorAll('.toolbar__option'),
          fillElem = document.querySelector('#toolbar__fill-color'),
          sizeElem = document.querySelector('.toolbar__brush-size'),
          colorElems = document.querySelectorAll('.toolbar__option-color'),
          allColorsElem = document.querySelector('[data-color]'),
          canvasElem = document.querySelector('.drawing-board__canvas');
          const canvasCoord = canvasElem.getBoundingClientRect();
          const ctx = canvasElem.getContext("2d", { willReadFrequently: true });
          
    const settings = {
        shapes: '',
        fill: false,
        type: 'brush',
        size: '10',
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
                    settings.type = '';
                    settings.shapes = elem.getAttribute('data-shapes');
                } else {
                    settings.shapes = '';
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

    };

   addEventChangeSettings();


    /* 1. При передвижении мыши записываются координаты
       2. При клике в отдельные переменные записываются x и y
       3. Делается скриншот канваса
       4. запускается функция рисования в зависимости от настроек
       4. При отжатии мыши функция рисования прекращается
    */

    function drawingStart(){
        settings.prevX = settings.x;
        settings.prevY = settings.y;
        settings.canvasCopy = ctx.getImageData(0,0, canvasElem.width, canvasElem.height);
        ctx.lineWidth = settings.size;
        ctx.strokeStyle = settings.type == 'brush' ? settings.color : 'rgb(255,255,255)';
        console.log(ctx.strokeStyle)
        settings.isDrawing = true;
        ctx.moveTo(settings.x, settings.y);
        ctx.beginPath();
        
    }
    function drawing() {
        ctx.putImageData(settings.canvasCopy, 0, 0);
        ctx.lineTo(settings.x, settings.y);
        ctx.stroke();
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
            
                default:
                    break;
            }
        };

    });

    canvasElem.addEventListener('mouseup', () => settings.isDrawing = false);


    /*  let draw = false;
    const ctx = canvasElem.getContext("2d", { willReadFrequently: true })
    let prevX;
    let prevY;
    let snapshot;

    canvasElem.addEventListener('mousedown', () => {
        draw=true;
        snapshot = ctx.getImageData(0, 0, canvasElem.width, canvasElem.height);
        
        prevX = settings.x;
        prevY = settings.y;
    });

    canvasElem.addEventListener('mousemove', (e) => {
        settings.x = e.clientX - canvasCoord.x;
        settings.y = e.clientY - canvasCoord.y;


        if(draw == true) {
            
            ctx.putImageData(snapshot, 0, 0);
            ctx.beginPath();
            ctx.rect(prevX, prevY, settings.x - prevX, settings.y - prevY);
            ctx.fill();
            ctx.stroke();
        }
    })

    canvasElem.addEventListener('mouseup', () => draw = false) */
   

})