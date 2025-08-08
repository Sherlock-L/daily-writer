// 导入配置
import { apiBaseUrl } from './config.js';

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的日记ID
    const urlParams = new URLSearchParams(window.location.search);
    const diaryId = urlParams.get('id');

    if (!diaryId) {
        alert('无效的日记ID');
        window.location.href = 'list.html';
        return;
    }

    // 返回列表按钮事件
    document.getElementById('back-to-list').addEventListener('click', function() {
        window.location.href = 'list.html';
    });

    // 删除按钮事件
    document.getElementById('delete-btn').addEventListener('click', function() {
        if (confirm('确定要删除这篇日记吗？')) {
            deleteDiary(diaryId);
        }
    });

    // 加载日记详情
    loadDiaryDetail(diaryId);
});

// 加载日记详情
async function loadDiaryDetail(id) {
    const diaryTitleElement = document.getElementById('diary-title');
    const diaryDateElement = document.getElementById('diary-date');
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
        const diary=res.data

        // 显示日记详情
        diaryTitleElement.textContent = diary.title;
        diaryDateElement.textContent = new Date(diary.create_time).toLocaleDateString();
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
            throw new Error('删除失败: ' + response.statusText);
        }

        alert('删除成功！');
        window.location.href = 'list.html';
    } catch (error) {
        console.error('删除日记出错:', error);
        errorElement.textContent = '删除失败: ' + error.message;
        errorElement.style.display = 'block';
    } finally {
        // 隐藏加载状态
        loadingElement.style.display = 'none';
    }
}