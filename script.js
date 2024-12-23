document.addEventListener('DOMContentLoaded', () => {
    const drawButton = document.getElementById('draw-number');
    const resetButton = document.getElementById('reset');
    const applySettingsButton = document.getElementById('apply-settings');
    const latestNumber = document.getElementById('latest-number');
    const numberHistory = document.getElementById('number-history');
    const colorPicker = document.getElementById('color');
    const container = document.querySelector('.container');
    const modeSelection = document.getElementsByName('mode');
    const autoControls = document.querySelector('.auto-controls');
    const manualControls = document.querySelector('.manual-controls');
    const submitNumberButton = document.getElementById('submit-number');
    const manualNumberInput = document.getElementById('manual-number');
    const errorMessage = document.getElementById('error-message');

    let min = parseInt(document.getElementById('min').value);
    let max = parseInt(document.getElementById('max').value);
    let drawnNumbers = [];
    let currentMode = 'auto'; // 'auto' or 'manual'

    // 應用設定
    applySettingsButton.addEventListener('click', () => {
        min = parseInt(document.getElementById('min').value);
        max = parseInt(document.getElementById('max').value);
        const color = colorPicker.value;
        container.style.borderColor = color;
        container.style.backgroundColor = shadeColor(color, 0.1);
    });

    // 切換模式
    modeSelection.forEach(radio => {
        radio.addEventListener('change', () => {
            currentMode = document.querySelector('input[name="mode"]:checked').value;
            if (currentMode === 'auto') {
                autoControls.style.display = 'block';
                manualControls.style.display = 'none';
                clearError();
            } else {
                autoControls.style.display = 'none';
                manualControls.style.display = 'block';
                clearError();
            }
        });
    });

    // 開獎功能
    drawButton.addEventListener('click', () => {
        if (drawnNumbers.length >= (max - min + 1)) {
            showError('所有數字已被抽出！');
            return;
        }

        let num;
        do {
            num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (drawnNumbers.includes(num));

        drawnNumbers.push(num);
        latestNumber.textContent = num;
        const li = document.createElement('li');
        li.textContent = num;
        numberHistory.appendChild(li);
    });

    // 提交手動輸入的號碼
    submitNumberButton.addEventListener('click', () => {
        const num = manualNumberInput.value.trim();
        if (num === '') {
            showError('請輸入一個號碼。');
            return;
        }
        if (drawnNumbers.includes(num)) {
            showError('這個號碼已經被輸入過了。');
            return;
        }
        drawnNumbers.push(num);
        latestNumber.textContent = num;
        const li = document.createElement('li');
        li.textContent = num;
        numberHistory.appendChild(li);
        manualNumberInput.value = '';
        clearError();
    });

    // 即時驗證手動輸入的號碼
    manualNumberInput.addEventListener('input', () => {
        const num = manualNumberInput.value.trim();
        if (num === '') {
            clearError();
            return;
        }
        if (drawnNumbers.includes(num)) {
            showError('這個號碼已經被輸入過了。');
        } else {
            clearError();
        }
    });

    // 重置功能
    resetButton.addEventListener('click', () => {
        drawnNumbers = [];
        latestNumber.textContent = '-';
        numberHistory.innerHTML = '';
        manualNumberInput.value = '';
        clearError();
    });

    // 改變主視覺顏色
    colorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        container.style.borderColor = color;
        container.style.backgroundColor = shadeColor(color, 0.1);
    });

    // 輔助函數：調整顏色亮度
    function shadeColor(color, percent) {
        const f = parseInt(color.slice(1),16);
        const t = percent < 0 ? 0 : 255;
        const p = Math.abs(percent);
        const R = f>>16;
        const G = f>>8&0x00FF;
        const B = f&0x0000FF;
        const newR = Math.round((t - R) * p) + R;
        const newG = Math.round((t - G) * p) + G;
        const newB = Math.round((t - B) * p) + B;
        return `rgb(${newR}, ${newG}, ${newB})`;
    }

    // 顯示錯誤訊息
    function showError(message) {
        errorMessage.textContent = message;
    }

    // 清除錯誤訊息
    function clearError() {
        errorMessage.textContent = '';
    }
});
