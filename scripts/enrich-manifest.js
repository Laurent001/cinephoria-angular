const fs = require("fs");
const path = require("path");

const manifestPath = path.resolve(
  __dirname,
  "../android/app/src/main/AndroidManifest.xml"
);
let manifest = fs.readFileSync(manifestPath, "utf-8");

const permissions = [
  "android.permission.CAMERA",
  "android.permission.ACCESS_FINE_LOCATION",
  "android.permission.ACCESS_COARSE_LOCATION",
  "android.permission.READ_EXTERNAL_STORAGE",
  "android.permission.WRITE_EXTERNAL_STORAGE",
  "android.permission.READ_MEDIA_IMAGES",
];

const features = [
  `<uses-feature android:name="android.hardware.camera" android:required="false" />`,
  `<uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />`,
];

permissions.forEach((perm) => {
  const permissionTag = `<uses-permission android:name="${perm}" />`;
  if (!manifest.includes(permissionTag)) {
    manifest = manifest.replace(
      "</manifest>",
      `    ${permissionTag}\n</manifest>`
    );
  }
});

features.forEach((featureTag) => {
  if (!manifest.includes(featureTag)) {
    manifest = manifest.replace(
      "</manifest>",
      `    ${featureTag}\n</manifest>`
    );
  }
});

fs.writeFileSync(manifestPath, manifest, "utf-8");
