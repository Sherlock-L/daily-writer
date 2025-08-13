// 后端API基础URL
const apiBaseUrl = 'http://127.0.0.1:9898/api';

// 导出配置
export { apiBaseUrl };

const config = {
    // 后端API基础URL
    apiBaseUrl: 'http://127.0.0.1:9898/api',
    
    // 日记文件命名规则: 标题.txt
    getFileName: function(title) {
        // 移除特殊字符
        const cleanTitle = title.replace(/[\\/:*?"<>|]/g, '-');
        return `${cleanTitle}.txt`;
    },
    // 从文件名解析标题
    parseFileName: function(fileName) {
        // 移除扩展名
        return fileName.replace(/\.txt$/, '');
    }
};