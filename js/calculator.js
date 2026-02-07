/**
 * GrowthCheck Calculator
 * Calcula la estatura adulta estimada usando la fórmula Mid-Parental Height (Tanner)
 */

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calculator-form');
    const resultContainer = document.getElementById('result-container');

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', function () {
            navList.classList.toggle('active');
        });

        // Close menu when clicking a link
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
            });
        });
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateHeight();
        });
    }

    function calculateHeight() {
        // Get values
        const edad = parseInt(document.getElementById('edad').value);
        const sexo = document.getElementById('sexo').value;
        const estaturaActual = parseInt(document.getElementById('estatura-actual').value);
        const estaturaPadre = parseInt(document.getElementById('estatura-padre').value);
        const estaturaMadre = parseInt(document.getElementById('estatura-madre').value);

        // Validate
        if (!edad || !sexo || !estaturaActual || !estaturaPadre || !estaturaMadre) {
            alert('Por favor completa todos los campos');
            return;
        }

        // Calculate Mid-Parental Height
        let mph;
        if (sexo === 'masculino') {
            // For males: (father height + mother height + 13) / 2
            mph = (estaturaPadre + estaturaMadre + 13) / 2;
        } else {
            // For females: (father height + mother height - 13) / 2
            mph = (estaturaPadre + estaturaMadre - 13) / 2;
        }

        // Target height range (±8.5 cm is the typical standard deviation)
        const rangeMin = Math.round(mph - 8.5);
        const rangeMax = Math.round(mph + 8.5);
        const targetMid = Math.round(mph);

        // Update display
        document.getElementById('range-min').textContent = rangeMin;
        document.getElementById('range-max').textContent = rangeMax;

        // Summary values
        document.getElementById('summary-current').textContent = estaturaActual + ' cm';
        document.getElementById('summary-father').textContent = estaturaPadre + ' cm';
        document.getElementById('summary-mother').textContent = estaturaMadre + ' cm';

        // Progress toward target
        const progress = calculateProgress(estaturaActual, rangeMin, rangeMax, edad, sexo);
        document.getElementById('progress-bar').style.width = progress + '%';

        // Generate explanation
        const explanation = generateExplanation(edad, sexo, estaturaActual, targetMid, rangeMin, rangeMax);
        document.getElementById('result-explanation').innerHTML = explanation;

        // Genetic text
        const geneticText = generateGeneticText(estaturaPadre, estaturaMadre, sexo);
        document.getElementById('genetic-text').textContent = geneticText;

        // Age-related text
        const ageText = generateAgeText(edad, sexo);
        document.getElementById('age-text').textContent = ageText;

        // Show results
        resultContainer.classList.remove('hidden');

        // Scroll to results
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function calculateProgress(current, min, max, edad, sexo) {
        // Estimate how much toward adult height they've reached
        // This is a simplified estimation
        let percentOfAdultHeight;

        if (sexo === 'masculino') {
            if (edad <= 10) percentOfAdultHeight = 78;
            else if (edad === 11) percentOfAdultHeight = 81;
            else if (edad === 12) percentOfAdultHeight = 84;
            else if (edad === 13) percentOfAdultHeight = 88;
            else if (edad === 14) percentOfAdultHeight = 92;
            else if (edad === 15) percentOfAdultHeight = 95;
            else if (edad === 16) percentOfAdultHeight = 97;
            else if (edad === 17) percentOfAdultHeight = 99;
            else percentOfAdultHeight = 100;
        } else {
            if (edad <= 10) percentOfAdultHeight = 84;
            else if (edad === 11) percentOfAdultHeight = 88;
            else if (edad === 12) percentOfAdultHeight = 92;
            else if (edad === 13) percentOfAdultHeight = 95;
            else if (edad === 14) percentOfAdultHeight = 97;
            else if (edad === 15) percentOfAdultHeight = 99;
            else percentOfAdultHeight = 100;
        }

        return Math.min(100, percentOfAdultHeight);
    }

    function generateExplanation(edad, sexo, current, target, min, max) {
        let html = '';

        const diff = target - current;

        if (sexo === 'masculino') {
            if (edad < 13) {
                html += '<p><strong>Estás en una etapa temprana de crecimiento.</strong> La mayoría de los chicos experimentan su mayor estirón entre los 13 y 16 años. Todavía tienes mucho potencial de crecimiento por delante.</p>';
            } else if (edad >= 13 && edad <= 16) {
                html += '<p><strong>Estás probablemente en tu período de mayor crecimiento.</strong> Entre los 13 y 16 años es cuando muchos chicos crecen más rápido. Es normal crecer 7-10 cm por año en esta etapa.</p>';
            } else if (edad >= 17 && edad <= 18) {
                html += '<p><strong>El crecimiento está llegando a su fin, pero aún puede haber cambios.</strong> Muchos chicos continúan creciendo un poco hasta los 18-20 años, aunque más lentamente.</p>';
            } else {
                html += '<p><strong>A tu edad, el crecimiento típicamente ha terminado o está muy cerca de terminar.</strong> La mayoría de los hombres alcanzan su estatura adulta alrededor de los 18-20 años.</p>';
            }
        } else {
            if (edad < 11) {
                html += '<p><strong>Estás en una etapa temprana de tu desarrollo.</strong> Las chicas generalmente tienen su estirón de crecimiento antes que los chicos, típicamente entre los 10 y 14 años.</p>';
            } else if (edad >= 11 && edad <= 14) {
                html += '<p><strong>Probablemente estás en tu período de mayor crecimiento o cerca de él.</strong> La mayoría de las chicas experimentan su estirón entre los 10 y 14 años, muchas veces coincidiendo con otros cambios de la pubertad.</p>';
            } else if (edad >= 15 && edad <= 16) {
                html += '<p><strong>El crecimiento está disminuyendo.</strong> La mayoría de las chicas alcanzan su estatura adulta entre los 14 y 16 años, aunque algunas continúan creciendo un poco más.</p>';
            } else {
                html += '<p><strong>A tu edad, probablemente has alcanzado o estás muy cerca de tu estatura adulta.</strong> La mayoría de las mujeres terminan de crecer alrededor de los 16 años.</p>';
            }
        }

        if (diff > 15) {
            html += '<p>Según las estaturas de tus padres, podrías crecer bastante más. Recuerda que tu crecimiento real dependerá de muchos factores además de la genética.</p>';
        } else if (diff > 5) {
            html += '<p>Hay espacio para que sigas creciendo según tu potencial genético. Los hábitos saludables pueden ayudarte a aprovechar al máximo esta etapa.</p>';
        } else if (diff > 0) {
            html += '<p>Estás cerca del rango estimado para tu estatura adulta. Recuerda que esta es solo una estimación y que cada persona es diferente.</p>';
        } else {
            html += '<p>Tu estatura actual ya está dentro o cerca del rango estimado. Esto puede significar que tu crecimiento está avanzado para tu edad.</p>';
        }

        return html;
    }

    function generateGeneticText(fatherHeight, motherHeight, sexo) {
        const avgParent = (fatherHeight + motherHeight) / 2;

        if (avgParent > 175) {
            return 'Tus padres tienen estaturas por encima del promedio, lo que es favorable para tu potencial de crecimiento.';
        } else if (avgParent > 165) {
            return 'Las estaturas de tus padres están en el rango promedio, lo cual influye en tu estimación.';
        } else {
            return 'Las estaturas de tus padres influyen en tu rango estimado. Recuerda que otros factores también importan.';
        }
    }

    function generateAgeText(edad, sexo) {
        if (sexo === 'masculino') {
            if (edad < 13) {
                return 'A los ' + edad + ' años, aún no has entrado en la etapa de mayor crecimiento, que típicamente ocurre entre los 13-16 años.';
            } else if (edad <= 16) {
                return 'A los ' + edad + ' años, probablemente estás en tu período de mayor crecimiento o muy cerca de él.';
            } else {
                return 'A los ' + edad + ' años, el ritmo de crecimiento ha disminuido significativamente, pero puede continuar un poco más.';
            }
        } else {
            if (edad < 11) {
                return 'A los ' + edad + ' años, el estirón de crecimiento típicamente aún no ha comenzado.';
            } else if (edad <= 14) {
                return 'A los ' + edad + ' años, probablemente estás experimentando o has pasado por el período de mayor crecimiento.';
            } else {
                return 'A los ' + edad + ' años, la mayoría de las chicas ya han alcanzado o están muy cerca de su estatura adulta.';
            }
        }
    }
});
