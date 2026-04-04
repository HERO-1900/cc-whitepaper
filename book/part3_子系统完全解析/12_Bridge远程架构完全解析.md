# Bridge 远程架构完全解析

本章解析 Claude Code 的远程控制子系统——Bridge 如何让用户通过 claude.ai Web 界面操控本地运行的 Claude Code 实例，实现跨网络的 AI 编程协作。

## 本章导读

Bridge 是 Claude Code 2.1.88 中实现"远程控制"(Remote Control)的核心子系统。它让用户可以在 claude.ai 的 Web 界面上操控一个运行在本地机器上的 Claude Code 实例，实现跨网络的 AI 编程协作。

**技术比喻（OS 视角）**：Bridge 就像操作系统中的**SSH 远程命令执行**——本地机器运行一个守护进程等待指令，远端通过结构化消息（而非图形界面帧）发送命令并接收结果。Bridge 传输的是 JSON 格式的指令和响应，属于"远程命令"模型（类似 SSH / RPC），而非 RDP/VNC 那样的"远程渲染"模型。Bridge 的 Environment API 相当于 SSH 的会话管理，JWT 相当于 Kerberos 票据，而 Work Poll 循环则相当于消息泵。

> 💡 **通俗理解**：Bridge 像**通过对讲机指挥远方的施工队**——你（claude.ai 用户）通过对讲机发出指令（"把第 42 行改成 xxx"），施工队（本地 Claude Code）执行操作，然后用对讲机报告结果（"已完成，测试通过"）。关键区别是：这台对讲机不是直连的，中间有一个**调度中心**（Anthropic 中继服务器）负责转发所有消息——施工队和你都不需要知道对方的地址，只要各自连着调度中心就行。

### 🌍 行业背景：AI 编程工具的远程执行架构

"在 Web 界面操控本地/远程开发环境"是 AI 编程工具和云 IDE 共同面临的架构挑战，各家方案路线差异显著：

- **GitHub Codespaces / Copilot Workspace**：用户代码运行在 GitHub 托管的云端容器中，Web IDE（VS Code for Web）直接连接容器。不存在"本地↔远程"桥接问题，因为一切都在云端。但代价是用户必须信任 GitHub 托管代码。
- **Cursor（Remote SSH）**：继承 VS Code 的 Remote SSH 架构——在远程机器上运行 `cursor-server`，通过 SSH 隧道传输 LSP 和文件操作。这是成熟的方案但需要 SSH 访问权限。
- **Gitpod / DevPod**：专注于开发环境的容器化和远程连接，通过 WebSocket 代理实现浏览器到容器的实时通信，与 Claude Code Bridge 的 WebSocket 隧道方案最为接近。
- **JetBrains Gateway**：Client-Server 分离架构，本地运行轻量客户端，远程运行完整 IDE 后端，通过自有协议（非 SSH）连接。
- **VS Code Server (code-server)**：将 VS Code 完整运行在服务端，浏览器作为纯渲染层，通过 WebSocket 传输 UI 更新。
- **ngrok / Cloudflare Tunnel**：通用的内网穿透方案，将本地服务暴露到公网。Bridge 的 Environment 注册 + 服务器中继模式在概念上与这类隧道工具相似——都通过中间服务器转发流量。
- **Replit Agent**：AI 和代码都运行在 Replit 云端容器中，用户通过 Web 界面观看和干预。这与 Bridge 的"AI 在云端调度、代码在本地执行"形成鲜明对照——Replit 不需要 Bridge，但用户必须将代码托管在 Replit 平台上，丧失了本地执行的安全和灵活性。
- **Cline / Aider 等开源 AI Agent**：Cline（原 Claude Dev）通过 VS Code 扩展运行，天然继承 VS Code 的 Remote SSH 能力，不需要自建 Bridge 协议。Aider 完全在本地运行，没有远程控制能力。这些"无 Bridge"的选择恰好是 Claude Code 设计 Bridge 的反面参照——Claude Code 需要自建远程架构，正是因为它选择了独立于编辑器的 CLI 形态。

Claude Code 的 Bridge 采用了**服务器中继（Server Relay）**模式。这是整个 Bridge 架构中最核心的设计决策，值得展开分析其 trade-off：

