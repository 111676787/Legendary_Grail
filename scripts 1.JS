// --- КОД КНОПКИ BOOST ---

const boostButton = document.getElementById('boost-button');

let boostCooldown = 0; // Время перезарядки буста
let boostActive = false; // Флаг, указывающий на активность буста

function useBoost() {
    if (boostCooldown === 0 && coins >= 100) {
        boostActive = true;
        boostButton.disabled = true;
        boostCooldown = 10; // Время перезарядки буста
        coins -= 100; // Снимаем монеты за буст
        updateCoins();
        saveGame(); // Сохраняем игру после использования буста

        // Прокачка буста
        if (boostButton.textContent.includes('+1 за тап')) {
            // Увеличиваем количество монет за тап
            coinsPerTap++;
            boostButton.textContent = `Буст (+${coinsPerTap} за тап)`;
        } else {
            // Увеличиваем энергию
            energy = 100;
            updateEnergyBar();
            boostButton.textContent = `Буст (+1 за тап)`;
        }

        setTimeout(() => {
            boostActive = false;
            boostButton.disabled = false;
            boostCooldown = 0;
        }, 10000); // Буст действует 10 секунд
    }
}

function updateBoostCooldown() {
    if (boostCooldown > 0) {
        boostCooldown--;
        boostButton.textContent = `Буст (${boostCooldown} сек)`;
        setTimeout(updateBoostCooldown, 1000);
    } else {
        boostButton.textContent = 'Буст';
        boostButton.disabled = false;
    }
}

// --- КОНЕЦ КОДА КНОПКИ BOOST ---

// --- КОД КНОПКИ КВЕСТЫ ---

const questsButton = document.getElementById('quests-button');

function openQuests() {
    // Здесь будет код для открытия окна или перехода на страницу с квестами
    alert('Квесты пока недоступны!');
}

questsButton.addEventListener('click', openQuests);

// --- КОНЕЦ КОДА КНОПКИ КВЕСТЫ ---

// --- КОД ОСТАЛЬНОЙ ИГРЫ ---

const tapButton = document.getElementById('tap-button');
const resultElement = document.getElementById('result');
const coinsElement = document.getElementById('coins');
const energyFill = document.getElementById('energy-fill');
const achievementElement = document.getElementById('achievement');

let coins = 0;
let energy = 200;
let cooldown = 0;
let taps = 0;
let coinsPerTap = 1; // Количество монет за нажатие
let energyCostPerTap = 15; // Стоимость энергии за нажатие
let energyRegenRate = 4; // Скорость восстановления энергии в единицах в секунду

let coinsDisplay = document.createElement('span');
coinsDisplay.textContent = coins;
coinsElement.appendChild(coinsDisplay);

function updateCoins() {
    coins += coinsPerTap;
    coinsDisplay.textContent = coins;
}

function updateEnergyBar() {
    energyFill.style.width = `${energy}%`;
}

function handleTap() {
    if (cooldown === 0 && energy >= energyCostPerTap) {
        taps++;
        if (taps % 100 === 0 && !achievementElement.classList.contains('active')) {
            // Ачивка!
            coins += 100;
            updateCoins();
            achievementElement.classList.add('active');
            setTimeout(() => {
                achievementElement.classList.remove('active');
            }, 3000);
        }
        updateCoins();
        // resultElement.textContent = `Хорошо! +${coinsPerTap} монета!`; // Удалено сообщение
        energy -= energyCostPerTap;
        updateEnergyBar();
        cooldown = 1;
        setTimeout(updateCooldown, 1000);
        saveGame(); // Сохраняем игру после нажатия
        // tapButton.style.animation = 'shake 0.2s ease-in-out';  /* Убираем анимацию тряски */
        // tapButton.style.animationIterationCount = 2;  /* Убираем анимацию тряски */
    } else if (energy < energyCostPerTap) {
    }
}

function updateCooldown() {
    if (cooldown > 0) {
        cooldown--;
        setTimeout(updateCooldown, 1000);
    } else {
        tapButton.style.cursor = 'pointer';
    }
}

function updateEnergy() {
    if (energy < 100) {
        energy += energyRegenRate;
        if (energy > 100) {
            energy = 100;
        }
        updateEnergyBar();
    }
    setTimeout(updateEnergy, 1000); // Обновляем энергию каждую секунду
}

// --- КОНЕЦ КОДА ОСТАЛЬНОЙ ИГРЫ ---

// --- КОД СОХРАНЕНИЯ ИГРЫ ---
function saveGame() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('energy', energy);
    localStorage.setItem('taps', taps);
    localStorage.setItem('coinsPerTap', coinsPerTap);
    localStorage.setItem('boostCooldown', boostCooldown);
}

// --- КОНЕЦ КОДА СОХРАНЕНИЯ ИГРЫ ---

// --- КОД ЗАГРУЗКИ ИГРЫ ---
function loadGame() {
    coins = parseInt(localStorage.getItem('coins')) || 0;
    energy = parseInt(localStorage.getItem('energy')) || 100;
    taps = parseInt(localStorage.getItem('taps')) || 0;
    coinsPerTap = parseInt(localStorage.getItem('coinsPerTap')) || 1;
    boostCooldown = parseInt(localStorage.getItem('boostCooldown')) || 0;

    updateCoins();
    updateEnergyBar();
    updateBoostCooldown(); // Обновляем текст кнопки буста
}

// --- КОНЕЦ КОДА ЗАГРУЗКИ ИГРЫ ---

// Инициализация
tapButton.addEventListener('click', handleTap);
boostButton.addEventListener('click', useBoost);
updateBoostCooldown(); // Начальная перезарядка буста
updateEnergy(); // Начинаем обновлять энергию
loadGame(); // Загружаем игру при запуске