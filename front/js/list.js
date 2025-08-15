// 导入配置
import { apiBaseUrl } from './config.js';

// 导入心情和天气选项
import { moodOptions, weatherOptions } from './moodWeather.js';

// 当前页码和每页条数
let currentPage = 1;
const pageSize = 10;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {

    // 返回主页按钮事件
    document.getElementById('back-to-home').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    // 搜索按钮事件
    document.getElementById('search-btn').addEventListener('click', function() {
        currentPage = 1; // 重置为第一页
        loadDiaryList();
    });

    // 搜索框回车事件
    document.getElementById('search-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            currentPage = 1; // 重置为第一页
            loadDiaryList();
        }
    });

    // 加载日记列表
    loadDiaryList();
});

// 加载日记列表
async function loadDiaryList() {
    const searchKeyword = document.getElementById('search-input').value;
    const diaryListElement = document.getElementById('diary-list');
    const paginationElement = document.getElementById('pagination');
    const loadingElement = document.getElementById('loading');

    // 显示加载状态
    loadingElement.style.display = 'block';
    diaryListElement.innerHTML = '';
    paginationElement.innerHTML = '';

    try {
        // 构建查询参数
        let queryParams = `page=${currentPage}&page_size=${pageSize}`;
        if (searchKeyword) {
            queryParams += `&search=${encodeURIComponent(searchKeyword)}`;
        }

        const response = await fetch(`${apiBaseUrl}/diaries?${queryParams}`);

        if (!response.ok) {
            throw new Error('加载失败: ' + response.statusText);
        }

        const resp = await response.json();
        const data =resp.data
        const diaries = data.items;
        const total = data.total;
        const totalPages = Math.ceil(total / pageSize);

        // 渲染日记列表
        if (diaries.length === 0) {
            diaryListElement.innerHTML = '<p class="no-data">没有找到日记</p>';
        } else {
            diaries.forEach(diary => {
                const diaryItem = document.createElement('div');
                diaryItem.className = 'diary-item';
                
                // 获取心情和天气对应的图标
                const moodIcon = moodOptions.find(m => m.name === diary.mood)?.icon || '😐';
                const weatherIcon = weatherOptions.find(w => w.name === diary.weather)?.icon || '🌤️';
                
                diaryItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                        <h3 style="font-size: 24px;font-weight: bold;margin: 0;">${diary.title}</h3>
                        <button class="view-btn" data-id="${diary.id}">查看详情</button>
                    </div>
                    <p class="diary-date">记录时间：${new Date(diary.create_time).toLocaleDateString()} <span style="margin: 0 15px;"></span>${moodIcon} ${diary.mood} <span style="margin: 0 15px;"></span>${weatherIcon} ${diary.weather}</p>
                    <p class="diary-excerpt">${diary.content.substring(0, 100)}${diary.content.length > 100 ? '...' : ''}</p>
                `;
                diaryListElement.appendChild(diaryItem);
            });

            // 绑定查看详情按钮事件
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    window.location.href = `detail.html?id=${id}`;
                });
            });
        }

        // 渲染分页
        renderPagination(totalPages);
    } catch (error) {
        console.error('加载日记列表出错:', error);
        diaryListElement.innerHTML = `<p class="error-message">加载失败: ${error.message}</p>`;
    } finally {
        // 隐藏加载状态
        loadingElement.style.display = 'none';
    }
}

// 渲染分页
function renderPagination(totalPages) {
    const paginationElement = document.getElementById('pagination');

    // 上一页
    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '上一页';
        prevBtn.addEventListener('click', function() {
            currentPage--;
            loadDiaryList();
        });
        paginationElement.appendChild(prevBtn);
    }

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.addEventListener('click', function() {
            currentPage = i;
            loadDiaryList();
        });
        paginationElement.appendChild(pageBtn);
    }

    // 下一页
    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '下一页';
        nextBtn.addEventListener('click', function() {
            currentPage++;
            loadDiaryList();
        });
        paginationElement.appendChild(nextBtn);
    }
}