**为什么不选 P2P 直连或 SSH 隧道？**

| 维度 | 服务器中继（Bridge 方案） | P2P 直连 | SSH 隧道（Cursor 方案） |
|------|-------------------------|----------|----------------------|
| **部署门槛** | **零配置**——用户无需开放端口、配置防火墙或管理密钥 | 需要 NAT 穿透（STUN/TURN），在企业防火墙后经常失败 | 需要 SSH 服务端、密钥对、端口开放 |
| **延迟** | 所有数据经 Anthropic 服务器转发，增加一跳 RTT | 直连延迟最低 | SSH 直连延迟低，但需要可达的公网 IP |
| **可用性** | Anthropic 服务器宕机 = **所有 Bridge 连接断开**（单点故障） | 无中心依赖 | 依赖 SSH 服务端可用性 |
| **隐私** | 所有指令和代码经过 Anthropic 服务器——对隐私敏感用户可能是 showstopper | 数据不经第三方 | 数据不经第三方 |
| **成本** | 中继带宽和计算成本由 Anthropic 承担，规模化后成本压力大 | 无中间成本 | 用户自担 SSH 服务器成本 |
| **离线/气隔环境** | **不可用**——必须连接 Anthropic 服务器 | 局域网内可用 | 局域网内可用 |

选择服务器中继的核心动机是**零配置**：Anthropic 的目标用户群包括不熟悉网络配置的开发者，"登录即可远程控制"的体验远比"先配置 SSH 密钥和端口转发"友好。这是一个用**运维复杂度换用户体验**的经典取舍——与 Cursor 选择 SSH 隧道（低延迟、无中心依赖、但需要 SSH 配置）形成鲜明对照。

这个决策也带来了一个值得关注的安全含义：Anthropic 的中继服务器成为了所有远程会话的**单点信任锚**。如果中继服务器被入侵，攻击者理论上可以监听所有 Bridge 会话的代码操作。结合 Work Secret 中可能包含的 `environment_variables`（API Key 等敏感信息），这构成了一个不可忽视的攻击面。对于企业级部署，这可能需要自托管中继服务器或端到端加密来缓解。

CCR v2 从轮询迁移到 SSE 推送是正确的演进方向——减少延迟和资源浪费，这也是 Web 实时通信从长轮询向 SSE/WebSocket 演进的行业大趋势。更长远来看，如果 MCP 协议的 SSE transport 成为 Agent 远程连接的通用标准，Bridge 子系统可能面临向 MCP over SSE 收敛的重构。

## 架构总览

Bridge 子系统位于 `src/bridge/` 目录，共 31 个文件，总代码量超过 45 万字节——这在 Claude Code 整体代码库中属于中大型子系统，体量与 MCP 子系统相当，反映了远程控制场景下认证、传输、并发、错误恢复等维度的固有复杂性。核心架构分为三层：

```
┌─────────────────────────────────────────────┐
│         claude.ai Web UI (远端)              │
│   用户在浏览器中输入指令                       │
└────────────────────┬────────────────────────┘
                     │ HTTPS / WebSocket
                     ▼
┌─────────────────────────────────────────────┐
│       Anthropic 服务器 (中继层)              │
│   Session Ingress / Environments API        │
│   JWT 签发 / Work 分发 / 心跳管理            │
└────────────────────┬────────────────────────┘
                     │ HTTPS Poll / SSE
                     ▼
┌─────────────────────────────────────────────┐
│       本地 Claude Code (Bridge 端)           │
│   bridgeMain.ts - 轮询调度主循环              │
│   replBridge.ts - REPL 会话桥接              │
│   remoteBridgeCore.ts - 无环境层直连          │
└─────────────────────────────────────────────┘
```

## 核心文件索引

