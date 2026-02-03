import Setting from '../Setting'
import { cn2twTable, tw2cnTable } from './zhConversion'

/**
 * 性能优化版繁简转换
 * 使用正则表达式批量匹配代替传统的逐字/逐词循环
 */
export function chineseConversion(text) {
  const mode = Setting.chineseConversion;
  if (mode === 'disable' || !text) return text;

  // 根据模式选择对应的字库表
  // to-cn (繁转简) 使用 tw2cnTable
  // to-tw (简转繁) 使用 cn2twTable
  const table = mode === 'to-cn' ? tw2cnTable : cn2twTable;

  // 检查是否已经生成过正则缓存，如果没有则初始化
  if (!table._cacheRegex) {
    // 1. 获取所有键（需要转换的词/字）
    // 2. 按照长度倒序排序：确保长词优先匹配（如先匹配“长门”再匹配“长”），防止误转
    const keys = Object.keys(table).sort((a, b) => b.length - a.length);
    
    // 3. 构建正则表达式：将词语用 | 连接，并对正则特殊符号进行转义
    table._cacheRegex = new RegExp(
      keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 
      'g'
    );
  }

  // 执行批量替换：正则匹配到哪个词，就去 table 里找对应的转换值
  return text.replace(table._cacheRegex, (matched) => table[matched]);
}
