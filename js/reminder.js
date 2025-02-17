// 初始化国际化
function initI18n() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(key);
  });
}

// 获取URL参数
const urlParams = new URLSearchParams(window.location.search);
const text = decodeURIComponent(urlParams.get('text'));

// 设置提醒内容
// 如果有传入的提醒文本，就使用它作为标题
document.getElementById('reminderTitle').textContent = text || chrome.i18n.getMessage('reminderTitle');

// 设置提醒消息，添加提醒标题并优化样式
document.getElementById('reminderMessage').innerHTML = `
  <p class="reminder-title">${text}</p>
  <p>${chrome.i18n.getMessage('dearTimeUp')}</p>
  <p>${chrome.i18n.getMessage('keepGoodHabits')}</p>
`;

// 动态添加样式
const style = document.createElement('style');
style.textContent = `
  .reminder-title {
    font-size: 24px;
    font-weight: bold;
    color: #2196F3;
    margin-bottom: 16px;
    text-align: center;
    padding: 8px;
    border-bottom: 2px solid #2196F3;
  }
`;
document.head.appendChild(style);

// 自动关闭计时器
let autoCloseTimer;

// 倒计时显示
function updateCountdown(seconds) {
  const button = document.getElementById('closeButton');
  button.textContent = chrome.i18n.getMessage('iKnowWithTime', [seconds]);
}

// 设置自动关闭
function setupAutoClose(duration = 10) {
  let remainingSeconds = duration;
  updateCountdown(remainingSeconds);
  
  autoCloseTimer = setInterval(() => {
    remainingSeconds--;
    updateCountdown(remainingSeconds);
    
    if (remainingSeconds <= 0) {
      clearInterval(autoCloseTimer);
      closeReminder();
    }
  }, 1000);
}

// 关闭提醒
function closeReminder() {
  // 清除自动关闭计时器
  if (autoCloseTimer) {
    clearInterval(autoCloseTimer);
  }

  // 添加动画效果
  const button = document.querySelector('button');
  button.classList.add('button-clicked');
  
  // 播放关闭音效
  playSound('close');
  
  // 等待动画完成后关闭窗口
  setTimeout(() => {
    window.close();
  }, 300);
}

// 添加键盘事件监听，按ESC键也可以关闭窗口
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeReminder();
  }
});

// 添加点击外部区域关闭窗口
document.addEventListener('click', (event) => {
  if (!event.target.closest('.reminder-box')) {
    closeReminder();
  }
});

// 播放提示音
function playSound(type = 'notification') {
  try {
    // 使用 Web Audio API 创建提示音
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 设置音效类型
    if (type === 'notification') {
      // 提醒音效：较高的音调
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'close') {
      // 关闭音效：较低的音调
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.05);
    }

    // 自动清理
    setTimeout(() => {
      audioContext.close();
    }, 1000);
  } catch (error) {
    console.log('播放音效失败:', error);
  }
}

// 添加按钮点击事件监听
document.addEventListener('DOMContentLoaded', () => {
  // 初始化国际化
  initI18n();
  
  // 添加按钮点击事件
  document.getElementById('closeButton').addEventListener('click', closeReminder);

  // 播放提示音
  playSound('notification');
  
  // 启动自动关闭计时器
  setupAutoClose(10);
}); 