// 导入配置
import { apiBaseUrl } from './config.js';

// 导入心情和天气选项
import { moodOptions, weatherOptions } from './moodWeather.js';

// 导入自定义弹窗
import customModal from './modal.js';

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的日记ID
    const urlParams = new URLSearchParams(window.location.search);
    const diaryId = urlParams.get('id');

    if (!diaryId) {
        // 使用自定义弹窗替代alert
        customModal.show({
            title: '提示',
            content: '无效的日记ID',
            confirmText: '确定',
            onConfirm: function() {
                window.location.href = 'list.html';
            }
        });
        return;
    }

    // 返回列表按钮事件
    document.getElementById('back-to-list').addEventListener('click', function() {
        window.location.href = 'list.html';
    });

    // 删除按钮事件 - 使用自定义弹窗
    document.getElementById('delete-btn').addEventListener('click', function() {
        customModal.show({
            title: '焚稿为星',
            content: '确定要将这篇日记焚稿为星吗？',
            confirmText: '确认焚稿',
            cancelText: '取消', // 添加取消按钮文本
            onConfirm: function() {
                deleteDiary(diaryId);
            },
            onCancel: function() {
                customModal.hide(); // 关闭弹窗
            }
        });
    });

    // 加载日记详情
    loadDiaryDetail(diaryId);
});

// 加载日记详情
async function loadDiaryDetail(id) {
    const diaryTitleElement = document.getElementById('diary-title');
    const diaryDateElement = document.getElementById('diary-date');
    const diaryMoodWeatherElement = document.getElementById('diary-mood-weather');
    const diaryContentElement = document.getElementById('diary-content');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    // 显示加载状态
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';

    try {
        const response = await fetch(`${apiBaseUrl}/diary/${id}`);

        if (!response.ok) {
            throw new Error('加载失败: ' + response.statusText);
        }

        const res = await response.json();
        const diary = res.data;

        // 获取心情和天气对应的图标
        const moodIcon = moodOptions.find(m => m.name === diary.mood)?.icon || '😐';
        const weatherIcon = weatherOptions.find(w => w.name === diary.weather)?.icon || '🌤️';

        // 显示日记详情
        diaryTitleElement.textContent = diary.title;
        diaryDateElement.textContent = new Date(diary.create_time).toLocaleDateString();
        diaryMoodWeatherElement.innerHTML = `${moodIcon} ${diary.mood} <span style="margin: 0 15px;"></span>${weatherIcon} ${diary.weather}`;
        diaryContentElement.textContent = diary.content;
    } catch (error) {
        console.error('加载日记详情出错:', error);
        errorElement.textContent = '加载失败: ' + error.message;
        errorElement.style.display = 'block';
    } finally {
        // 隐藏加载状态
        loadingElement.style.display = 'none';
    }
}

// 删除日记
async function deleteDiary(id) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    // 显示加载状态
    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';

    try {
        const response = await fetch(`${apiBaseUrl}/diary/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('焚稿失败: ' + response.statusText);
        }

        // 使用自定义弹窗显示成功消息
        customModal.show({
            title: '焚稿成功',
            content: '日记已成功焚稿为星！2秒后自动返回...',
            confirmText: '立即返回',
            onConfirm: function() {
                window.location.href = 'list.html';
            }
        });
        
        // 倒计时功能实现
        let seconds = 2;
        const countdownElement = document.getElementById('countdown');
        const countdownInterval = setInterval(function() {
            seconds--;
            if (countdownElement) {
                countdownElement.textContent = seconds;
            }
            
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                window.location.href = 'list.html';
            }
        }, 1000);
    } catch (error) {
        console.error('删除日记出错:', error);
        errorElement.textContent = '焚稿失败: ' + error.message;
        errorElement.style.display = 'block';
    } finally {
        // 隐藏加载状态
        loadingElement.style.display = 'none';
    }
}