/**
 * GrowthCheck - Calculadora de Potencial de Crecimiento
 * 
 * Fórmula de Tanner (Mid-Parental Height):
 * - Niños: (altura_padre + altura_madre + 13) / 2 ± 8.5 cm
 * - Niñas: (altura_padre + altura_madre - 13) / 2 ± 8.5 cm
 */

(function () {
    'use strict';

    // Elementos del DOM
    const form = document.getElementById('calculator-form');
    const resultContainer = document.getElementById('result-container');
    const rangeMin = document.getElementById('range-min');
    const rangeMax = document.getElementById('range-max');
    const resultExplanation = document.getElementById('result-explanation');
    const summaryCurrent = document.getElementById('summary-current');
    const summaryFather = document.getElementById('summary-father');
    const summaryMother = document.getElementById('summary-mother');
    const progressBar = document.getElementById('progress-bar');
    const geneticText = document.getElementById('genetic-text');
    const ageText = document.getElementById('age-text');
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    // Constantes
    const MARGIN_OF_ERROR = 8.5;
    const GENDER_ADJUSTMENT = 13;

    /**
     * Calcula el potencial de estatura
     */
    function calculateMidParentalHeight(fatherHeight, motherHeight, gender) {
        let midpoint;

        if (gender === 'masculino') {
            midpoint = (fatherHeight + motherHeight + GENDER_ADJUSTMENT) / 2;
        } else {
            midpoint = (fatherHeight + motherHeight - GENDER_ADJUSTMENT) / 2;
        }

        return {
            min: Math.round(midpoint - MARGIN_OF_ERROR),
            max: Math.round(midpoint + MARGIN_OF_ERROR),
            midpoint: Math.round(midpoint)
        };
    }

    /**
     * Calcula el progreso hacia el rango estimado
     */
    function calculateProgress(currentHeight, min, max) {
        if (currentHeight >= max) return 100;
        if (currentHeight <= min - 30) return 10;

        // Calculamos el progreso como porcentaje del punto medio del rango
        const midpoint = (min + max) / 2;
        const progress = (currentHeight / midpoint) * 100;

        return Math.min(Math.max(progress, 10), 100);
    }

    /**
     * Genera la explicación personalizada
     */
    function generateExplanation(data, result) {
        const { age, gender, currentHeight, fatherHeight, motherHeight } = data;
        const { min, max, midpoint } = result;

        let html = '';

        // Explicación principal
        html += `<p>Basándonos en la estatura de tus padres, tu estatura adulta probablemente estará entre <strong>${min} cm</strong> y <strong>${max} cm</strong>.</p>`;

        // Contexto sobre la estatura actual
        if (currentHeight < min) {
            const diff = min - currentHeight;
            html += `<p>Ahora mides ${currentHeight} cm. Si sigues el patrón esperado, podrías crecer entre ${diff} y ${max - currentHeight} cm más.</p>`;
        } else if (currentHeight >= min && currentHeight <= max) {
            html += `<p>Tu estatura actual de ${currentHeight} cm ya está dentro del rango estimado. Esto es una buena señal de que tu crecimiento va por buen camino.</p>`;
        } else {
            html += `<p>Ya mides ${currentHeight} cm, que está por encima del rango estimado. Cada persona es diferente, y esto es completamente normal.</p>`;
        }

        return html;
    }

    /**
     * Genera el texto del indicador genético
     */
    function generateGeneticText(fatherHeight, motherHeight, gender) {
        const avgParents = (fatherHeight + motherHeight) / 2;
        let text = '';

        if (avgParents >= 175) {
            text = 'El promedio de tus padres es alto, lo que influye positivamente en tu potencial.';
        } else if (avgParents >= 165) {
            text = 'La estatura de tus padres está en un rango promedio.';
        } else {
            text = 'La estatura de tus padres es un factor, pero no el único que influye.';
        }

        return text;
    }

    /**
     * Genera el texto del indicador de edad
     */
    function generateAgeText(age, gender) {
        let text = '';

        if (gender === 'masculino') {
            if (age < 12) {
                text = 'A tu edad, el estirón principal todavía no ha comenzado. Suele ocurrir entre los 12 y 16 años.';
            } else if (age >= 12 && age <= 16) {
                text = 'Estás en la etapa donde más se crece. El estirón suele durar 2-3 años.';
            } else {
                text = 'A los ' + age + ' años, el crecimiento generalmente está terminando o ya terminó.';
            }
        } else {
            if (age < 10) {
                text = 'A tu edad, el estirón principal todavía no ha comenzado. Suele ocurrir entre los 10 y 14 años.';
            } else if (age >= 10 && age <= 14) {
                text = 'Estás en la etapa donde más se crece. El estirón suele durar 2-3 años.';
            } else {
                text = 'A los ' + age + ' años, el crecimiento generalmente está terminando o ya terminó.';
            }
        }

        return text;
    }

    /**
     * Valida los datos del formulario
     */
    function validateFormData(formData) {
        const age = parseInt(formData.get('edad'), 10);
        const gender = formData.get('sexo');
        const currentHeight = parseFloat(formData.get('estatura-actual'));
        const fatherHeight = parseFloat(formData.get('estatura-padre'));
        const motherHeight = parseFloat(formData.get('estatura-madre'));

        if (isNaN(age) || age < 8 || age > 20) {
            alert('Ingresa una edad entre 8 y 20 años.');
            return null;
        }

        if (!gender) {
            alert('Selecciona tu sexo biológico.');
            return null;
        }

        if (isNaN(currentHeight) || currentHeight < 100 || currentHeight > 220) {
            alert('Ingresa una estatura válida (entre 100 y 220 cm).');
            return null;
        }

        if (isNaN(fatherHeight) || fatherHeight < 140 || fatherHeight > 220) {
            alert('Ingresa la estatura de tu papá (entre 140 y 220 cm).');
            return null;
        }

        if (isNaN(motherHeight) || motherHeight < 140 || motherHeight > 200) {
            alert('Ingresa la estatura de tu mamá (entre 140 y 200 cm).');
            return null;
        }

        return { age, gender, currentHeight, fatherHeight, motherHeight };
    }

    /**
     * Muestra los resultados
     */
    function displayResults(data, result) {
        const { currentHeight, fatherHeight, motherHeight, age, gender } = data;
        const { min, max } = result;

        // Valores principales
        rangeMin.textContent = min;
        rangeMax.textContent = max;

        // Resumen
        summaryCurrent.textContent = currentHeight + ' cm';
        summaryFather.textContent = fatherHeight + ' cm';
        summaryMother.textContent = motherHeight + ' cm';

        // Explicación
        resultExplanation.innerHTML = generateExplanation(data, result);

        // Barra de progreso
        const progress = calculateProgress(currentHeight, min, max);
        setTimeout(() => {
            progressBar.style.width = progress + '%';
        }, 100);

        // Indicadores
        geneticText.textContent = generateGeneticText(fatherHeight, motherHeight, gender);
        ageText.textContent = generateAgeText(age, gender);

        // Mostrar
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Maneja el envío del formulario
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = validateFormData(formData);

        if (!data) return;

        const result = calculateMidParentalHeight(
            data.fatherHeight,
            data.motherHeight,
            data.gender
        );

        displayResults(data, result);
    }

    /**
     * Menú móvil
     */
    function handleNavToggle() {
        navList.classList.toggle('active');
    }

    function handleNavLinkClick(event) {
        if (event.target.tagName === 'A') {
            navList.classList.remove('active');
        }
    }

    /**
     * Inicialización
     */
    function init() {
        if (form) {
            form.addEventListener('submit', handleFormSubmit);
        }

        if (navToggle) {
            navToggle.addEventListener('click', handleNavToggle);
        }

        if (navList) {
            navList.addEventListener('click', handleNavLinkClick);
        }

        window.addEventListener('scroll', function () {
            if (navList && navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
