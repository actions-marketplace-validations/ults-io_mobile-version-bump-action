import { bumpedVersion } from "./helpers";

import { setOutput } from '@actions/core'
import { readFile, writeFile } from 'fs'
import { Output } from "./types";

const versionCodeRegex = new RegExp(/^(\s*versionCode(?:\s|=)\s*)(\d+.*)/, "g")
const versionNameRegex = new RegExp(/(versionName(?:\s|=)*)(.*)/, "g")

export function bumpAndroidValues({ androidPath, versionCode, bumpType }: { androidPath: string; versionCode: string; bumpType: string }) {
  const gradlePath = `${androidPath}/app/build.gradle`

  readFile(gradlePath, 'utf8', (_, data) => {
    const currentVersionName = data.match(versionNameRegex)[0].split("=")[1].trim();
    const currentVersionCode = data.match(versionCodeRegex)[0].split("=")[1].trim();
    const nextVersionCode = parseInt(versionCode || currentVersionCode) + 1
    const nextVersionName = bumpedVersion(currentVersionName, bumpType)

    const nextData = data
      .replace(versionCodeRegex, `$1${nextVersionCode}`)
      .replace(versionNameRegex, `$1\"${nextVersionName}\"`)

    writeFile(gradlePath, nextData, function (err) {
      if (err) throw err;
      setOutput(Output.AndroidVersion, nextVersionName)
      setOutput(Output.AndroidVersionCode, nextVersionCode)
    });
  });
}

