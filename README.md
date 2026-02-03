# My Novel Reader

[![Version](https://img.shields.io/badge/version-8.1.0-green.svg)](https://github.com/chaowushang/MyNovelReader)
[![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

本项目基于 [ywzhaiqi/MyNovelReader](https://github.com/ywzhaiqi/MyNovelReader) 进行二次开发与深度优化。
在（https://github.com/821938089/MyNovelReader8.0.5）的基础上进行修改

## 🚀 核心优化

相比原版，本项目主要在以下几个核心领域进行了改进：

1.  **翻页状态锁 (Paging Lock)**：引入了全新的异步请求状态锁。彻底解决了在网络延迟或快速滚动时，脚本重复请求同一章节导致内容乱序或加载多次的顽固 Bug。
2.  **提取性能飞跃**：
    *   **Set 级查重**：将传统的数组去重算法升级为 `Set` 集合算法，在大章节（万字以上）下的文本提取速度提升数倍。
    *   **正则批量转换**：重构了繁简转换引擎，利用正则表达式批量替换代替原有的逐字循环，极大降低了转换时的 CPU 占用。
3.  **深度广告过滤**：
    *   **物理移除干扰**：不仅移除可见广告，更增加了对 `display:none`、`aria-hidden` 等隐藏干扰元素的物理剔除，有效对抗现代盗版站的隐藏乱码干扰。
    *   **域名自动识别**：增强了对站点自我推广信息的识别与自动清理功能。
4.  **内存管理**：优化了 `iframe` 提取模式下的资源回收机制，在切换页面或翻页后更积极地释放浏览器内存，防止长时间阅读导致的内存泄漏。

## 📦 安装地址

**点击下方链接即可安装/更新：**

👉 [**安装 My Novel Reader (优化版)**](https://github.com/chaowushang/MyNovelReader/raw/master/scripts/MyNovelReader.user.js)

> **注意**：安装后，脚本会在符合条件的页面（如起点、笔趣阁镜像站等）自动启动。

## 🛠 修改说明

本项目在原始脚本的基础上修改了以下关键逻辑：
- `Parser.prototype.handleContentText2`: 重构了内容清洗流程。
- `registerControls`: 增加了 `isRequesting` 状态锁与预载阈值优化。
- `chineseConversion`: 优化为正则表达式批量匹配模式。
- `cleanupEvents`: 改进了事件卸载与内存回收。

## ⚖️ 开源协议
本项目遵循 **GPL-3.0** 协议开源。

# 注意事项

部分站点需要安装 `ignore-x-frame-headers` 扩展绕过 iframe 限制，否则脚本无法正常工作

安装扩展：
[Chrome][ignore-x-frame-options-chrome]
[Firefox][ignore-x-frame-options-firefox]

# 原作者主页

- [个人主页 - github][ywzhaiqi_github]
- [个人主页 - greasyfork.org][ywzhaiqi_greasyfork]
- [个人主页 - userscripts.org][ywzhaiqi_userscripts]

[ywzhaiqi_github]: https://github.com/ywzhaiqi/userscript
[ywzhaiqi_greasyfork]: https://greasyfork.org/users/145-ywzhaiqi
[ywzhaiqi_userscripts]: http://userscripts.org/users/138842/scripts
[install_github]: https://github.com/821938089/MyNovelReader/raw/master/scripts/MyNovelReader.user.js
[install_jsdelivr]: https://cdn.jsdelivr.net/gh/821938089/MyNovelReader@master/scripts/MyNovelReader.user.js
[siteExample]: /src/MyNovelReader/rule/siteExample.js
[siteExampleTs]: /src/MyNovelReader/rule/siteExample.ts
[ignore-x-frame-options-chrome]: https://chromewebstore.google.com/detail/ignore-x-frame-headers/ohgdnhkppgeemnmjebhedjneajcedppf
[ignore-x-frame-options-firefox]: https://addons.mozilla.org/firefox/addon/ignore-x-frame-options-header/



