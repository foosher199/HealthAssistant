document.addEventListener('DOMContentLoaded', () => {
  // 加载设置
  loadSettings();
  // 加载自定义提醒
  loadCustomReminders();
  // 更新计时器显示
  updateTimers();
  
  // 保存设置按钮点击事件
  document.getElementById('saveSettings').addEventListener('click', saveSettings);
  
  // 设置折叠控制
  const settingsHeader = document.getElementById('settingsHeader');
  const settingsContent = document.getElementById('settingsContent');
  
  settingsHeader.addEventListener('click', () => {
    const isExpanded = settingsHeader.classList.contains('expanded');
    if (isExpanded) {
      settingsHeader.classList.remove('expanded');
      settingsContent.style.display = 'none';
    } else {
      settingsHeader.classList.add('expanded');
      settingsContent.style.display = 'grid';
    }
  });
  
  // 自定义提醒折叠控制
  const customReminderHeader = document.getElementById('customReminderHeader');
  const customReminderContent = document.getElementById('customReminderContent');
  
  customReminderHeader.addEventListener('click', () => {
    const isExpanded = customReminderHeader.classList.contains('expanded');
    if (isExpanded) {
      customReminderHeader.classList.remove('expanded');
      customReminderContent.style.display = 'none';
    } else {
      customReminderHeader.classList.add('expanded');
      customReminderContent.style.display = 'flex';
    }
  });
  
  // 添加自定义提醒按钮点击事件
  document.getElementById('addCustomReminder').addEventListener('click', addCustomReminder);

  // 添加自定义提醒的时间段控制事件监听
  const customTimeCheckbox = document.getElementById('customReminderCustomTime');
  if (customTimeCheckbox) {
    const timeInputs = customTimeCheckbox.closest('.custom-time-range').querySelector('.input-group');
    customTimeCheckbox.addEventListener('change', () => {
      timeInputs.style.display = customTimeCheckbox.checked ? 'flex' : 'none';
    });
  }

  // 添加提醒按钮点击事件
  document.getElementById('openAddReminder').addEventListener('click', () => {
    resetReminderForm();
    document.getElementById('addReminderModal').classList.add('show');
  });

  // 关闭弹窗按钮点击事件
  document.getElementById('closeAddReminder').addEventListener('click', () => {
    document.getElementById('addReminderModal').classList.remove('show');
    resetReminderForm();
  });

  // 点击弹窗外部关闭
  document.getElementById('addReminderModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      e.target.classList.remove('show');
      resetReminderForm();
    }
  });

  // 统计折叠控制
  const statsHeader = document.getElementById('statsHeader');
  const statsContent = document.getElementById('statsContent');
  
  statsHeader.addEventListener('click', () => {
    const isExpanded = statsHeader.classList.contains('expanded');
    if (isExpanded) {
      statsHeader.classList.remove('expanded');
      statsContent.style.display = 'none';
    } else {
      statsHeader.classList.add('expanded');
      statsContent.style.display = 'grid';
    }
  });

  // 下次提醒折叠控制
  const statusHeader = document.getElementById('statusHeader');
  const statusContent = document.getElementById('statusContent');
  
  statusHeader.addEventListener('click', () => {
    const isExpanded = statusHeader.classList.contains('expanded');
    if (isExpanded) {
      statusHeader.classList.remove('expanded');
      statusContent.style.display = 'none';
    } else {
      statusHeader.classList.add('expanded');
      statusContent.style.display = 'grid';
    }
  });
  
  // 默认展开下次提醒区域
  statusHeader.classList.add('expanded');
  statusContent.style.display = 'grid';

  // 初始化国际化
  initI18n();
});

