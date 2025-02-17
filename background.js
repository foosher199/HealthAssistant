// 默认设置
const DEFAULT_SETTINGS = {
  customReminders: [
    {
      id: 'water',
      text: chrome.i18n.getMessage('waterReminder'),
      interval: 120,
      isDefault: true,
      count: 0,
      timeSettings: {
        useCustomTime: false,
        startTime: '09:00',
        endTime: '18:00'
      }
    },
    {
      id: 'break',
      text: chrome.i18n.getMessage('breakReminder'),
      interval: 45,
      isDefault: true,
      count: 0,
      timeSettings: {
        useCustomTime: false,
        startTime: '09:00',
        endTime: '18:00'
      }
    },
    {
      id: 'eyes',
      text: chrome.i18n.getMessage('eyesReminder'),
      interval: 60,
      isDefault: true,
      count: 0,
      timeSettings: {
        useCustomTime: false,
        startTime: '09:00',
        endTime: '18:00'
      }
    },
    {
      id: 'posture',
      text: chrome.i18n.getMessage('postureReminder'),
      interval: 30,
      isDefault: true,
      count: 0,
      timeSettings: {
        useCustomTime: false,
        startTime: '09:00',
        endTime: '18:00'
      }
    }
  ]
};

// 初始化
chrome.runtime.onInstalled.addListener(() => {
  // 检查是否已有数据
  chrome.storage.local.get(['customReminders'], (result) => {
    if (!result.customReminders) {
      // 只在没有数据时设置默认值
      chrome.storage.local.set(DEFAULT_SETTINGS, () => {
        setupAlarms();
      });
    } else {
      setupAlarms();
    }
  });
});

// 设置定时器
function setupAlarms() {
  chrome.storage.local.get(['customReminders'], (settings) => {
    const customReminders = settings.customReminders || DEFAULT_SETTINGS.customReminders;
    customReminders.forEach((reminder, index) => {
      chrome.alarms.create(`customReminder_${index}`, {
        periodInMinutes: reminder.interval
      });
    });
  });
}

// 检查是否在工作时间内
async function isWithinWorkHours(type, index = -1) {
  // 获取所有设置
  const settings = await new Promise(resolve => {
    chrome.storage.local.get([
      'enableWorkTime',
      'workStartTime',
      'workEndTime',
      'customReminders'
    ], resolve);
  });

  // 如果未启用时间控制，则始终返回true
  if (!settings.enableWorkTime) {
    console.log('Work time control is disabled');
    return true;
  }

  // 获取要使用的时间设置
  let timeSettings;
  if (type === 'custom' && index >= 0) {
    const reminder = settings.customReminders?.[index];
    if (reminder?.timeSettings?.useCustomTime) {
      timeSettings = reminder.timeSettings;
    }
  }

  // 如果没有独立时间设置，使用全局设置
  if (!timeSettings) {
    timeSettings = {
      startTime: settings.workStartTime || '09:00',
      endTime: settings.workEndTime || '18:00'
    };
  }

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();

  // 解析时间设置
  const [startHour, startMinute] = timeSettings.startTime.split(':').map(Number);
  const [endHour, endMinute] = timeSettings.endTime.split(':').map(Number);

  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  const isWithinTime = currentTime >= startTime && currentTime <= endTime;
  console.log('Time check:', {
    currentTime,
    startTime,
    endTime,
    isWithinTime,
    timeSettings
  });

  return isWithinTime;
}

// 处理提醒
chrome.alarms.onAlarm.addListener(async (alarm) => {
  // 需要移除或注释的调试日志
  // console.log('Alarm triggered:', alarm.name);
  
  if (alarm.name.startsWith('customReminder_')) {
    const index = parseInt(alarm.name.split('_')[1]);
    
    // 先检查是否在有效时间段内
    const isWorkTime = await isWithinWorkHours('custom', index);
    if (!isWorkTime) {
      console.log('Outside of work hours, skipping reminder');
      return;
    }

    chrome.storage.local.get(['customReminders'], (result) => {
      const reminders = result.customReminders || DEFAULT_SETTINGS.customReminders;
      const reminder = reminders[index];
      if (reminder) {
        showReminderWindow(reminder);
        updateCount(reminder.id);
      }
    });
  }
});