| 文件 | 行数 | 职责 |
|------|------|------|
| `bridgeMain.ts` | ~2800 | 独立 bridge 守护进程主循环（`claude remote-control`） |
| `replBridge.ts` | ~2500 | REPL 内嵌 bridge（`/remote-control` 命令） |
| `remoteBridgeCore.ts` | ~1000 | 无 Environment 层的直连核心（CCR v2） |
| `bridgeApi.ts` | ~540 | REST API 客户端（注册/轮询/ACK/停止/心跳） |
| `jwtUtils.ts` | ~257 | JWT 解码与 Token 刷新调度器 |
| `trustedDevice.ts` | ~211 | 可信设备注册与令牌管理 |
| `capacityWake.ts` | ~57 | 容量唤醒信号原语 |
| `types.ts` | ~263 | 所有 Bridge 类型定义 |
| `workSecret.ts` | ~128 | Work Secret 解码与 SDK URL 构建 |
| `bridgeMessaging.ts` | ~400 | 消息过滤、控制请求处理 |

## 1. Bridge 握手流程

### 1.1 环境注册（Environment Registration）

Bridge 启动时的第一步是向服务器注册一个"环境"（Environment），这相当于在远程控制系统中"挂牌上线"。

源码位于 `bridgeApi.ts` 第 142-197 行：

```typescript
async registerBridgeEnvironment(
  config: BridgeConfig,
): Promise<{ environment_id: string; environment_secret: string }> {
  const response = await withOAuthRetry(
    (token: string) =>
      axios.post<{
        environment_id: string
        environment_secret: string
      }>(
        `${deps.baseUrl}/v1/environments/bridge`,
        {
          machine_name: config.machineName,
          directory: config.dir,
          branch: config.branch,
          git_repo_url: config.gitRepoUrl,
          max_sessions: config.maxSessions,
          metadata: { worker_type: config.workerType },
        },
        {
          headers: getHeaders(token),
          timeout: 15_000,
          validateStatus: status => status < 500,
        },
      ),
    'Registration',
  )
  // ...
  return response.data
}
```

注册时携带的信息包括：机器名、工作目录、Git 分支、仓库 URL、最大会话数、Worker 类型。服务器返回 `environment_id` 和 `environment_secret`，后续所有 API 调用都依赖这两个凭证。

### 1.2 架构演进：从有状态到无状态的范式迁移

Claude Code 的 Bridge 经历了一次根本性的架构演进——从 v1 的"有状态长连接"到 v2 的"无状态按需连接"。这不只是 API 路径的简化，而是整个**状态管理模型**的范式迁移，其意义类似于 Web 架构从 Session-based 认证到 Stateless JWT-based 认证的转变。

> 💡 **通俗理解**：v1 像去政府部门办事——先到窗口**登记**（注册 Environment），领号排队**等叫号**（轮询 Work），被叫到后**签字确认**（ACK），办完事**销号**（注销 Environment）。全程依赖"登记簿"上你的状态记录。v2 像用手机 App 下单——每次直接提交请求，App 自动验证你的身份（OAuth → JWT），不需要先"挂号"，服务端不维护你的"在场状态"。

#### v1：基于 Environment 的有状态通道

传统通道（`replBridge.ts` + `bridgeMain.ts`）的完整生命周期：
1. POST `/v1/environments/bridge` → 注册环境，获取 `environment_id`
2. GET `/v1/environments/{id}/work/poll` → 轮询等待任务
3. POST `/v1/environments/{id}/work/{workId}/ack` → 确认接收
4. WebSocket 连接 → 实时消息传输
5. POST `/v1/environments/{id}/work/{workId}/heartbeat` → 心跳续租
6. POST `/v1/environments/{id}/stop` → 注销环境

在这个模型中，服务器维护**长生命周期的 Environment 状态**（注册→活跃→注销）。`environment_id` 是一个有状态的锚点——服务器需要持续跟踪每个 Environment 的存活情况、当前会话数、心跳时间。这带来了显而易见的问题：状态同步的复杂性（客户端崩溃后 Environment 变成"僵尸"怎么办？）、轮询带来的延迟和资源浪费、以及注册/注销生命周期的 5 个额外 HTTP 往返。

#### v2：Env-less 无状态直连——Bridge 的未来

CCR v2（`remoteBridgeCore.ts`）是 Bridge 架构的演进方向，也是本章最重要的技术创新。如 `remoteBridgeCore.ts` 第 1-29 行的注释所述：

