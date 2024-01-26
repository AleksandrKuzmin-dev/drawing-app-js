document.addEventListener('DOMContentLoaded', () => {
    const singleOptionsElems = document.querySelectorAll('.toolbar__option'),
          fillElem = document.querySelector('#toolbar__fill-color'),
          sizeElem = document.querySelector('.toolbar__brush-size'),
          colorElems = document.querySelectorAll('.toolbar__option-color'),
          allColorsElem = document.querySelector('[data-color]')
          
    const settings = {
        shapes: '',
        fill: false,
        type: 'brush',
        size: '10',
        color: '#000'
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
        })

    };

   addEventChangeSettings();
});