// 更新计数
function updateCount(reminderId) {
  chrome.storage.local.get(['customReminders'], (result) => {
    const reminders = result.customReminders || DEFAULT_SETTINGS.customReminders;
    const reminderIndex = reminders.findIndex(r => r.id === reminderId);
    if (reminderIndex !== -1) {
      reminders[reminderIndex].count = (reminders[reminderIndex].count || 0) + 1;
      chrome.storage.local.set({ customReminders: reminders });
    }
  });
}

// 每天零点重置计数
chrome.alarms.create('resetDaily', {
  when: getNextMidnight(),
  periodInMinutes: 24 * 60
});

function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'resetDaily') {
    chrome.storage.local.get(['customReminders'], (result) => {
      const reminders = result.customReminders || DEFAULT_SETTINGS.customReminders;
      reminders.forEach(reminder => {
        reminder.count = 0;
      });
      chrome.storage.local.set({ customReminders: reminders });
    });
  }
});

// 重置定时器
function resetAlarms() {
  chrome.alarms.clearAll(() => {
    setupAlarms();
  });
}

// 存储当前打开的提醒窗口ID
let activeReminderWindowId = null;

// 监听窗口关闭事件
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === activeReminderWindowId) {
    activeReminderWindowId = null;
  }
});

// 显示提醒窗口
function showReminderWindow(reminder) {
  // 创建新窗口的函数
  function createNewWindow() {
    // 需要移除或注释的调试日志
    // console.log('Creating reminder window for:', reminder.text);
    chrome.system.display.getInfo((displays) => {
      const display = displays[0];
      const width = Math.round(display.bounds.width * 0.6);
      const height = Math.round(display.bounds.height * 0.6);
      const left = Math.round((display.bounds.width - width) / 2);
      const top = Math.round((display.bounds.height - height) / 2);

      // 确保提醒文本被正确编码
      const reminderText = encodeURIComponent(reminder.text);
      
      chrome.windows.create({
        url: `reminder.html?text=${reminderText}`,
        type: 'popup',
        width: width,
        height: height,
        left: left,
        top: top,
        focused: true,
        state: 'normal'
      }, (window) => {
        // 需要移除或注释的调试日志
        // console.log('New window created:', window.id);
        activeReminderWindowId = window.id;
      });
    });
  }

  // 如果有活动的窗口，先关闭它
  new Promise((resolve) => {
    if (activeReminderWindowId !== null) {
      // 尝试关闭现有窗口
      chrome.windows.remove(activeReminderWindowId, () => {
        if (chrome.runtime.lastError) {
          // 需要移除或注释的调试日志
          // console.log('Error closing window:', chrome.runtime.lastError.message);
        }
        activeReminderWindowId = null;
        resolve();
      });
    } else {
      resolve();
    }
  }).then(() => {
    // 确保之前的窗口已关闭后再创建新窗口
    setTimeout(createNewWindow, 100); // 添加小延迟确保窗口完全关闭
  });
}

// 监听来自 popup 和 reminder 的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'resetAlarms') {
    resetAlarms();
    sendResponse({ success: true });
  } else if (message.action === 'closeReminderWindow') {
    // 需要移除或注释的调试日志
    // console.log('Attempting to close window:', message.windowId);
    
    // 检查窗口是否存在
    chrome.windows.get(message.windowId, (window) => {
      if (!chrome.runtime.lastError && window) {
        chrome.windows.remove(message.windowId, () => {
          if (activeReminderWindowId === message.windowId) {
            activeReminderWindowId = null;
          }
        });
      } else {
        // 窗口已经不存在
        if (activeReminderWindowId === message.windowId) {
          activeReminderWindowId = null;
        }
      }
    });
    
    sendResponse({ success: true });
  }
  return true;
}); 