```
// "Env-less" = no Environments API layer.
// 1. POST /v1/code/sessions              (OAuth, no env_id)  → session.id
// 2. POST /v1/code/sessions/{id}/bridge  (OAuth)             → {worker_jwt, expires_in}
//    Each /bridge call bumps epoch — it IS the register.
// 3. createV2ReplTransport(worker_jwt, worker_epoch)         → SSE + CCRClient
// 4. createTokenRefreshScheduler                             → proactive /bridge re-call
// 5. 401 on SSE → rebuild transport with fresh /bridge credentials
```

注意关键设计：**`Each /bridge call bumps epoch — it IS the register`**。在 v1 中，"注册"和"工作"是两个独立步骤；在 v2 中，每次 `/bridge` 调用本身就是注册——没有独立的注册/注销生命周期，状态变成了**短暂的、按需创建的**。这里的 `epoch` 就像一个单调递增的版本号，每次调用都刷新，服务端只需要记住最新的 epoch 即可，旧连接自动失效。

v2 还将传输协议从 HTTP 轮询升级为 **SSE（Server-Sent Events）推送**，彻底消除了轮询延迟。

这条更简洁的连接路径通过 GrowthBook 的 `tengu_bridge_repl_v2` 特性门控逐步灰度发布，v1 和 v2 双通道并行运行——Feature Flag 驱动的灰度发布是业界标准实践，但在协议层面维护双通道并行确实需要额外的工程投入。

#### v1 → v2 迁移的架构意义

| 维度 | v1（Environment-based） | v2（Env-less） |
|------|------------------------|----------------|
| 状态模型 | 服务器维护长生命周期状态 | 按需创建，无持久状态 |
| 注册方式 | 独立的注册/注销 API | 每次调用即注册（bump epoch） |
| 传输协议 | HTTP 轮询 | SSE 推送 |
| 故障恢复 | 需要处理僵尸 Environment | 自然过期，无需清理 |
| API 往返 | 5+ 次（注册→轮询→ACK→心跳→注销） | 2 次（创建 Session → Bridge 调用） |
| 类比 | 有状态的 TCP 连接 | 无状态的 HTTP + JWT |

这与微服务架构从 Session-based 到 Stateless Token-based 的演进高度相似——v1 的 `environment_id` 类似于服务器端的 Session ID，需要集中式状态存储；v2 的 Worker JWT 自带所有上下文信息，服务端无需维护会话状态。对于从事分布式系统设计的读者，这是一个值得细品的架构决策。

## 2. 会话隧道（Session Tunneling）

### 2.1 Work Secret 解码

当服务器通过轮询分配一个任务时，返回的 `WorkResponse` 中包含一个 `secret` 字段——这是 base64url 编码的 JSON，包含连接会话所需的一切信息。

使用 base64url（而非标准 base64）是刻意的设计选择——base64url 不含 `+` `/` `=` 字符，可以安全地嵌入 URL 参数和 HTTP 头，无需额外转义。将所有连接信息打包为单一 opaque token 而非多个参数，简化了 API 设计和传输。这种"单 token 携带全部上下文"的模式在业界有成熟先例：Stripe 的 PaymentIntent `client_secret`、GitHub 的 Installation Token 都采用了类似设计。

`workSecret.ts` 第 6-32 行：

```typescript
export function decodeWorkSecret(secret: string): WorkSecret {
  const json = Buffer.from(secret, 'base64url').toString('utf-8')
  const parsed: unknown = jsonParse(json)
  if (!parsed || typeof parsed !== 'object' || 
      !('version' in parsed) || parsed.version !== 1) {
    throw new Error(`Unsupported work secret version`)
  }
  // 验证必需字段
  if (typeof obj.session_ingress_token !== 'string' ||
      obj.session_ingress_token.length === 0) {
    throw new Error('Invalid work secret: missing session_ingress_token')
  }
  return parsed as WorkSecret
}
```

WorkSecret 的类型定义（`types.ts` 第 29-51 行）揭示了它的完整结构：

