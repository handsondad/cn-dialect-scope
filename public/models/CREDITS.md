# 3D 角色模型来源

| 文件 | 原始资源 | 作者 | 许可 |
| --- | --- | --- | --- |
| `character.glb` | Ultimate Animated Character Pack · `Casual_Male` | Quaternius（quaternius.com） | CC0 1.0 |

- 小念和爸爸共用这一个模型：运行时各自克隆一份，用不同的身高、头身比例和配色区分，爸爸另外加了一副眼镜。

- 获取镜像：`github.com/wellmota/tutory-personagens`（`quaternius-uac/`，仓库内附 CC0 许可说明）。
- 本项目处理：只保留首页星球实际使用的 `Idle`、`Jump`、`Victory` 三个动作，剔除未引用的动作与孤立访问器并重排缓冲区，体积从 712 KB 降至约 320 KB；同时提取同视角首帧透明海报 `public/images/home-duo-poster.webp` 供首屏瞬时显示，空闲加载完成后平滑切换至实时 3D；底层网格用 glTF-Transform 做了 resample、prune、dedup、quantize（`KHR_mesh_quantization`）。
- 颜色、卡通着色、描边、脸红、汗珠、透视器官都在运行时由代码添加，原始文件里没有。
- CC0 不要求署名，这里记录来源是为了方便以后追溯和替换。