// 从 background.js 获取 DEFAULT_SETTINGS
let DEFAULT_SETTINGS = {
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

// 加载设置
function loadSettings() {
  chrome.storage.local.get([
    'enableWorkTime',
    'workStartTime',
    'workEndTime',
  ], (settings) => {
    document.getElementById('enableWorkTime').checked = settings.enableWorkTime ?? true;
    
    // 设置时间输入框的类型和默认值
    const startTimeInput = document.getElementById('workStartTime');
    const endTimeInput = document.getElementById('workEndTime');
    
    // 设置输入框类型和属性
    [startTimeInput, endTimeInput].forEach(input => {
      input.type = 'time';
      input.setAttribute('step', '900'); // 每15分钟
      input.setAttribute('data-format', '24h');
    });
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      input[type="time"][data-format="24h"] {
        width: 110px;
        padding: 4px 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        color: #333;
        cursor: pointer;
        position: relative;
      }
      
      /* 自定义时间输入框的内部布局 */
      input[type="time"][data-format="24h"]::-webkit-datetime-edit {
        display: flex;
        padding: 0;
        margin-right: 16px;  /* 增加右边距，为时间选择器箭头留出更多空间 */
      }
      
      /* 调整时间段显示 */
      input[type="time"][data-format="24h"]::-webkit-datetime-edit-ampm-field {
        display: inline-block;
        min-width: 35px;
        padding-right: 2px;  /* 减小右边距 */
        color: #666;
      }
      
      /* 调整时间显示 */
      input[type="time"][data-format="24h"]::-webkit-datetime-edit-hour-field,
      input[type="time"][data-format="24h"]::-webkit-datetime-edit-minute-field {
        padding: 0;  /* 移除内边距 */
        color: #333;
      }
      
      /* 调整时间分隔符 */
      input[type="time"][data-format="24h"]::-webkit-datetime-edit-text {
        color: #666;
        padding: 0 1px;  /* 减小分隔符的内边距 */
      }
      
      /* 调整时间选择器箭头位置 */
      input[type="time"][data-format="24h"]::-webkit-calendar-picker-indicator {
        display: inline-block;
        opacity: 0.7;
        cursor: pointer;
        padding: 0;
        margin-left: 0;
      }
      
      input[type="time"][data-format="24h"]:focus {
        outline: none;
        border-color: #2196F3;
        box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
      }
      
      input[type="time"][data-format="24h"]::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
      }
      
      /* 隐藏上下箭头 */
      input[type="time"][data-format="24h"]::-webkit-inner-spin-button {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    // 设置初始值
    startTimeInput.value = settings.workStartTime || '09:00';
    endTimeInput.value = settings.workEndTime || '18:00';
  });
}

// 加载自定义提醒
function loadCustomReminders() {
  chrome.storage.local.get(['customReminders'], (result) => {
    const reminders = result.customReminders;
    if (!reminders) {
      // 如果没有数据，设置默认数据
      chrome.storage.local.set(DEFAULT_SETTINGS, () => {
        // 更新提醒列表和统计数据
        updateCustomReminderList(DEFAULT_SETTINGS.customReminders);
        loadStats();
      });
    } else {
      // 检查并添加新的默认提醒
      const updatedReminders = updateDefaultReminders(reminders);
      // 总是更新存储，以确保文本是最新的
      if (true) {
        chrome.storage.local.set({ customReminders: updatedReminders }, () => {
          updateCustomReminderList(updatedReminders);
          loadStats();
        });
      } else {
        updateCustomReminderList(reminders);
        loadStats();
      }
    }
  });
}

// 更新默认提醒
function updateDefaultReminders(existingReminders) {
  const defaultIds = DEFAULT_SETTINGS.customReminders.map(r => r.id);
  const existingIds = existingReminders.map(r => r.id);
  
  // 更新默认提醒的文本
  existingReminders = existingReminders.map(reminder => {
    if (reminder.isDefault) {
      // 根据 id 获取对应的国际化消息
      const messageKey = `${reminder.id}Reminder`;
      return {
        ...reminder,
        text: chrome.i18n.getMessage(messageKey)
      };
    }
    return reminder;
  });
  
  // 找出缺少的默认提醒
  const missingDefaults = DEFAULT_SETTINGS.customReminders.filter(
    defaultReminder => !existingIds.includes(defaultReminder.id)
  );
  
  if (missingDefaults.length > 0) {
    // 添加缺少的默认提醒
    return [...existingReminders, ...missingDefaults];
  }
  
  return existingReminders;
}

// 更新自定义提醒列表
function updateCustomReminderList(reminders) {
  const list = document.getElementById('customReminderList');
  list.innerHTML = '';
  
  // 同时更新统计列表
  updateStatsList(reminders);
  
  reminders.forEach((reminder, index) => {
    const item = document.createElement('div');
    item.className = 'custom-reminder-item';
    
    item.innerHTML = `
      <div class="custom-reminder-info">
        <div class="custom-reminder-header">
          <div class="custom-reminder-text">
            ${reminder.text}
          </div>
        </div>
        <div class="custom-reminder-interval">${chrome.i18n.getMessage('everyMinutes', [reminder.interval])}</div>
        ${reminder.timeSettings?.useCustomTime ? 
          `<div class="custom-reminder-time">
            ${reminder.timeSettings.startTime} - ${reminder.timeSettings.endTime}
          </div>` : ''
        }
      </div>
      <div class="custom-reminder-actions">
        <button class="custom-reminder-edit" data-index="${index}">${chrome.i18n.getMessage('edit')}</button>
        <button class="custom-reminder-delete" data-index="${index}">${chrome.i18n.getMessage('delete')}</button>
      </div>
    `;
    
    // 添加编辑按钮事件监听
    item.querySelector('.custom-reminder-edit').addEventListener('click', () => {
      editCustomReminder(index);
    });
    
    // 添加删除按钮事件监听
    item.querySelector('.custom-reminder-delete').addEventListener('click', () => {
      deleteCustomReminder(index);
    });
    
    list.appendChild(item);
  });
}

// 编辑自定义提醒
function editCustomReminder(index) {
  chrome.storage.local.get(['customReminders'], (result) => {
    const reminders = result.customReminders || [];
    const reminder = reminders[index];
    if (!reminder) return;

    // 填充表单
    document.getElementById('customReminderText').value = reminder.text;
    document.getElementById('customReminderInterval').value = reminder.interval;
    
    const customTimeCheckbox = document.getElementById('customReminderCustomTime');
    const timeInputs = customTimeCheckbox.closest('.custom-time-range').querySelector('.input-group');
    
    if (reminder.timeSettings?.useCustomTime) {
      customTimeCheckbox.checked = true;
      timeInputs.style.display = 'flex';
      document.getElementById('customReminderStartTime').value = reminder.timeSettings.startTime;
      document.getElementById('customReminderEndTime').value = reminder.timeSettings.endTime;
    } else {
      customTimeCheckbox.checked = false;
      timeInputs.style.display = 'none';
    }

    // 修改弹窗标题和按钮
    document.getElementById('reminderModalTitle').textContent = chrome.i18n.getMessage('editReminder');
    const addButton = document.getElementById('addCustomReminder');
    addButton.dataset.editIndex = index;

    // 显示弹窗
    document.getElementById('addReminderModal').classList.add('show');
  });
}

// 重置提醒表单
function resetReminderForm() {
  document.getElementById('customReminderText').value = '';
  document.getElementById('customReminderInterval').value = '';
  document.getElementById('customReminderCustomTime').checked = false;
  document.getElementById('customReminderCustomTime')
    .closest('.custom-time-range')
    .querySelector('.input-group').style.display = 'none';
  
  // 重置弹窗标题
  document.getElementById('reminderModalTitle').textContent = chrome.i18n.getMessage('addReminder');
  const addButton = document.getElementById('addCustomReminder');
  delete addButton.dataset.editIndex;
}

// 修改添加自定义提醒函数
function addCustomReminder() {
  const text = document.getElementById('customReminderText').value.trim();
  const interval = parseInt(document.getElementById('customReminderInterval').value);
  const useCustomTime = document.getElementById('customReminderCustomTime').checked;
  const startTime = document.getElementById('customReminderStartTime').value;
  const endTime = document.getElementById('customReminderEndTime').value;
  
  if (!text || !interval || interval < 1 || interval > 1440) {
    showToast(chrome.i18n.getMessage('pleaseEnterValid'));
    return;
  }
  
  // 验证时间段设置
  if (useCustomTime) {
    if (!startTime || !endTime) {
      showToast(chrome.i18n.getMessage('pleaseSetValidTime'));
      return;
    }
    
    // 解析时间
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    
    if (endMinutes <= startMinutes) {
      showToast(chrome.i18n.getMessage('endTimeMustBeLater'));
      return;
    }
  }

  const addButton = document.getElementById('addCustomReminder');
  const editIndex = addButton.dataset.editIndex;
  
  chrome.storage.local.get(['customReminders'], (result) => {
    const reminders = result.customReminders || [];
    const newReminder = {
      id: `custom_${Date.now()}`,
      text,
      interval,
      isDefault: false,
      count: 0,
      timeSettings: {
        useCustomTime,
        startTime,
        endTime
      }
    };

    if (editIndex !== undefined) {
      const oldReminder = reminders[editIndex];
      newReminder.id = oldReminder.id;
      newReminder.isDefault = oldReminder.isDefault;
      newReminder.count = oldReminder.count;
      reminders[editIndex] = newReminder;
      addButton.textContent = '添加提醒';
      delete addButton.dataset.editIndex;
    } else {
      reminders.push(newReminder);
    }
    
    chrome.storage.local.set({ customReminders: reminders }, () => {
      updateCustomReminderList(reminders);
      createCustomTimers(reminders);
      resetReminderForm();
      document.getElementById('addReminderModal').classList.remove('show');
      
      showToast(editIndex !== undefined ? 
        chrome.i18n.getMessage('editSaved') : 
        chrome.i18n.getMessage('reminderAdded')
      );
      chrome.runtime.sendMessage({ action: 'resetAlarms' });
    });
  });
}

// 删除自定义提醒
function deleteCustomReminder(index) {
  chrome.storage.local.get(['customReminders'], (result) => {
    const reminders = result.customReminders || [];
    reminders.splice(index, 1);
    
    chrome.storage.local.set({ customReminders: reminders }, () => {
      updateCustomReminderList(reminders);
      createCustomTimers(reminders);
      showToast('提醒已删除');
      
      // 重新设置定时器
      chrome.runtime.sendMessage({ action: 'resetAlarms' });
    });
  });
}

// 监听来自background的状态更新消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateTimerStatus') {
    const { type, index, active } = message.data;
    let element;

    if (type === 'water') {
      element = document.querySelector('.water-timer');
    } else if (type === 'break') {
      element = document.querySelector('.break-timer');
    } else if (type === 'custom') {
      element = document.getElementById(`customTimer_${index}`);
    }

    if (element) {
      if (active) {
        element.classList.remove('inactive');
      } else {
        element.classList.add('inactive');
      }
    }
  }
});

