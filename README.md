# Last Tab Keeper

Last Tab Keeper is a small Chrome extension that keeps a browser window open when closing tabs would otherwise leave only a configured number of tabs.

It is inspired by Firefox's `browser.tabs.closeWindowWithLastTab` preference. Chrome does not expose the same setting, so this extension watches tab close events and immediately opens a blank tab when the active window reaches the protected tab threshold.

## Features

- Keeps Chrome windows alive when closing the last tabs.
- Configurable protected tab count.
- Defaults to `1`, which means closing the final tab creates a replacement blank tab.
- Works per normal Chrome window.
- No tracking, no external requests, and no page content access.

## Example

If the protected tab count is set to `2`:

1. A window has 3 tabs.
2. You close one tab.
3. The window now has 2 tabs.
4. Last Tab Keeper immediately opens a blank tab, bringing the window back to 3 tabs.

This keeps the final 2 tabs protected from closing the window.

## Install From Source

1. Clone or download this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project directory.

## Configuration

Open the extension options page:

- Click the Last Tab Keeper toolbar icon, or
- Go to `chrome://extensions`, find Last Tab Keeper, and open **Details** > **Extension options**.

Set **Protected tab count** to the number of tabs you want the extension to preserve.

## Permissions

This extension requests:

- `tabs`: to detect when tabs are closed and create a replacement blank tab.
- `storage`: to save the protected tab count.

## Privacy

Last Tab Keeper does not collect, store, transmit, or sell user data. It does not make network requests and does not read page content.

## Development

This is a plain Manifest V3 extension. There is no build step.

Useful local checks:

```sh
python3 -m json.tool manifest.json
node --check background.js
node --check options.js
```

After editing files, reload the unpacked extension from `chrome://extensions`.

## Automated Releases

This repository includes a GitHub Actions workflow at `.github/workflows/release.yml`.

On every push to `main`, the workflow:

1. Validates the extension files.
2. Packs the extension as a `.crx` file.
3. Creates a GitHub Release tagged as `build-<short-commit-sha>`.
4. Uploads the `.crx` file to that release.

For stable extension IDs across releases, add a repository secret named `CRX_PRIVATE_KEY_BASE64`.

To create the secret from an existing Chrome extension private key:

```sh
base64 -i extension.pem | pbcopy
```

Then add the copied value in GitHub:

`Settings` > `Secrets and variables` > `Actions` > `New repository secret`

If `CRX_PRIVATE_KEY_BASE64` is not configured, the workflow still creates a `.crx`, but Chrome generates a temporary signing key and the extension ID may change between releases.

## License

No license has been added yet. Add a license before publishing if you want others to have explicit rights to use, modify, and redistribute the project.
