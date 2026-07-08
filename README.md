# ResumeAI - 智能简历分析平台

基于 Vue 3 + TypeScript + Vite 构建的 AI 简历解析与风险评估平台。

## 技术栈

- Vue 3 + Composition API
- TypeScript
- Vite
- Pinia（状态管理）
- Vue Router
- Axios

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器默认运行在 `http://localhost:5173`，Vite 已配置代理转发 `/api` 请求到后端。

## 构建生产版本

```bash
npm run build-only
```

构建产物输出到 `dist/` 目录。

## Nginx 部署

### 1. 上传构建产物

将 `dist/` 目录下的所有文件上传到服务器，例如 `/usr/share/nginx/html/resume-ai/`。

### 2. Nginx 配置

```nginx
server {
    listen       80;
    server_name  your-domain.com;

    # 前端静态文件（hash 路由模式，访问路径 /resume/）
    location /resume/ {
        alias  /usr/share/nginx/html/resume-ai/;
        index  index.html;
    }

    # API 转发到后端
    location /api/ {
        proxy_pass http://112.25.126.138:18380;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;
    }
}
```

### 3. 重启 Nginx

```bash
nginx -t          # 检查配置
nginx -s reload   # 重载配置
```

### 关键配置说明

| 配置项 | 说明 |
|--------|------|
| `location /resume/` | 页面访问前缀为 `/resume/`，如 `http://domain.com/resume/` |
| `alias /usr/share/nginx/html/resume-ai/` | 静态文件根目录 |
| `proxy_pass http://112.25.126.138:18380` | 后端 API 地址 |
| `proxy_read_timeout 120s` | 延长超时，简历解析可能耗时较长 |
