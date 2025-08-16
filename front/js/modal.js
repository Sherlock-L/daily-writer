// 自定义弹窗模块
class CustomModal {
    constructor() {
        this.initModal();
    }

    // 初始化弹窗DOM
    initModal() {
        // 检查是否已经存在弹窗
        if (document.getElementById('custom-modal')) {
            return;
        }

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'custom-modal';
        overlay.className = 'modal-overlay';

        // 创建弹窗容器
        const container = document.createElement('div');
        container.className = 'modal-container';

        // 创建弹窗标题
        const title = document.createElement('div');
        title.className = 'modal-title';
        title.textContent = '提示';

        // 创建弹窗内容
        const content = document.createElement('div');
        content.className = 'modal-content';

        // 创建按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'modal-buttons';

        // 创建确认按钮
        const confirmButton = document.createElement('button');
        confirmButton.className = 'modal-button';
        confirmButton.textContent = '确定';
        confirmButton.addEventListener('click', () => {
            this.hide();
            if (this.confirmCallback) {
                this.confirmCallback();
            }
        });

        // 创建取消按钮
        const cancelButton = document.createElement('button');
        cancelButton.className = 'modal-button cancel';
        cancelButton.textContent = '取消';
        cancelButton.addEventListener('click', () => {
            this.hide();
            if (this.cancelCallback) {
                this.cancelCallback();
            }
        });

        // 添加到按钮容器
        buttonsContainer.appendChild(confirmButton);
        buttonsContainer.appendChild(cancelButton);

        // 组装弹窗
        container.appendChild(title);
        container.appendChild(content);
        container.appendChild(buttonsContainer);
        overlay.appendChild(container);

        // 添加到文档
        document.body.appendChild(overlay);

        // 存储DOM引用
        this.overlay = overlay;
        this.container = container;
        this.titleElement = title;
        this.contentElement = content;
        this.confirmButton = confirmButton;
        this.cancelButton = cancelButton;
        this.confirmCallback = null;
        this.cancelCallback = null;
    }

    // 显示弹窗
    show(options) {
        if (!this.overlay) {
            this.initModal();
        }

        // 设置选项
        if (options.title) {
            this.titleElement.textContent = options.title;
        } else {
            this.titleElement.textContent = '提示';
        }

        if (options.content) {
            this.contentElement.textContent = options.content;
        } else {
            this.contentElement.textContent = '';
        }

        if (options.confirmText) {
            this.confirmButton.textContent = options.confirmText;
        } else {
            this.confirmButton.textContent = '确定';
        }

        // 处理取消按钮
        if (options.cancelText) {
            this.cancelButton.textContent = options.cancelText;
            this.cancelButton.style.display = 'inline-block';
            this.cancelCallback = options.onCancel || null;
        } else {
            this.cancelButton.style.display = 'none';
            this.cancelCallback = null;
        }

        this.confirmCallback = options.onConfirm || null;

        // 显示弹窗
        this.overlay.classList.add('active');
    }

    // 隐藏弹窗
    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }
}

// 导出单例实例
const customModal = new CustomModal();
export default customModal;