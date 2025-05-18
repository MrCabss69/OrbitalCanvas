import { Animation } from './animation.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a Elementos del DOM ---
    const canvas = document.getElementById('canvas_'); // No se usa directamente aquí, pero es bueno tener la ref.
    const toggleButton = document.getElementById('toggleAnimation');
    const resetButton = document.getElementById('resetAnimation');
    const randomizeButton = document.getElementById('randomizeConfig');
    const saveButton = document.getElementById('saveAnimation');
    // Sugerencia: Añadir un botón para grabar en el HTML si se quiere control separado
    // const recordButton = document.getElementById('recordAnimation'); // Ejemplo

    // --- Configuración de CCapture ---
    const capturer = new CCapture({
        format: 'webm',
        framerate: 60,
        verbose: false, // Poner en true para debugging de CCapture
    });
    let isRecording = false;

    // --- Función Auxiliar ---
    // getRandom no se usa en este archivo, pero es útil si se necesita en el futuro
    // function getRandom(min, max) {
    //     return Math.random() * (max - min) + min;
    // }

    // --- Valores Iniciales de los Controles ---
    // Leer los valores iniciales directamente de los atributos 'value' de los inputs
    // o definir un objeto de configuración por defecto para la UI aquí.
    const controlSettings = [
        { id: 'numPointsControl', property: 'numPoints', type: 'integer' },
        { id: 'speedControl', property: 'speed', type: 'float', transform: v => v / 10 }, // Ejemplo: si el slider es 1-100 y queremos 0.1-10
        { id: 'sizeControl', property: 'size', type: 'float' },
        { id: 'lineWidthControl', property: 'lineWidth', type: 'float' },
        { id: 'planeAngleControl', property: 'planeAngle', type: 'float', transform: v => parseFloat(v) * (Math.PI / 180) * 0.1 }, // Convertir grados a una fracción de radianes
        { id: 'colorControl', property: 'color', type: 'string' },
        { id: 'circleIntervalControl', property: 'circleInterval', type: 'float' },
        { id: 'changeFrequencyControl', property: 'changeFrequency', type: 'integer' },
        // Añadir aquí más controles si los tienes (ej: initialRadius si es controlable)
    ];

    const initialConfigForAnimation = {};
    controlSettings.forEach(setting => {
        const control = document.getElementById(setting.id);
        if (control) {
            let value = control.value;
            if (setting.type === 'integer') value = parseInt(value, 10);
            else if (setting.type === 'float') value = parseFloat(value);
            // 'string' no necesita conversión
            
            initialConfigForAnimation[setting.property] = setting.transform ? setting.transform(value) : value;
        } else {
            // Usar un valor por defecto de Animation si el control no existe,
            // o definir uno aquí.
            if (Animation.defaultConfig.hasOwnProperty(setting.property)) {
                 initialConfigForAnimation[setting.property] = Animation.defaultConfig[setting.property];
            }
        }
    });
    // Añadir propiedades que no vienen de controles pero son parte de la config inicial
    if (!initialConfigForAnimation.hasOwnProperty('initialRadius')) {
        initialConfigForAnimation.initialRadius = Animation.defaultConfig.initialRadius;
    }


    // --- Instancia de la Animación ---
    const animation = new Animation("canvas_", initialConfigForAnimation);

    // --- Funciones de Ayuda para Controles ---
    function updateAnimationConfig(property, value) {
        animation.updateConfig(property, value);
        const valueSpan = document.getElementById(`${property}Value`);
        if (valueSpan) {
            // Para el color, el valor ya es el string. Para otros, formatear si es necesario.
            valueSpan.textContent = (typeof value === 'number' && !Number.isInteger(value)) ? value.toFixed(1) : value;
        }
    }

    function setupControlListener(controlId, property, valueType = 'float', transformFn = null) {
        const control = document.getElementById(controlId);
        if (!control) {
            console.warn(`Control with ID "${controlId}" not found.`);
            return;
        }

        // Actualizar el span con el valor inicial
        const initialValueSpan = document.getElementById(`${property}Value`);
        if (initialValueSpan) {
            let initialDisplayValue = control.value;
             if (valueType === 'float' && transformFn) initialDisplayValue = parseFloat(control.value); // Mostrar valor original del slider si hay transform
             else if (valueType === 'float') initialDisplayValue = parseFloat(control.value).toFixed(1);
             else if (valueType === 'integer') initialDisplayValue = parseInt(control.value,10);

            initialValueSpan.textContent = initialDisplayValue;
        }


        control.addEventListener('input', () => {
            let value = control.value;
            let displayValue = value; // Valor para mostrar en el span, puede ser diferente al transformado

            switch (valueType) {
                case 'integer':
                    value = parseInt(value, 10);
                    break;
                case 'float':
                    value = parseFloat(value);
                    displayValue = value.toFixed(1);
                    break;
                case 'string': // Para el color, etc.
                default:
                    // value ya es string
                    break;
            }
            
            const finalValue = transformFn ? transformFn(value) : value;
            updateAnimationConfig(property, finalValue);

            // Actualizar el span después de la transformación si es necesario, o con el valor original del slider
            const valueSpan = document.getElementById(`${property}Value`);
            if (valueSpan) {
                 valueSpan.textContent = displayValue; // Muestra el valor del slider
            }
        });
    }

    // --- Configuración de Listeners para Controles ---
    controlSettings.forEach(setting => {
        setupControlListener(setting.id, setting.property, setting.type, setting.transform);
    });


    // --- Listeners de Botones de Acción ---
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            if (animation.isRunning) {
                animation.stop();
                toggleButton.textContent = 'Iniciar Animación';
            } else {
                animation.start();
                toggleButton.textContent = 'Parar Animación';
            }
        });
    }

    // Lógica de grabación (ejemplo con el mismo toggleButton, pero mejor separado)
    // Si decides usar el mismo botón de Play/Pause para grabar:
    /*
    toggleButton.addEventListener('click', () => {
        if (animation.isRunning) { // Al parar animación
            animation.stop();
            toggleButton.textContent = 'Iniciar Animación';
            if (isRecording) {
                capturer.stop();
                console.log('Recording stopped.');
                // No guardar automáticamente, dejarlo para el botón 'Guardar'
                // capturer.save();
                // isRecording = false; // Se podría resetear aquí o dejar para save/cancel
            }
        } else { // Al iniciar animación
            animation.start();
            toggleButton.textContent = 'Parar Animación';
            // Decidir si se quiere iniciar grabación automáticamente o con otro botón
            // if (!isRecording && confirm("¿Iniciar grabación?")) {
            //     capturer.start();
            //     isRecording = true;
            //     console.log('Recording started...');
            // }
        }
    });
    */

    // Lógica de grabación más explícita con botones dedicados (recomendado)
    // HTML: <button id="recordButton">Iniciar Grabación</button>
    const recordBtn = document.getElementById('recordButton'); // Asume que tienes este botón
    if (recordBtn) {
        recordBtn.addEventListener('click', () => {
            if (!isRecording) {
                if (!animation.isRunning) {
                    animation.start(); // Iniciar animación si no está corriendo
                    toggleButton.textContent = 'Parar Animación';
                }
                capturer.start();
                isRecording = true;
                recordBtn.textContent = 'Detener Grabación';
                console.log('Recording started...');
            } else {
                capturer.stop();
                isRecording = false;
                recordBtn.textContent = 'Iniciar Grabación';
                console.log('Recording stopped. Pulsa "Guardar Vídeo" para descargar.');
                // animation.stop(); // Opcional: parar animación al detener grabación
                // toggleButton.textContent = 'Iniciar Animación';
            }
        });
    }


    if (saveButton) {
        saveButton.addEventListener('click', () => {
            if (isRecording) {
                alert("Primero detén la grabación antes de guardar.");
                return;
            }
            console.log("Attempting to save video...");
            capturer.save();
            // Después de guardar, CCapture resetea su estado interno y no se puede llamar a save() de nuevo
            // para el mismo conjunto de frames. Si se quiere grabar de nuevo, se debe llamar a capturer.start()
        });
    }


    if (resetButton) {
        resetButton.addEventListener('click', () => {
            controlSettings.forEach(setting => {
                const control = document.getElementById(setting.id);
                if (control) {
                    // Resetear el valor del control al valor que tenía en el HTML originalmente (atributo value)
                    // o a un valor por defecto definido.
                    const defaultValue = control.defaultValue || (setting.type === 'color' ? '#ff0000' : (Animation.defaultConfig[setting.property] || control.min || 0));
                    control.value = defaultValue;

                    // Disparar el evento 'input' para que se actualice la animación y el span
                    control.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
            animation.restart();
            if (toggleButton && !animation.isRunning) { // Asegurar que el texto del botón sea correcto
                 toggleButton.textContent = 'Iniciar Animación';
            }
        });
    }

    if (randomizeButton) {
        randomizeButton.addEventListener('click', () => {
            controlSettings.forEach(setting => {
                const control = document.getElementById(setting.id);
                if (control) {
                    let randomValue;
                    if (setting.property === 'color') {
                        randomValue = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
                    } else {
                        const min = parseFloat(control.min) || 0;
                        const max = parseFloat(control.max) || (setting.property === 'numPoints' ? 100 : 10); // Max por defecto
                        
                        if (setting.type === 'integer') {
                            randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
                        } else { // float
                            randomValue = (Math.random() * (max - min)) + min;
                        }
                    }
                    control.value = (setting.type === 'float' && setting.property !== 'planeAngle') ? randomValue.toFixed(1) : randomValue;
                    control.dispatchEvent(new Event('input', { bubbles: true }));
                }
            });
             if (toggleButton && !animation.isRunning) {
                 toggleButton.textContent = 'Iniciar Animación';
             }
             // animation.restart(); // Opcional: reiniciar la animación con la nueva config aleatoria
        });
    }


});