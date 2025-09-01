# 宝塔面板卸载指南

本指南提供了完整的宝塔面板卸载解决方案，包括数据备份和安全卸载流程。

## 📋 卸载脚本说明

### 1. 完整卸载脚本 (`uninstall-bt.sh`)
- **功能**: 完整的宝塔面板卸载，包含数据备份
- **特点**: 安全、可靠、支持数据恢复
- **推荐**: 生产环境使用

### 2. 快速卸载脚本 (`quick-uninstall-bt.sh`)
- **功能**: 基于官方步骤的快速卸载
- **特点**: 简单、快速、无备份
- **推荐**: 测试环境或确定不需要数据时使用

## 🚀 使用方法

### 方案一：完整卸载（推荐）

```bash
# 给脚本添加执行权限
chmod +x uninstall-bt.sh

# 交互式卸载（推荐）
sudo ./uninstall-bt.sh

# 跳过备份直接卸载
sudo ./uninstall-bt.sh --skip-backup

# 强制卸载不询问
sudo ./uninstall-bt.sh --force

# 卸载完成后自动重启
sudo ./uninstall-bt.sh --auto-reboot
```

### 方案二：快速卸载

```bash
# 给脚本添加执行权限
chmod +x quick-uninstall-bt.sh

# 快速卸载
sudo ./quick-uninstall-bt.sh
```

### 方案三：手动卸载

```bash
# 1. 停止宝塔面板服务
/etc/init.d/bt stop
systemctl stop bt
systemctl stop bt-panel

# 2. 删除宝塔面板目录
rm -rf /www/server/panel

# 3. 删除宝塔配置文件
rm -rf /etc/bt

# 4. 禁用宝塔服务
systemctl disable bt
systemctl disable bt-panel

# 5. 重启服务器
reboot
```

## 🛡️ 安全注意事项

### 卸载前准备

1. **备份重要数据**
   - 网站文件
   - 数据库
   - SSL 证书
   - 配置文件

2. **记录重要信息**
   - 数据库密码
   - 网站域名配置
   - 端口设置
   - 防火墙规则

3. **确认卸载范围**
   - 是否保留网站数据
   - 是否保留数据库
   - 是否清理防火墙规则

### 数据备份建议

```bash
# 备份网站数据
tar -czf websites-backup.tar.gz /www/wwwroot/

# 备份数据库
mysqldump --all-databases > all-databases.sql

# 备份 SSL 证书
tar -czf ssl-backup.tar.gz /www/server/panel/vhost/cert/

# 备份宝塔配置
tar -czf bt-config-backup.tar.gz /etc/bt/
```

## 📊 卸载流程详解

### 完整卸载流程（8 步）

1. **检查宝塔安装状态**
   - 检测宝塔目录
   - 检查系统服务
   - 验证进程状态

2. **备份重要数据**
   - 宝塔配置文件
   - 面板数据
   - 网站数据（可选）
   - MySQL 数据库（可选）

3. **停止宝塔服务**
   - 停止面板服务
   - 终止相关进程
   - 确保完全停止

4. **禁用宝塔服务**
   - 禁用系统服务
   - 删除服务文件
   - 重载 systemd

5. **删除宝塔文件**
   - 删除面板目录
   - 删除配置目录
   - 清理相关文件

6. **清理宝塔配置**
   - 清理定时任务
   - 删除环境变量
   - 清理启动脚本

7. **清理防火墙规则**
   - 删除宝塔端口规则
   - 清理相关防火墙配置

8. **验证卸载结果**
   - 检查残留文件
   - 验证服务状态
   - 确认卸载完成

### 快速卸载流程（6 步）

1. **停止宝塔服务**
2. **删除面板目录**
3. **删除配置文件**
4. **禁用系统服务**
5. **清理其他文件**
6. **验证卸载结果**

## 🔧 脚本参数说明

### uninstall-bt.sh 参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `--help` | 显示帮助信息 | `./uninstall-bt.sh --help` |
| `--skip-backup` | 跳过数据备份 | `./uninstall-bt.sh --skip-backup` |
| `--force` | 强制卸载，跳过确认 | `./uninstall-bt.sh --force` |
| `--auto-reboot` | 卸载完成后自动重启 | `./uninstall-bt.sh --auto-reboot` |

### 组合使用示例

```bash
# 强制卸载，跳过备份，自动重启
sudo ./uninstall-bt.sh --force --skip-backup --auto-reboot

# 仅跳过备份，其他交互式
sudo ./uninstall-bt.sh --skip-backup
```

## 🚨 故障排除

### 常见问题

1. **宝塔服务停不下来**
   ```bash
   # 强制终止进程
   pkill -9 -f "BT-Panel"
   pkill -9 -f "bt_panel"
   
   # 检查进程
   ps aux | grep -i bt
   ```

2. **目录删除失败**
   ```bash
   # 检查文件占用
   lsof +D /www/server/panel
   
   # 强制删除
   rm -rf /www/server/panel
   ```

3. **服务禁用失败**
   ```bash
   # 手动删除服务文件
   rm -f /etc/systemd/system/bt*
   rm -f /lib/systemd/system/bt*
   
   # 重载 systemd
   systemctl daemon-reload
   ```

4. **端口仍在监听**
   ```bash
   # 检查端口占用
   netstat -tlnp | grep 8888
   
   # 终止占用进程
   fuser -k 8888/tcp
   ```

### 验证卸载完成

```bash
# 检查宝塔目录
ls -la /www/server/panel
ls -la /etc/bt

# 检查宝塔进程
ps aux | grep -i bt | grep -v grep

# 检查宝塔服务
systemctl list-units --all | grep bt

# 检查端口监听
netstat -tlnp | grep -E "8888|888"
```

## 📝 卸载后清理

### 可选清理项目

1. **清理用户和组**
   ```bash
   # 删除宝塔用户（如果存在）
   userdel -r bt 2>/dev/null || true
   ```

2. **清理软件包**
   ```bash
   # 卸载宝塔安装的软件（谨慎操作）
   # 根据实际情况选择性卸载
   ```

3. **清理日志文件**
   ```bash
   # 清理系统日志中的宝塔记录
   journalctl --vacuum-time=1d
   ```

## 🔄 数据恢复

### 从备份恢复

1. **解压备份文件**
   ```bash
   tar -xzf bt-backup-*.tar.gz
   ```

2. **查看备份信息**
   ```bash
   cat bt-backup-*/backup-info.txt
   ```

3. **恢复配置文件**
   ```bash
   # 重新安装宝塔后恢复配置
   cp -r bt-backup-*/bt-config/* /etc/bt/
   ```

4. **恢复网站数据**
   ```bash
   cp -r bt-backup-*/wwwroot/* /www/wwwroot/
   ```

5. **恢复数据库**
   ```bash
   mysql < bt-backup-*/mysql/all-databases.sql
   ```

## ⚠️ 重要提醒

1. **数据安全**
   - 卸载前务必备份重要数据
   - 确认备份文件完整性
   - 测试数据恢复流程

2. **系统影响**
   - 卸载会删除所有宝塔管理的网站
   - 可能影响正在运行的服务
   - 建议在维护时间窗口执行

3. **网络安全**
   - 卸载后及时更新防火墙规则
   - 关闭不必要的端口
   - 检查系统安全状态

4. **服务连续性**
   - 如有重要服务运行，请提前迁移
   - 准备替代的管理方案
   - 确保业务不中断

---

**注意**: 宝塔面板卸载是不可逆操作，请谨慎执行并确保数据安全！
