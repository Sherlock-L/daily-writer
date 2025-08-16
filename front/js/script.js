// 导入配置和心情天气模块
import { apiBaseUrl } from './config.js';
import { initMoodSelector, initWeatherSelector, getSelectedMood, getSelectedWeather } from './moodWeather.js';
// 导入自定义弹窗
import customModal from './modal.js';

// 设置当前日期为标题默认值
 document.addEventListener('DOMContentLoaded', function() {
    // 设置当前日期
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    document.getElementById('diary-title').value = formattedDate;

    // 初始化心情和天气选择器
    initMoodSelector('mood-selector');
    initWeatherSelector('weather-selector');

    // 保存按钮事件
    document.getElementById('save-btn').addEventListener('click', saveDiary);

    // 返回列表按钮事件
    document.getElementById('back-to-list').addEventListener('click', function() {
        window.location.href = 'list.html';
    });
});

// 保存日记
async function saveDiary() {
    const title = document.getElementById('diary-title').value;
    const content = document.getElementById('diary-content').value;
    const mood = getSelectedMood('mood-selector');
    const weather = getSelectedWeather('weather-selector');

    if (!title || !content) {
        // 使用自定义弹窗替代alert
        customModal.show({
            title: '提示',
            content: '标题和内容不能为空',
            confirmText: '确定'
        });
        return;
    }

    try {
        // 显示加载状态
        document.getElementById('save-btn').disabled = true;
        document.getElementById('save-btn').textContent = '保存中...';

        const response = await fetch(`${apiBaseUrl}/diary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                content: content,
                mood: mood,
                weather: weather
            })
        });

        if (!response.ok) {
            throw new Error('存封失败: ' + response.statusText);
        }

        const data = await response.json();
        // 显示保存成功弹窗
        customModal.show({
            title: '存封成功',
            content: '日记已成功存封！',
            confirmText: '确定',
            onConfirm: function() {
                window.location.href = `index.html`;
            }
        });
    } catch (error) {
        console.error('保存日记出错:', error);
        // 显示保存失败弹窗
        customModal.show({
            title: '存封失败',
            content: '存封失败: ' + error.message,
            confirmText: '确定'
        });
    } finally {
        // 恢复按钮状态
        document.getElementById('save-btn').disabled = false;
        document.getElementById('save-btn').textContent = '存封此页';
    }
}