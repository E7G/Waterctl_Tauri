// 默认设置
export const DEFAULT_SETTINGS = {
  deviceName: "Water36088",
  timeoutConfig: {
    RECONNECT_DELAY: 400,
    DIALOG_CLOSE_DELAY: 3000,
    DATA_CLEANUP_DELAY: 5000,
    OPERATION_TIMEOUT: 15000,
    SCAN_TIMEOUT: 15000,
  },
  autoReconnect: true,
};

// 设置接口
export interface AppSettings {
  deviceName: string;
  timeoutConfig: {
    RECONNECT_DELAY: number;
    DIALOG_CLOSE_DELAY: number;
    DATA_CLEANUP_DELAY: number;
    OPERATION_TIMEOUT: number;
    SCAN_TIMEOUT: number;
  };
  autoReconnect: boolean;
}

// 从localStorage加载设置
export function loadSettings(): AppSettings {
  try {
    const savedSettings = localStorage.getItem('waterctl_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // 合并默认设置和保存的设置，确保所有字段都存在
      return {
        deviceName: parsed.deviceName || DEFAULT_SETTINGS.deviceName,
        timeoutConfig: {
          RECONNECT_DELAY: parsed.timeoutConfig?.RECONNECT_DELAY || DEFAULT_SETTINGS.timeoutConfig.RECONNECT_DELAY,
          DIALOG_CLOSE_DELAY: parsed.timeoutConfig?.DIALOG_CLOSE_DELAY || DEFAULT_SETTINGS.timeoutConfig.DIALOG_CLOSE_DELAY,
          DATA_CLEANUP_DELAY: parsed.timeoutConfig?.DATA_CLEANUP_DELAY || DEFAULT_SETTINGS.timeoutConfig.DATA_CLEANUP_DELAY,
          OPERATION_TIMEOUT: parsed.timeoutConfig?.OPERATION_TIMEOUT || DEFAULT_SETTINGS.timeoutConfig.OPERATION_TIMEOUT,
          SCAN_TIMEOUT: parsed.timeoutConfig?.SCAN_TIMEOUT || DEFAULT_SETTINGS.timeoutConfig.SCAN_TIMEOUT,
        },
        autoReconnect: typeof parsed.autoReconnect === 'boolean' ? parsed.autoReconnect : DEFAULT_SETTINGS.autoReconnect,
      };
    }
  } catch (error) {
    console.error('加载设置失败:', error);
  }
  return { ...DEFAULT_SETTINGS };
}

// 保存设置到localStorage
export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem('waterctl_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('保存设置失败:', error);
  }
}

// 重置设置为默认值
export function resetSettings(): void {
  localStorage.removeItem('waterctl_settings');
}

// 初始化设置UI
export function initSettingsUI(): void {
  const settingsLink = document.getElementById('settings-link');
  const settingsDialog = document.getElementById('settings-dialog') as HTMLDialogElement;
  const settingsForm = document.getElementById('settings-form') as HTMLFormElement;
  
  if (!settingsLink || !settingsDialog || !settingsForm) {
    console.error('设置UI元素未找到');
    return;
  }

  // 打开设置对话框
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    loadSettingsToUI();
    settingsDialog.showModal();
  });

  // 处理表单提交
  settingsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveSettingsFromUI();
    settingsDialog.close();
  });

  // 全局重置设置函数
  (window as any).resetSettings = () => {
    if (confirm('确定要恢复默认设置吗？')) {
      resetSettings();
      loadSettingsToUI();
    }
  };
}

// 将设置加载到UI
function loadSettingsToUI(): void {
  const settings = loadSettings();
  
  (document.getElementById('device-name-input') as HTMLInputElement).value = settings.deviceName;
  (document.getElementById('reconnect-delay') as HTMLInputElement).value = settings.timeoutConfig.RECONNECT_DELAY.toString();
  (document.getElementById('dialog-close-delay') as HTMLInputElement).value = settings.timeoutConfig.DIALOG_CLOSE_DELAY.toString();
  (document.getElementById('data-cleanup-delay') as HTMLInputElement).value = settings.timeoutConfig.DATA_CLEANUP_DELAY.toString();
  (document.getElementById('operation-timeout') as HTMLInputElement).value = settings.timeoutConfig.OPERATION_TIMEOUT.toString();
  (document.getElementById('scan-timeout') as HTMLInputElement).value = settings.timeoutConfig.SCAN_TIMEOUT.toString();
  (document.getElementById('auto-reconnect') as HTMLInputElement).checked = settings.autoReconnect;
}

// 从UI保存设置
function saveSettingsFromUI(): void {
  const settings: AppSettings = {
    deviceName: (document.getElementById('device-name-input') as HTMLInputElement).value.trim() || DEFAULT_SETTINGS.deviceName,
    timeoutConfig: {
      RECONNECT_DELAY: parseInt((document.getElementById('reconnect-delay') as HTMLInputElement).value) || DEFAULT_SETTINGS.timeoutConfig.RECONNECT_DELAY,
      DIALOG_CLOSE_DELAY: parseInt((document.getElementById('dialog-close-delay') as HTMLInputElement).value) || DEFAULT_SETTINGS.timeoutConfig.DIALOG_CLOSE_DELAY,
      DATA_CLEANUP_DELAY: parseInt((document.getElementById('data-cleanup-delay') as HTMLInputElement).value) || DEFAULT_SETTINGS.timeoutConfig.DATA_CLEANUP_DELAY,
      OPERATION_TIMEOUT: parseInt((document.getElementById('operation-timeout') as HTMLInputElement).value) || DEFAULT_SETTINGS.timeoutConfig.OPERATION_TIMEOUT,
      SCAN_TIMEOUT: parseInt((document.getElementById('scan-timeout') as HTMLInputElement).value) || DEFAULT_SETTINGS.timeoutConfig.SCAN_TIMEOUT,
    },
    autoReconnect: (document.getElementById('auto-reconnect') as HTMLInputElement).checked,
  };
  
  saveSettings(settings);
}

// 获取当前设置
export function getCurrentSettings(): AppSettings {
  return loadSettings();
}