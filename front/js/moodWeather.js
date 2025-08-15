// 心情和天气选择器模块

// 定义心情选项
const moodOptions = [
    { id: 'happy', name: '快乐' },
    { id: 'sad', name: '悲伤' },
    { id: 'angry', name: '愤怒' },
    { id: 'fear', name: '恐惧' },
    { id: 'disgust', name: '厌恶' },
    { id: 'surprise', name: '惊讶' },
    { id: 'normal', name: '平常' }
];

// 定义天气选项
const weatherOptions = [
    { id: 'sunny', name: '晴天' },
    { id: 'rainy', name: '雨天' },
    { id: 'cloudy', name: '多云' },
    { id: 'foggy', name: '雾天' },
    { id: 'sand', name: '沙天' },
    { id: 'dust', name: '尘天' },
    { id: 'normal', name: '平常' }
];

// 初始化心情选择器
function initMoodSelector(containerId, defaultMood = 'normal') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 创建标题
    const title = document.createElement('h3');
    title.textContent = '心情';
    title.className = 'selector-title';
    container.appendChild(title);

    // 创建选项容器
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    container.appendChild(optionsContainer);

    // 添加选项
    moodOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.dataset.id = option.id;
        optionElement.innerHTML = `
            <span class="option-checkbox">□</span>
            <span class="option-text">${option.name}</span>
        `;
        optionsContainer.appendChild(optionElement);

        // 设置默认选中
        if (option.id === defaultMood) {
            selectOption(optionElement);
        }

        // 添加点击事件
        optionElement.addEventListener('click', () => {
            // 清除其他选项的选中状态
            document.querySelectorAll(`#${containerId} .option-item`).forEach(item => {
                deselectOption(item);
            });
            // 选中当前选项
            selectOption(optionElement);
        });
    });
}

// 初始化天气选择器
function initWeatherSelector(containerId, defaultWeather = 'normal') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // 创建标题
    const title = document.createElement('h3');
    title.textContent = '天气';
    title.className = 'selector-title';
    container.appendChild(title);

    // 创建选项容器
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    container.appendChild(optionsContainer);

    // 添加选项
    weatherOptions.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.dataset.id = option.id;
        optionElement.innerHTML = `
            <span class="option-checkbox">□</span>
            <span class="option-text">${option.name}</span>
        `;
        optionsContainer.appendChild(optionElement);

        // 设置默认选中
        if (option.id === defaultWeather) {
            selectOption(optionElement);
        }

        // 添加点击事件
        optionElement.addEventListener('click', () => {
            // 清除其他选项的选中状态
            document.querySelectorAll(`#${containerId} .option-item`).forEach(item => {
                deselectOption(item);
            });
            // 选中当前选项
            selectOption(optionElement);
        });
    });
}

// 选中选项
function selectOption(element) {
    const checkbox = element.querySelector('.option-checkbox');
    checkbox.textContent = '✓';
    checkbox.style.color = '#B22222'; // 复古红色
    element.classList.add('selected');
}

// 取消选中选项
function deselectOption(element) {
    const checkbox = element.querySelector('.option-checkbox');
    checkbox.textContent = '□';
    checkbox.style.color = '';
    element.classList.remove('selected');
}

// 获取选中的心情
function getSelectedMood(containerId) {
    const selectedOption = document.querySelector(`#${containerId} .option-item.selected`);
    if (!selectedOption) return '平常';
    const selectedId = selectedOption.dataset.id;
    const selectedMood = moodOptions.find(option => option.id === selectedId);
    return selectedMood ? selectedMood.name : '平常';
}

// 获取选中的天气
function getSelectedWeather(containerId) {
    const selectedOption = document.querySelector(`#${containerId} .option-item.selected`);
    if (!selectedOption) return '平常';
    const selectedId = selectedOption.dataset.id;
    const selectedWeather = weatherOptions.find(option => option.id === selectedId);
    return selectedWeather ? selectedWeather.name : '平常';
}

// 导出函数
export {
    initMoodSelector,
    initWeatherSelector,
    getSelectedMood,
    getSelectedWeather
};