import { Animation } from './animation.js';

document.addEventListener('DOMContentLoaded', () => {
    
    const canvas = document.getElementById('canvas_');
    const numPointsControl = document.getElementById('numPointsControl');
    const numPointsValue = document.getElementById('numPointsValue');
    const speedControl = document.getElementById('speedControl');
    const speedValue = document.getElementById('speedValue');
    const sizeControl = document.getElementById('sizeControl');
    const sizeValue = document.getElementById('sizeValue');
    const lineWidthControl = document.getElementById('lineWidthControl');
    const lineWidthValue = document.getElementById('lineWidthValue');
    const planeAngleControl = document.getElementById('planeAngleControl');
    const planeAngleValue = document.getElementById('planeAngleValue');
    const colorControl = document.getElementById('colorControl');
    const toggleButton = document.getElementById('toggleAnimation');
    const resetButton = document.getElementById('resetAnimation');
    

    const config = {
        numPoints: parseInt(numPointsControl.value, 10),
        initialRadius: 380,
        initialColor: colorControl.value,
        circleInterval: 2, // segundos entre la creación de nuevos círculos
        changeFrequency: 3000 // milisegundos para cambios en las propiedades de las líneas
    };

    const animation = new Animation("canvas_", config);

    numPointsControl.addEventListener('input', () => {
        const numPoints = parseInt(numPointsControl.value, 10);
        numPointsValue.textContent = numPoints;
        animation.updateConfig('numPoints', numPoints);
    });

    speedControl.addEventListener('input', () => {
        const speed = parseFloat(speedControl.value);
        speedValue.textContent = speed;
        animation.updateConfig('speed', speed);
    });

    sizeControl.addEventListener('input', () => {
        const size = parseFloat(sizeControl.value);
        sizeValue.textContent = size;
        animation.updateConfig('size', size);
    });

    lineWidthControl.addEventListener('input', () => {
        const lineWidth = parseFloat(lineWidthControl.value);
        lineWidthValue.textContent = lineWidth;
        animation.updateConfig('lineWidth', lineWidth);
    });

    planeAngleControl.addEventListener('input', () => {
        const planeAngle = parseInt(planeAngleControl.value, 10);
        planeAngleValue.textContent = planeAngle;
        animation.updateConfig('planeAngle', planeAngle);
    });

    colorControl.addEventListener('input', () => {
        const color = colorControl.value;
        animation.updateConfig('color', color);
    });

    toggleButton.addEventListener('click', () => {
        if (animation.isRunning) {
            animation.stop();
            toggleButton.textContent = 'Iniciar Animación';
        } else {
            animation.start();
            toggleButton.textContent = 'Parar Animación';
        }
    });

    resetButton.addEventListener('click', () => {
        // Actualiza configuración antes de reiniciar
        animation.updateConfig('numPoints', parseInt(numPointsControl.value, 10));
        animation.updateConfig('initialColor', colorControl.value);
        animation.restart();
    });

    document.getElementById('randomizeConfig').addEventListener('click', () => {
        // Generar configuraciones aleatorias
        const randomNumPoints = Math.floor(Math.random() * (100 - 3 + 1)) + 3;
        const randomSpeed = Math.random() * (20 - 1) + 1;
        const randomSize = Math.random() * (20 - 1) + 1;
        const randomLineWidth = Math.random() * (10 - 0.5) + 0.5;
        const randomPlaneAngle = Math.floor(Math.random() * 361); // 0 a 360
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    
        // Actualizar los valores de los controles
        numPointsControl.value = randomNumPoints;
        numPointsValue.textContent = randomNumPoints;
        speedControl.value = randomSpeed;
        speedValue.textContent = randomSpeed.toFixed(1);
        sizeControl.value = randomSize;
        sizeValue.textContent = randomSize.toFixed(1);
        lineWidthControl.value = randomLineWidth;
        lineWidthValue.textContent = randomLineWidth.toFixed(1);
        planeAngleControl.value = randomPlaneAngle;
        planeAngleValue.textContent = randomPlaneAngle;
        colorControl.value = randomColor;
    
        // Aplicar cambios en la configuración de la animación
        animation.updateConfig('numPoints', randomNumPoints);
        animation.updateConfig('speed', randomSpeed);
        animation.updateConfig('size', randomSize);
        animation.updateConfig('lineWidth', randomLineWidth);
        animation.updateConfig('planeAngle', randomPlaneAngle);
        animation.updateConfig('color', randomColor);
    });
    
});