```typescript
export type WorkSecret = {
  version: number
  session_ingress_token: string     // JWT 用于 WebSocket 认证
  api_base_url: string              // API 基地址
  sources: Array<{                  // Git 源信息
    type: string
    git_info?: { type: string; repo: string; ref?: string; token?: string }
  }>
  auth: Array<{ type: string; token: string }>  // 认证令牌
  claude_code_args?: Record<string, string>      // CLI 参数
  mcp_config?: unknown                           // MCP 配置
  environment_variables?: Record<string, string>  // 环境变量
  use_code_sessions?: boolean                     // CCR v2 标志
}
```

### 2.2 SDK URL 构建与传输协议

解码完 Work Secret 后，需要构建连接 URL。根据协议版本不同，有两种 URL 构建方式：

```typescript
// V1: WebSocket URL（传统路径）
export function buildSdkUrl(apiBaseUrl: string, sessionId: string): string {
  const protocol = isLocalhost ? 'ws' : 'wss'
  const version = isLocalhost ? 'v2' : 'v1'  // 本地直连用 v2，生产经过 Envoy 代理用 v1
  const host = apiBaseUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '')
  return `${protocol}://${host}/${version}/session_ingress/ws/${sessionId}`
}

// V2: HTTP URL（CCR v2 路径，基于 SSE）
export function buildCCRv2SdkUrl(apiBaseUrl: string, sessionId: string): string {
  return `${base}/v1/code/sessions/${sessionId}`
}
```

### 2.3 多会话并发管理

`bridgeMain.ts` 第 83-98 行展示了多会话的特性门控：

```typescript
const SPAWN_SESSIONS_DEFAULT = 32