// 重置所有提醒数据
function resetAllReminders() {
  if (confirm('确定要重置所有定时提醒吗？这将清空所有自定义提醒，并恢复默认的喝水和休息提醒。')) {
    // 先清除所有数据
    chrome.storage.local.clear(() => {
      // 然后设置默认数据
      chrome.storage.local.set(DEFAULT_SETTINGS, () => {
        loadCustomReminders(); // 重新加载提醒列表
        loadStats(); // 重新加载统计数据
        showToast('已重置所有提醒');
        chrome.runtime.sendMessage({ action: 'resetAlarms' });
      });
    });
  }
}

// 加载统计数据
function loadStats() {
  chrome.storage.local.get(['customReminders'], (result) => {
    const reminders = result.customReminders;
    if (!reminders) {
      // 不需要移除错误日志
      updateStatsList(reminders);
    } else {
      updateStatsList(reminders);
    }
  });
}

// 更新统计列表
function updateStatsList(reminders) {
  const statsGrid = document.querySelector('.stats-grid');
  statsGrid.innerHTML = '';
  
  // 确保 statsContent 显示
  const statsContent = document.getElementById('statsContent');
  statsContent.style.display = 'grid';
  document.getElementById('statsHeader').classList.add('expanded');
  
  reminders.forEach(reminder => {
    const statItem = document.createElement('div');
    statItem.className = 'stat-item';
    
    // 为默认提醒使用特定图标
    const iconClass = reminder.id === 'water' ? 'water-icon' : 
                     reminder.id === 'break' ? 'break-icon' : 
                     'custom-icon';
    
    statItem.innerHTML = `
      <div class="stat-icon ${iconClass}"></div>
      <div class="stat-info">
        <div class="stat-label">${reminder.text}</div>
        <div class="stat-value">${reminder.count || 0}</div>
      </div>
    `;
    
    statsGrid.appendChild(statItem);
  });
}

