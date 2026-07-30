// 辅助工具函数

/**
 * 获取角色的自定义名称，如果未设置则返回默认ID
 * @param {string} characterId - 角色ID
 * @param {Object} customNames - 自定义名称映射
 * @returns {string} 角色名称
 */
export const getCustomName = (characterId, customNames) => {
  return customNames?.[characterId] || characterId;
};

/**
 * 将文本中的角色ID替换为自定义名称
 * @param {string} text - 原始文本
 * @param {Object} customNames - 自定义名称映射
 * @returns {string} 替换后的文本
 */
export const replaceIdsWithNames = (text, customNames) => {
  if (!customNames) return text;
  
  let result = text;
  Object.entries(customNames).forEach(([id, name]) => {
    // 替换 [c1] 格式的引用
    result = result.replace(new RegExp(`\\[${id}\\]`, 'g'), `[${name}]`);
    // 替换单独的ID（谨慎使用）
    // result = result.replace(new RegExp(`\\b${id}\\b`, 'g'), name);
  });
  return result;
};

/**
 * 检查对话是否已解锁
 * @param {string} sceneId - 场景ID
 * @param {number} period - 时间段
 * @param {Array} unlockedDialogues - 已解锁对话列表
 * @returns {boolean} 是否已解锁
 */
export const isDialogueUnlocked = (sceneId, period, unlockedDialogues = []) => {
  const key = `${sceneId}_${period}`;
  return unlockedDialogues.includes(key);
};

/**
 * 获取某时空检测到的声纹数量
 * @param {string} sceneId - 场景ID
 * @param {number} period - 时间段
 * @param {Array} timelines - 时间线数据
 * @returns {number|null} 声纹数量，未找到返回null
 */
export const getDetectedVoices = (sceneId, period, timelines) => {
  const timeline = timelines.find(
    t => t.sceneId === sceneId && t.period === period
  );
  return timeline ? timeline.answer.length : null;
};

/**
 * 获取某时空的时间线数据
 * @param {string} sceneId - 场景ID
 * @param {number} period - 时间段
 * @param {Array} timelines - 时间线数据
 * @returns {Object|null} 时间线数据
 */
export const getTimelineData = (sceneId, period, timelines) => {
  return timelines.find(
    t => t.sceneId === sceneId && t.period === period
  ) || null;
};

/**
 * 验证匹配是否正确
 * @param {Array} selectedChars - 选择的角色ID数组
 * @param {Array} answerChars - 正确答案的角色ID数组
 * @returns {Object} {
 *   isCorrect: boolean,        // 完全正确（所有答案都选中且没有多余）
 *   hasPartialMatch: boolean,  // 部分正确（有正确答案但没有错误选择）
 *   hasError: boolean,         // 存在错误（选择了错误的角色）
 *   correctMatches: Array,     // 正确匹配的角色ID
 *   incorrectMatches: Array,   // 错误匹配的角色ID
 *   missingAnswers: Array      // 遗漏的答案角色ID
 * }
 */
export const validateMatch = (selectedChars, answerChars) => {
  const correctMatches = selectedChars.filter(id => answerChars.includes(id));
  const incorrectMatches = selectedChars.filter(id => !answerChars.includes(id));
  const missingAnswers = answerChars.filter(id => !selectedChars.includes(id));
  
  // 完全正确：所有答案都选中，且没有多余选择
  const isCorrect = correctMatches.length === answerChars.length && incorrectMatches.length === 0;
  
  // 部分正确：至少有一个正确答案，且没有错误选择（但还有遗漏）
  const hasPartialMatch = correctMatches.length > 0 && incorrectMatches.length === 0 && missingAnswers.length > 0;
  
  // 存在错误：选择了错误的角色
  const hasError = incorrectMatches.length > 0;
  
  return {
    isCorrect,
    hasPartialMatch,
    hasError,
    correctMatches,
    incorrectMatches,
    missingAnswers
  };
};

/**
 * 格式化部分匹配的对话文本
 * @param {Array} dialogues - 对话数组
 * @param {Object} customNames - 自定义名称映射
 * @param {Array} correctMatches - 正确匹配的角色ID数组
 * @param {Array} incorrectMatches - 错误匹配的角色ID数组
 * @returns {string} 格式化后的对话文本
 */
export const formatPartialDialogue = (dialogues, customNames, correctMatches, incorrectMatches) => {
  if (!dialogues || !Array.isArray(dialogues)) return '';
  
  return dialogues.map(d => {
    const name = getCustomName(d.characterId, customNames);
    
    if (correctMatches.includes(d.characterId)) {
      // 匹配正确的角色，显示正常对话
      return `[${name}]: ${d.line}`;
    } else if (incorrectMatches.includes(d.characterId)) {
      // 匹配错误的角色，显示[UNRESOLVED]
      return `[${name}]: [UNRESOLVED]`;
    } else {
      // 未选择的角色，不显示
      return null;
    }
  }).filter(line => line !== null).join('\n');
};

/**
 * 生成对话显示文本
 * @param {Array} dialogues - 对话数组
 * @param {Object} customNames - 自定义名称映射
 * @param {boolean|number} show - 是否展示整条对话（true/1=展示，false/0/null=隐藏）
 * @param {boolean} isUnlocked - 是否已解锁
 * @returns {string} 格式化后的对话文本
 */
export const formatDialogues = (dialogues, customNames, show, isUnlocked = false) => {
  if (!dialogues || !Array.isArray(dialogues)) return '';
  
  // 已解锁的对话始终显示全部内容
  if (isUnlocked) {
    return dialogues.map(d => {
      const name = getCustomName(d.characterId, customNames);
      return `[${name}]: ${d.line}`;
    }).join('\n');
  }
  
  // 未解锁时根据show字段决定是否显示
  if (show === true || show === 1) {
    // 显示全部对话（预览模式）
    return dialogues.map(d => {
      const name = getCustomName(d.characterId, customNames);
      return `[${name}]: ${d.line}`;
    }).join('\n');
  } else {
    // 隐藏整条对话
    return '[LOCKED DATA]\n' + '*'.repeat(20);
  }
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

/**
 * 获取某时间段某场景的已解锁角色
 * @param {string} sceneId - 场景ID
 * @param {number} period - 时间段
 * @param {Array} timelines - 时间线数据
 * @param {Array} unlockedDialogues - 已解锁对话列表
 * @returns {Array|null} 角色ID数组，未解锁返回null
 */
export const getUnlockedCharacters = (sceneId, period, timelines, unlockedDialogues) => {
  const key = `${sceneId}_${period}`;
  if (!unlockedDialogues.includes(key)) return null;
  
  const timeline = timelines.find(
    t => t.sceneId === sceneId && t.period === period
  );
  
  return timeline ? timeline.answer : null;
};