async function isMultiSessionSpawnEnabled(): Promise<boolean> {
  return checkGate_CACHED_OR_BLOCKING('tengu_ccr_bridge_multi_session')
}
```

在 `runBridgeLoop` 中，Bridge 维护了丰富的会话状态映射（第 163-194 行）：

- `activeSessions`: 活跃会话 Map（sessionId → SessionHandle）
- `sessionStartTimes`: 会话启动时间
- `sessionWorkIds`: 会话对应的工作 ID
- `sessionCompatIds`: 兼容层会话 ID 缓存
- `sessionIngressTokens`: 会话 JWT 令牌
- `completedWorkIds`: 已完成工作 ID 集合
- `timedOutSessions`: 超时被杀的会话集合

## 3. JWT 管理

### 3.1 JWT 解码（不验签）

> 🔄 **竞品对照**：认证凭证的管理是远程控制系统的核心问题，各家方案差异显著。Cursor 继承 VS Code Remote SSH 架构，使用 **SSH 密钥对**认证——没有过期和刷新的复杂性，但面临密钥分发和撤销的难题（用户必须手动管理 `~/.ssh/`）。JetBrains Gateway 使用 JetBrains Account 的 OAuth Token。ngrok 使用长期有效的 API Key。Bridge 选择了 **短期 JWT + 主动刷新**的方案，在安全性（短期令牌 + 自动轮换）和复杂度（需要刷新调度器）之间取了折中。

`jwtUtils.ts` 提供了一个轻量级的 JWT 解码器，注意——**不验证签名**，仅解析 payload：

```typescript
export function decodeJwtPayload(token: string): unknown | null {
  // 如果有 sk-ant-si- 前缀（Session Ingress Token），先剥离
  const jwt = token.startsWith('sk-ant-si-')
    ? token.slice('sk-ant-si-'.length)
    : token
  const parts = jwt.split('.')
  if (parts.length !== 3 || !parts[1]) return null
  try {
    return jsonParse(Buffer.from(parts[1], 'base64url').toString('utf8'))
  } catch {
    return null
  }
}
```

这里有一个有趣的细节：Session Ingress Token 带有 `sk-ant-si-` 前缀，这不是标准 JWT 格式的一部分，需要先剥离才能解码。

### 3.2 主动刷新调度器

> 📚 **课程关联（计算机网络/分布式系统）**：JWT 的主动刷新调度器体现了分布式系统中**租约续期**（Lease Renewal）的经典模式——客户端持有一个有时效的凭证（租约），需要在过期前主动续期。"提前 5 分钟刷新"的缓冲机制避免了"刚好过期"的竞态条件，这与 DHCP 租约续约（在 T1=50% 和 T2=87.5% 时间点尝试续约）、Kerberos 票据刷新等网络协议中的做法一脉相承。代际计数器（generation counter）则是处理异步竞态的标准手法，在数据库的乐观并发控制（OCC）中也有类似应用。

JWT 管理的核心是 `createTokenRefreshScheduler`（第 72-256 行），这是一个设计周全的定时刷新系统：

```typescript
export function createTokenRefreshScheduler({
  getAccessToken,
  onRefresh,
  label,
  refreshBufferMs = TOKEN_REFRESH_BUFFER_MS,  // 默认 5 分钟
}: { ... }): {
  schedule: (sessionId: string, token: string) => void
  scheduleFromExpiresIn: (sessionId: string, expiresInSeconds: number) => void
  cancel: (sessionId: string) => void
  cancelAll: () => void
}
```

关键设计要素：

1. **提前刷新缓冲**：默认在过期前 5 分钟刷新（`TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000`）
2. **后备刷新间隔**：如果无法解码新 Token 的过期时间，使用 30 分钟的后备间隔
3. **失败重试上限**：最多连续失败 3 次后放弃（`MAX_REFRESH_FAILURES = 3`）
4. **代际计数器**：每个会话维护一个递增的 generation 编号，用于检测过期的异步刷新回调

代际机制（第 96-100 行）是处理异步竞态的标准手法：

```typescript
function nextGeneration(sessionId: string): number {
  const gen = (generations.get(sessionId) ?? 0) + 1
  generations.set(sessionId, gen)
  return gen
}
```

当 `doRefresh` 异步执行返回时，会检查当前代际是否与启动时一致。如果不一致，说明该会话已被取消或重新调度，当前刷新结果应该被丢弃——这避免了"幽灵定时器"问题。这种代际检查模式在异步编程中是标准实践（React 的 useEffect 清理、Go 的 context cancellation、数据库乐观并发控制等都使用类似机制），Bridge 的实现中规中矩地应用了这一模式。

> 📚 **课程关联（操作系统）**：容量唤醒（Capacity Wake）机制中的 AbortController 信号合并，本质上是操作系统中**一次性事件通知**（one-shot event）的 JavaScript 实现。`wake()` 通过 `abort()` 触发信号后，必须创建新的 AbortController 才能再次使用——这更接近 Linux 的 `eventfd` 的一次性语义，而非 `pthread_cond_signal()` 的可重复等待语义（条件变量可以反复 `wait` / `signal`，AbortController 一旦 abort 就不可复用）。`signal()` 返回的合并信号等价于 `select()` / `poll()` 的多路复用——任何一个事件源触发都会唤醒等待者。这比使用锁/互斥量更轻量，也更符合 JavaScript 的事件驱动模型。

## 4. 可信设备（Trusted Device）

### 4.1 设计背景

> 🔄 **竞品对照**：远程执行环境如何确认"发出指令的设备是可信的"？SSH 方案（Cursor、VS Code Remote）依赖 SSH 密钥——密钥本身就是设备信任的证明，但丢失密钥 = 丢失访问权。GitHub Codespaces 在云端运行，通过浏览器 Session + 2FA 验证用户身份，不涉及设备信任。Bridge 引入了**独立的可信设备层**，在 OAuth 认证之上增加设备级信任——这使得即使 OAuth Token 泄露，攻击者在未注册的设备上也无法建立 Bridge 连接。

Bridge 会话在服务器端拥有 `SecurityTier=ELEVATED` 的安全级别。可信设备机制为这种高安全级别提供额外的身份验证层。

`trustedDevice.ts` 第 15-31 行的注释清楚地解释了双开关设计：

```
// Bridge 会话在服务器端有 SecurityTier=ELEVATED
// 服务器侧开关: sessions_elevated_auth_enforcement（控制服务器是否检查）
// CLI 侧开关: tengu_sessions_elevated_auth_enforcement（控制是否发送 Token）
// 两个开关分开，可以分阶段灰度：先打开 CLI 侧（开始发送 Header），
// 再打开服务器侧（开始强制校验）
```

### 4.2 设备注册流程

注册发生在 `/login` 之后立即执行（第 98-210 行）：

```typescript
export async function enrollTrustedDevice(): Promise<void> {
  // 1. 检查特性门控
  if (!(await checkGate_CACHED_OR_BLOCKING(TRUSTED_DEVICE_GATE))) return

  // 2. 获取 OAuth Token
  const accessToken = getClaudeAIOAuthTokens()?.accessToken
  if (!accessToken) return

  // 3. 发起注册请求
  response = await axios.post(
    `${baseUrl}/api/auth/trusted_devices`,
    { display_name: `Claude Code on ${hostname()} · ${process.platform}` },
    { headers: { Authorization: `Bearer ${accessToken}` }, timeout: 10_000 }
  )

  // 4. 持久化到 Keychain
  storageData.trustedDeviceToken = token
  secureStorage.update(storageData)
}
```

注册时提交的 `display_name` 格式为 `"Claude Code on <hostname> · <platform>"`，例如 `"Claude Code on MacBook-Pro · darwin"`。

### 4.3 Token 读取与缓存

读取函数使用 `lodash-es/memoize` 进行缓存，避免每次 API 调用都触发 macOS `security` 命令（约 40ms 开销）：

```typescript
const readStoredToken = memoize((): string | undefined => {
  const envToken = process.env.CLAUDE_TRUSTED_DEVICE_TOKEN  // 环境变量优先
  if (envToken) return envToken
  return getSecureStorage().read()?.trustedDeviceToken
})
```

在 `bridgeApi.ts` 的请求头中，Token 通过 `X-Trusted-Device-Token` Header 发送。

## 5. Capacity Wake 容量唤醒

`capacityWake.ts` 是一个精巧的并发原语，仅 57 行代码，解决了一个具体问题：当 Bridge 的会话数达到上限时，它会进入"容量满"睡眠；当某个会话结束释放了容量，需要**立即唤醒**轮询循环去接受新任务。

```typescript
export function createCapacityWake(outerSignal: AbortSignal): CapacityWake {
  let wakeController = new AbortController()

  function wake(): void {
    wakeController.abort()           // 中断当前睡眠
    wakeController = new AbortController()  // 立即创建新的，准备下次
  }

  function signal(): CapacitySignal {
    const merged = new AbortController()
    const abort = (): void => merged.abort()
    outerSignal.addEventListener('abort', abort, { once: true })
    const capSig = wakeController.signal
    capSig.addEventListener('abort', abort, { once: true })
    return {
      signal: merged.signal,
      cleanup: () => {
        outerSignal.removeEventListener('abort', abort)
        capSig.removeEventListener('abort', abort)
      },
    }
  }

  return { signal, wake }
}
```

这里用了"信号合并"模式——将外部关闭信号和容量唤醒信号合并为一个 AbortSignal，任何一个触发都会唤醒睡眠。`replBridge.ts` 和 `bridgeMain.ts` 两个文件之前各自复制了这段逻辑，后来被抽取到独立模块中。

## 6. 安全机制深度分析

### 6.1 路径遍历防御

`bridgeApi.ts` 第 41-53 行对所有服务器返回的 ID 进行严格验证：

```typescript
const SAFE_ID_PATTERN = /^[a-zA-Z0-9_-]+$/

