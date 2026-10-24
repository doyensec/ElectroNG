const { notarize } = require('electron-notarize');
const { build } = require('../../package.json');

exports.default = async function notarizeMacos(context) {

  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (!process.env.CI) {
    console.warn('Skipping notarizing step. Packaging is not running in CI');
    return;
  }

  // Required in CI. Do not commit real values.
  // APPLE_ID=your-apple-id@example.com
  // APPLE_APP_SPECIFIC_PASSWORD=xxxx-xxxx-xxxx-xxxx
  // APPLE_TEAM_ID=XXXXXXXXXX
  // Code signing is handled by electron-builder via:
  // CSC_LINK=base64-encoded-p12
  // CSC_KEY_PASSWORD=p12-password
  // CSC_NAME=certificate-name-or-sha1 (optional; selects the signing identity)
  const appleId = process.env.APPLE_ID;
  const appleIdPassword = process.env.APPLE_APP_SPECIFIC_PASSWORD;
  const teamId = process.env.APPLE_TEAM_ID;

  if (!appleId || !appleIdPassword || !teamId) {
    throw new Error(
      'Notarization requires APPLE_ID, APPLE_APP_SPECIFIC_PASSWORD, and APPLE_TEAM_ID environment variables.'
    );
  }

  const appName = context.packager.appInfo.productFilename;
  console.log("Trying to notarize...")
  await notarize({
    tool: "notarytool",
    appBundleId: build.appId,
    appPath: `${appOutDir}/${appName}.app`,
    appleId,
    appleIdPassword,
    teamId,
  });
};
