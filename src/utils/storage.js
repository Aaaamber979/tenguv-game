// 数据持久化工具

/**
 * 获取游戏存档的localStorage key
 * @param {string} gameSource - 游戏文件路径
 * @returns {string} localStorage key
 */
export const getSaveKey = (gameSource) => `tenguv_save_${gameSource}`;

/**
 * 保存游戏进度到localStorage
 * @param {string} gameSource - 游戏文件路径
 * @param {Object} gameState - 游戏状态对象
 */
export const saveGameProgressToStorage = (gameSource, gameState) => {
  const key = getSaveKey(gameSource);
  const saveData = {
    ...gameState,
    timestamp: Date.now()
  };
  localStorage.setItem(key, JSON.stringify(saveData));
};

/**
 * 从localStorage加载游戏存档
 * @param {string} gameSource - 游戏文件路径
 * @returns {Object|null} 存档数据，不存在返回null
 */
export const loadGameSaveFromStorage = (gameSource) => {
  const key = getSaveKey(gameSource);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

/**
 * 检查是否有游戏存档
 * @param {string} gameSource - 游戏文件路径
 * @returns {boolean} 是否有存档
 */
export const hasGameSave = (gameSource) => {
  const key = getSaveKey(gameSource);
  return localStorage.getItem(key) !== null;
};

/**
 * 清除游戏存档
 * @param {string} gameSource - 游戏文件路径
 */
export const clearGameSave = (gameSource) => {
  const key = getSaveKey(gameSource);
  localStorage.removeItem(key);
};

/**
 * 保存自定义名称到localStorage（兼容旧版本）
 * @param {Object} names - 自定义名称映射
 */
export const saveCustomNames = (names) => {
  localStorage.setItem('tenguvCustomNames', JSON.stringify(names));
};

/**
 * 从localStorage加载自定义名称（兼容旧版本）
 * @returns {Object} 自定义名称映射
 */
export const loadCustomNames = () => {
  const data = localStorage.getItem('tenguvCustomNames');
  return data ? JSON.parse(data) : {};
};

/**
 * 保存已解锁对话到localStorage（兼容旧版本）
 * @param {Array} unlocked - 已解锁对话列表
 */
export const saveUnlockedDialogues = (unlocked) => {
  localStorage.setItem('tenguvUnlocked', JSON.stringify(unlocked));
};

/**
 * 从localStorage加载已解锁对话（兼容旧版本）
 * @returns {Array} 已解锁对话列表
 */
export const loadUnlockedDialogues = () => {
  const data = localStorage.getItem('tenguvUnlocked');
  return data ? JSON.parse(data) : [];
};