export function validateBridgeId(id: string, label: string): string {
  if (!id || !SAFE_ID_PATTERN.test(id)) {
    throw new Error(`Invalid ${label}: contains unsafe characters`)
  }
  return id
}
```

这防止了 `../../admin` 这样的路径遍历攻击——如果服务器被入侵或返回了恶意 ID，客户端不会盲目拼接进 URL。

### 6.2 OAuth 401 重试

所有需要认证的请求都经过 `withOAuthRetry` 包装（第 106-139 行），在收到 401 时自动刷新 Token 并重试一次。这与 `withRetry.ts` 的模式一致，确保 Token 过期不会导致操作失败。

### 6.3 致命错误分类

`BridgeFatalError` 类（第 56-66 行）专门用于不应该重试的错误：

- 401: 认证失败 → 提示重新登录
- 403: 权限拒绝或会话过期
- 404: 功能不可用
- 410: 会话已过期（Gone）

而 429（限流）和其他错误则允许重试。

## 7. Session ID 兼容层

由于 CCR v2 的引入，同一个会话可能有两种 ID 前缀：`session_*`（兼容层）和 `cse_*`（基础设施层）。`workSecret.ts` 的 `sameSessionId` 函数通过比较最后一个下划线之后的部分来判断：

```typescript
export function sameSessionId(a: string, b: string): boolean {
  if (a === b) return true
  const aBody = a.slice(a.lastIndexOf('_') + 1)
  const bBody = b.slice(b.lastIndexOf('_') + 1)
  return aBody.length >= 4 && aBody === bBody
}
```

> ⚠️ **技术债务警告**：这个实现存在已知的碰撞风险。它假设"下划线之后的部分"是全局唯一的，但 `aBody.length >= 4` 的最低长度检查意味着仅靠 4 个字符来判断等价性。在大规模并发场景下，任何以相同后缀结尾的不同会话都会被误判为同一会话。这是一个为了兼容 v1/v2 双 ID 体系而引入的 workaround，而非一个健壮的设计——在 ID 生成策略保证后缀唯一性之前，它是一个需要跟踪的潜在故障点。

## 批判性分析

### 优点

1. **v1→v2 的范式迁移**：从有状态 Environment 到无状态 Env-less 的演进，是 Bridge 架构最有价值的设计决策。"每次 /bridge 调用即注册"消除了服务器端状态管理的复杂性，这在 Cursor/JetBrains Gateway 等依赖持久连接的竞品中没有看到类似的架构演进思路
2. **双通道渐进式迁移**：通过 Feature Flag 让 v1/v2 并行运行，降低了协议迁移风险。Feature Flag 灰度本身是业界标准，但在传输协议层面维护双通道并行（而非 API 版本化）需要额外的工程投入
3. **零配置的用户体验决策**：选择服务器中继而非 SSH 隧道，用服务端复杂度换取客户端零配置——这是一个有明确 trade-off 意识的产品决策，而非单纯的技术选择
4. **安全纵深防御**：路径验证 + 可信设备 + OAuth 刷新 + JWT 轮换 + 10 分钟注册窗口，多层保护形成了比 SSH 密钥单因素认证更丰富的安全模型

### 不足

1. **代码量巨大**：`bridgeMain.ts`（115KB）和 `replBridge.ts`（100KB）体积惊人，两者之间存在大量相似逻辑，抽取 `bridgeMessaging.ts` 和 `capacityWake.ts` 只是开始
2. **JWT 不验签**：`decodeJwtPayload` 明确不验证签名。由于 JWT 通过 HTTPS 从 Anthropic 服务器接收，传输层注入需要先突破 TLS——如果 TLS 已被突破，验不验签都无意义。不验签的真正风险场景在于：(a) 本地存储的 JWT 被篡改后重新加载，(b) 调试/测试时使用了非安全传输通道。这是一个务实的工程选择，但威胁模型应当明确
3. **轮询模式的效率**：传统的 Environment 通道仍然依赖轮询（poll），而非推送（push），存在延迟和资源浪费，虽然 CCR v2 的 SSE 正在解决这个问题
4. **可信设备的安全窗口**：`enrollTrustedDevice` 要求注册必须在登录后 10 分钟内完成（`account_session.created_at < 10min`）。这个时间窗口乍看是"局限"，实则是深思熟虑的安全决策——它确保只有刚完成交互式登录（证明用户在场）的设备才能注册为可信设备，防止了"偷到 OAuth Token 后在另一台机器上静默注册可信设备"的攻击路径。代价是延迟注册方案无法实现
5. **403 状态码的语义补偿**：`BridgeFatalError` 对 403 的处理区分了"会话过期"和"权限不足"，`isSuppressible403` 的存在体现了对 HTTP 状态码语义不足的工程补偿——403 在不同上下文中含义差异巨大（"永远不行" vs "现在不行"），用 `isSuppressible` 来区分是务实的设计，但增加了代码的认知负担，后续维护者需要理解每个 403 场景的具体语义
