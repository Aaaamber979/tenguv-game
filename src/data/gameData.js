// 游戏数据管理

let gameData = null;

/**
 * 清除游戏数据缓存（用于新游戏）
 */
export const clearGameDataCache = () => {
  gameData = null;
};

/**
 * 加载游戏数据
 * @param {string} gameSource - 游戏文件路径，默认为'/game.json'
 * @returns {Promise<Object>} 游戏数据对象
 */
export const loadGameData = async (gameSource = '/game.json') => {
  if (gameData) {
    return gameData;
  }

  try {
    // 优先使用传入的gameSource，其次使用window.__GAME_SOURCE__，最后使用默认值
    const source = gameSource || window.__GAME_SOURCE__ || '/game.json';
    
    const response = await fetch(source);
    
    if (!response.ok) {
      throw new Error(`无法加载游戏数据: ${response.status} ${response.statusText}`);
    }
    
    gameData = await response.json();
    
    // 如果characters是字符串数组，转换为对象数组
    if (gameData.characters && Array.isArray(gameData.characters)) {
      if (typeof gameData.characters[0] === 'string') {
        gameData.characters = gameData.characters.map(id => ({
          id,
          name: `声纹${id.toUpperCase()}`,
          voicePrint: `VP${id.replace('c', '').padStart(3, '0')}`
        }));
      }
    }
    
    // 提取show=true的timelines作为默认解锁的对话
    if (gameData.timelines) {
      const defaultUnlocked = gameData.timelines
        .filter(t => t.show === true || t.show === 1)
        .map(t => `${t.sceneId}_${t.period}`);
      
      // 存储到window供GameContext使用
      window.__DEFAULT_UNLOCKED__ = defaultUnlocked;
    }
    
    return gameData;
  } catch (error) {
    console.error('加载游戏数据失败:', error);
    throw error;
  }
};

/**
 * 获取场景列表
 * @returns {Array} 场景数组
 */
export const getScenes = () => {
  return gameData?.scenes || [];
};

/**
 * 获取角色列表
 * @returns {Array} 角色数组
 */
export const getCharacters = () => {
  return gameData?.characters || [];
};

/**
 * 获取时间线数据
 * @returns {Array} 时间线数组
 */
export const getTimelines = () => {
  return gameData?.timelines || [];
};

/**
 * 获取问题列表
 * @returns {Array} 问题数组
 */
export const getQuestions = () => {
  return gameData?.questions || [];
};

/**
 * 获取游戏元信息
 * @returns {Object} 元信息对象
 */
export const getMeta = () => {
  return gameData?.meta || {};
};

/**
 * 根据ID获取场景
 * @param {string} sceneId - 场景ID
 * @returns {Object|null} 场景对象
 */
export const getSceneById = (sceneId) => {
  return gameData?.scenes?.find(s => s.id === sceneId) || null;
};

/**
 * 根据ID获取角色
 * @param {string} characterId - 角色ID
 * @returns {Object|null} 角色对象
 */
export const getCharacterById = (characterId) => {
  return gameData?.characters?.find(c => c.id === characterId) || null;
};

/**
 * 从时间线数据中提取所有唯一的时间段
 * @param {Array} timelines - 时间线数据
 * @returns {Array} 排序后的时间段数组
 */
export const getUniquePeriods = (timelines) => {
  const periods = [...new Set(timelines.map(t => t.period))];
  return periods.sort((a, b) => a - b);
};