// 显示 Toast 提示
function showToast(message, duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// 更新计时器显示
function updateTimers() {
  chrome.storage.local.get(['customReminders'], (result) => {
    const reminders = result.customReminders || DEFAULT_SETTINGS.customReminders;
  
    // 更新或创建自定义提醒计时器
    const customTimersContainer = document.getElementById('customTimers');
    
    // 如果容器为空，创建所有计时器
    if (customTimersContainer.children.length === 0) {
      createCustomTimers(reminders);
    } else {
      // 否则只更新现有计时器的值
      reminders.forEach((reminder, index) => {
        chrome.alarms.get(`customReminder_${index}`, (alarm) => {
          const timerId = `customTimer_${index}`;
          const timerElement = document.getElementById(timerId);
          if (timerElement) {
            const timerValue = timerElement.querySelector('.timer-value');
            if (timerValue) {
              updateTimerValue(timerId, alarm);
            }
          }
        });
      });
    }
  
    // 每秒更新一次
    setTimeout(updateTimers, 1000);
  });
}

// 更新单个计时器的值
function updateTimerValue(elementId, alarm) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const timerValue = element.classList.contains('timer-item') ? 
    element.querySelector('.timer-value') : element;

  if (alarm) {
    const remaining = Math.max(0, Math.round((alarm.scheduledTime - Date.now()) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerValue.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
  } else {
    timerValue.textContent = '--:--';
  }
}

// 创建自定义提醒计时器
function createCustomTimers(reminders) {
  const customTimersContainer = document.getElementById('customTimers');
  if (!customTimersContainer) return;
  customTimersContainer.innerHTML = '';

  reminders.forEach((reminder, index) => {
    const timerItem = document.createElement('div');
    timerItem.className = 'timer-item custom-timer';
    timerItem.id = `customTimer_${index}`;
    timerItem.innerHTML = `
      <div class="timer-label">${reminder.text}</div>
      <div class="timer-value">--:--</div>
    `;
    customTimersContainer.appendChild(timerItem);

    // 立即更新计时器值
    chrome.alarms.get(`customReminder_${index}`, (alarm) => {
      updateTimerValue(`customTimer_${index}`, alarm);
    });
  });
}

// 初始化国际化
function initI18n() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    element.textContent = chrome.i18n.getMessage(key);
  });
  
  // 设置输入框的 placeholder
  document.getElementById('customReminderText').placeholder = 
    chrome.i18n.getMessage('enterReminderContent');
  document.getElementById('customReminderInterval').placeholder = 
    chrome.i18n.getMessage('intervalTime');
}

// 保存设置
function saveSettings() {
  const enableWorkTime = document.getElementById('enableWorkTime').checked;
  const workStartTime = document.getElementById('workStartTime').value;
  const workEndTime = document.getElementById('workEndTime').value;

  // 验证时间格式
  if (!workStartTime || !workEndTime) {
    showToast(chrome.i18n.getMessage('pleaseSetValidTime') || '请设置有效的时间');
    return;
  }

  // 验证开始时间是否小于结束时间
  const [startHour, startMinute] = workStartTime.split(':').map(Number);
  const [endHour, endMinute] = workEndTime.split(':').map(Number);
  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  if (endMinutes <= startMinutes) {
    showToast(chrome.i18n.getMessage('endTimeMustBeLater') || '结束时间必须晚于开始时间');
    return;
  }

  chrome.storage.local.set({
    enableWorkTime,
    workStartTime,
    workEndTime,
  }, () => {
    // 添加保存成功的提示
    showToast(chrome.i18n.getMessage('settingsSaved') || '设置已保存');
    
    // 重置定时器以应用新设置
    chrome.runtime.sendMessage({ action: 'resetAlarms' });
  });
} 