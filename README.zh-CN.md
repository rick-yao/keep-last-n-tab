# Last Tab Keeper

[English](README.md)

Last Tab Keeper 是一个小型 Chrome 扩展，用来在关闭标签页后窗口只剩指定数量标签页时，保持浏览器窗口不被关闭。

它的行为类似 Firefox 的 `browser.tabs.closeWindowWithLastTab` 配置项。Chrome 没有提供同样的设置，所以这个扩展会监听标签页关闭事件，并在窗口达到受保护标签数量时立即打开一个空白标签页。

## 功能

- 在关闭最后几个标签页时保持 Chrome 窗口不被关闭。
- 可配置受保护标签数量。
- 默认值为 `1`，也就是关闭最后一个标签页时会创建一个替代的空白标签页。
- 替代的空白标签页会立即被激活。
- 按普通 Chrome 窗口分别生效。
- 不跟踪用户，不发起外部请求，也不读取页面内容。

## 示例

如果受保护标签数量设置为 `2`：

1. 某个窗口有 3 个标签页。
2. 你关闭其中一个标签页。
3. 这个窗口现在只剩 2 个标签页。
4. Last Tab Keeper 会立即打开并切换到一个空白标签页，让窗口恢复到 3 个标签页。

这样就能保护最后 2 个标签页，避免窗口被关闭。

## 从源码安装

1. 克隆或下载这个仓库。
2. 打开 `chrome://extensions`。
3. 启用 **开发者模式**。
4. 点击 **加载已解压的扩展程序**。
5. 选择这个项目目录。

## 配置

打开扩展设置页：

- 点击 Last Tab Keeper 工具栏图标，或
- 打开 `chrome://extensions`，找到 Last Tab Keeper，然后进入 **详情** > **扩展程序选项**。

将 **保留标签数** 设置为你希望扩展保护的标签页数量。

## 权限

这个扩展请求以下权限：

- `tabs`：用于检测标签页关闭事件，并创建替代的空白标签页。
- `storage`：用于保存受保护标签数量。

## 隐私

Last Tab Keeper 不收集、存储、传输或出售用户数据。它不会发起网络请求，也不会读取页面内容。

## 开发

这是一个普通的 Manifest V3 扩展，没有构建步骤。

常用本地检查命令：

```sh
python3 -m json.tool manifest.json
node --check background.js
node --check options.js
```

编辑文件后，在 `chrome://extensions` 里重新加载已解压的扩展。

## 自动发布

这个仓库包含一个 GitHub Actions workflow：`.github/workflows/release.yml`。

每次 push 到 `main` 分支时，workflow 会：

1. 校验扩展文件。
2. 构建一个用于解压安装的 `.zip` 文件。
3. 将扩展打包成 `.crx` 文件。
4. 创建一个标签为 `build-<short-commit-sha>` 的 GitHub Release。
5. 将 `.zip` 和 `.crx` 文件上传到该 release。

普通手动安装建议使用 release 里的 `.zip` 文件：

1. 下载 `.zip`。
2. 在本地解压。
3. 打开 `chrome://extensions`。
4. 启用 **开发者模式**。
5. 点击 **加载已解压的扩展程序**，选择解压后的目录。

不要用 **加载已解压的扩展程序** 选择 `.crx` 文件。Chrome 在这里需要的是目录；如果选择打包文件，可能会报 `CRX_FILE_NOT_READABLE`。

为了让每次 release 的扩展 ID 保持稳定，需要添加一个名为 `CRX_PRIVATE_KEY_BASE64` 的仓库 secret。release 构建要求这个 secret 存在。

如果你已经有 Chrome 扩展私钥文件，可以这样生成 secret 内容：

```sh
base64 -i extension.pem | pbcopy
```

然后在 GitHub 中添加复制出来的值：

`Settings` > `Secrets and variables` > `Actions` > `New repository secret`

如果没有配置 `CRX_PRIVATE_KEY_BASE64`，release workflow 会失败，而不是发布一个扩展 ID 不稳定的包。

release workflow 会从这个 secret 派生公钥，并只在 release 产物里的 `manifest.json` 中注入 `key` 字段。这样即使 `.zip` 被解压到不同本地目录，使用 **加载已解压的扩展程序** 安装时也能保持同一个扩展 ID。

如果你之前安装过旧 release 产生的重复扩展，需要先手动删除旧的重复项一次。之后只要继续使用同一个私钥签名，未来 release 应该会保持同一个扩展 ID。

## 许可证

目前还没有添加许可证。如果你希望其他人明确拥有使用、修改和再分发这个项目的权利，请在发布前添加许可证。
