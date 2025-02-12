# 健康助手

一款通过智能提醒帮助您保持健康工作习惯的 Chrome 扩展。

## 用途

健康助手有一个核心目标：通过及时的提醒来保护您在长时间工作时的健康：

- 喝水休息（每120分钟）
- 工作休息（每45分钟）
- 眼睛保护（每60分钟）
- 坐姿检查（每30分钟）

## 工作原理

1. 在后台安静运行
2. 按照科学建议的时间间隔发送温和提醒
3. 追踪您的每日进度
4. 适应您的工作时间表

## 主要好处

- 预防脱水
- 减轻眼疲劳
- 避免久坐
- 保持良好姿势

## 隐私优先

- 离线工作
- 本地存储数据
- 不收集个人信息

## Features

### 1. Timely Reminders
- Water Reminder (every 120 minutes)
- Break Reminder (every 45 minutes)
- Eye Protection (every 60 minutes)
- Posture Reminder (every 30 minutes)

### 2. Custom Reminders
- Add personalized reminders
- Customize reminder intervals
- Set independent active time periods

### 3. Work Hours Control
- Set work time range (default 09:00-18:00)
- Enable/disable time control

### 4. Statistics
- Track daily reminder completion counts
- Visual statistics display

### 5. Internationalization
- Chinese support
- English support

## Reminder Types

1. Water Reminder
   - Default reminder every 120 minutes
   - Help maintain adequate water intake

2. Break Reminder
   - Default reminder every 45 minutes
   - Avoid prolonged sitting, protect your health

3. Eye Protection
   - Default reminder every 60 minutes
   - Remind you to give your eyes proper rest

4. Posture Reminder
   - Default reminder every 30 minutes
   - Help maintain correct posture

## Usage Instructions

1. After installing the extension, click the extension icon in the toolbar to open the main interface
2. You can view the default health reminder items
3. Click the "+" button to add a custom reminder
4. You can adjust the work time range in the settings
5. Notifications will be displayed when reminders are triggered, and a notification sound will be played

## 技术支持

如果您在使用过程中遇到任何问题，或有任何建议，请通过以下方式联系我们：
- 在 GitHub 上提交 Issue
- 发送邮件至 [您的邮箱]

## 许可证

[添加许可证信息]

## 可靠性保障

- 即使浏览器关闭也能正常工作
- 定时器状态自动检查和修复
- 提醒失败自动重试
- 多重备份提醒机制

## 注意事项

- 请确保允许扩展显示通知
- 建议允许扩展在后台运行
- 如遇提醒异常，扩展会自动修复

## 技术需求

### 基础配置
- manifest.json 配置文件
- 支持 Chrome 扩展程序的基本权限设置
- 支持通知权限

### 核心功能
1. 定时提醒
   - 喝水提醒：默认每隔120分钟（2小时）提醒一次
   - 休息提醒：默认每隔45分钟提醒一次
   - 用户可自定义喝水提醒间隔（90-180分钟）
   - 用户可自定义休息提醒间隔（45-60分钟）
   - 基于科学建议，提供健康作息指导

2. 用户界面
   - 简洁的弹出窗口界面
   - 显示距离下次提醒的剩余时间
   - 提供个性化设置选项
   - 显示今日健康习惯统计

3. 数据存储
   - 使用 Chrome Storage API 存储用户设置
   - 记录用户每日喝水和休息次数

### 健康建议
- 每45-60分钟工作休息5-10分钟
- 休息时建议：
  - 起身走动，活动筋骨
  - 眼睛远眺，缓解疲劳
  - 适当伸展和颈部运动
  - 避免长时间保持同一姿势

## 技术栈
- HTML
- CSS
- JavaScript
- Chrome Extension API

## 预期文件结构 