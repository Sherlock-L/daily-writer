// 导入配置和心情天气模块
import { apiBaseUrl } from './config.js';
import { moodOptions, weatherOptions } from './moodWeather.js';

// 心情和天气评分映射
const moodScores = {
    '快乐': 5,
    '悲伤': 1,
    '愤怒': 2,
    '恐惧': 2,
    '厌恶': 1,
    '惊讶': 4,
    '平常': 3
};

const weatherScores = {
    '晴天': 5,
    '雨天': 2,
    '多云': 3,
    '雾天': 1,
    '沙天': 1,
    '尘天': 1,
    '平常': 3
};

// 当前显示的年月
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

// 存储日记数据
let diaryData = {};

// DOM 元素
const calendarBody = document.getElementById('calendar-body');
const currentMonthElement = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const backToListButton = document.getElementById('back-to-list');
const moodIndexElement = document.getElementById('mood-index');
const weatherIndexElement = document.getElementById('weather-index');
const diaryCountElement = document.getElementById('diary-count');

// 初始化
document.addEventListener('DOMContentLoaded', async function() {
    // 加载日记数据
    await loadDiaryData();

    // 渲染日历
    renderCalendar();

    // 绑定事件
    // 修改上一页按钮事件
    prevMonthButton.onclick = async function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        await loadDiaryData();
        renderCalendar();
    };

    nextMonthButton.onclick = async function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        await loadDiaryData();
        renderCalendar();
    };

    backToListButton.onclick = function() {
        window.location.href = 'list.html';
    };
});

// 加载日记数据
// 修改loadDiaryData函数，添加更多调试信息
async function loadDiaryData() {
    try {
        // 构造请求月份的开始和结束日期
        const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
        const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];

        console.log(`请求日记数据: ${startDate} 至 ${endDate}`);

        // 从API获取日记数据
        const response = await fetch(`${apiBaseUrl}/diaries?start_date=${startDate}&end_date=${endDate}`);
        const data = await response.json();

        console.log('API返回数据:', data);

        // 重置日记数据
        diaryData = {};

        // 格式化日记数据
        if (data.code === 200 && data.data && data.data.items) {
            data.data.items.forEach(diary => {
                const date = diary.create_time.split(' ')[0]; // 获取日期部分
                diaryData[date] = {
                    mood: diary.mood,
                    weather: diary.weather,
                    id: diary.id
                };
                console.log(`已加载日记: ${date}`, diaryData[date]);
            });

            // 计算并更新统计数据
            updateStatistics();
            console.log('日记数据加载完成，共', Object.keys(diaryData).length, '条记录');
        }
    } catch (error) {
        console.error('加载日记数据失败:', error);
        alert('加载日记数据失败，请稍后再试');
    }
}

// 确保数据加载完成后再渲染日历
async function initDashboard() {
    await loadDiaryData();
    renderCalendar();
}

// 页面加载完成后初始化
// 删除重复的初始化代码
document.addEventListener('DOMContentLoaded', async function() {
    // 加载日记数据
    loadDiaryData();

    // 渲染日历
    renderCalendar();

    // 绑定事件
    // 修改上一页按钮事件
    prevMonthButton.onclick = async function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        await loadDiaryData();
        renderCalendar();
    };

    nextMonthButton.onclick = async function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        await loadDiaryData();
        renderCalendar();
    };

    backToListButton.onclick = function() {
        window.location.href = 'list.html';
    };
});

// 替换为使用initDashboard函数
// 删除initDashboard函数，避免混淆
// async function initDashboard() {
//     await loadDiaryData();
//     renderCalendar();
// }
// document.addEventListener('DOMContentLoaded', initDashboard);

// 更新统计数据
function updateStatistics() {
    const dates = Object.keys(diaryData);
    const count = dates.length;
    diaryCountElement.textContent = count;

    if (count === 0) {
        moodIndexElement.textContent = '0.0';
        weatherIndexElement.textContent = '0.0';
        return;
    }

    // 计算心情指数
    let totalMoodScore = 0;
    let totalWeatherScore = 0;

    dates.forEach(date => {
        const diary = diaryData[date];
        totalMoodScore += moodScores[diary.mood] || 3; // 默认为平常
        totalWeatherScore += weatherScores[diary.weather] || 3; // 默认为平常
    });

    const avgMoodScore = totalMoodScore / count;
    const avgWeatherScore = totalWeatherScore / count;

    moodIndexElement.textContent = avgMoodScore.toFixed(1);
    weatherIndexElement.textContent = avgWeatherScore.toFixed(1);
}

// 渲染日历
function renderCalendar() {
    // 更新当前月份显示
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    currentMonthElement.textContent = `${currentYear}年 ${monthNames[currentMonth]}`;

    // 清空日历
    calendarBody.innerHTML = '';

    // 获取当月第一天是星期几
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    // 获取当月的天数
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 创建日历单元格
    let dayCount = 1;
    let calendarRow = document.createElement('tr');

    // 填充空白单元格
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('td');
        calendarRow.appendChild(emptyCell);
    }

    // 填充日期单元格
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('td');
        dayCell.className = 'calendar-day';
    
        // 构建日期字符串 - 修改为与API返回格式完全一致
        const date = new Date(currentYear, currentMonth, i);
        const dateStr = date.toISOString().split('T')[0];
    
        // 检查是否有日记
        if (diaryData[dateStr]) {
            dayCell.classList.add('has-diary');
            const diary = diaryData[dateStr];
            console.log(`匹配到日记: ${dateStr}`, diary);
    
            // 获取心情和天气图标
            const moodIcon = moodOptions.find(m => m.name === diary.mood)?.icon || '😐';
            const weatherIcon = weatherOptions.find(w => w.name === diary.weather)?.icon || '🌤️';
    
            dayCell.innerHTML = `
                <span class="day-number">${i}</span>
                <div class="day-icons">
                    <span title="${diary.mood}">${moodIcon}</span>
                    <span title="${diary.weather}">${weatherIcon}</span>
                </div>
                <div class="diary-marker"></div>
            `;
    
            // 添加点击事件，查看日记详情
            dayCell.addEventListener('click', () => {
                 window.open( `detail.html?id=${diary.id}`, '_blank');
            });
        } else {
            dayCell.classList.add('no-diary');
            dayCell.innerHTML = `<span class="day-number">${i}</span>`;
            console.log(`未匹配到日记: ${dateStr}`);
        }

        // 添加单元格到行
        calendarRow.appendChild(dayCell);

        // 如果是星期六，换行
        if ((firstDay + dayCount) % 7 === 0) {
            calendarBody.appendChild(calendarRow);
            calendarRow = document.createElement('tr');
        }

        dayCount++;
    }

    // 添加最后一行
    if (calendarRow.children.length > 0) {
        calendarBody.appendChild(calendarRow);
    }
}