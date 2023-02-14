import { bumpedVersion } from "./helpers";

import { setOutput } from '@actions/core'
import { readFile, writeFile } from 'fs'
import { Output } from "./types";

const versionCodeRegex = new RegExp(/^(\s*versionCode(?:\s|=)\s*)(\d+.*)/, "g");
const versionNameRegex = new RegExp(/(versionName(?:\s|=)*)(.*)/, "g");

export function bumpAndroidValues({ androidPath, versionCode, bumpType }: { androidPath: string; versionCode: string; bumpType: string }) {
  const gradlePath = `${androidPath}/app/build.gradle`

  readFile(gradlePath, 'utf8', (_, data) => {
    const fileLines = data.split("\n")
    const versionCodeLineIndex = fileLines.findIndex(line => line.match(versionCodeRegex))
    const versionNameLineIndex = fileLines.findIndex(line => line.match(versionNameRegex))

    const versionCodeLine = fileLines[versionCodeLineIndex].split(' ')
    const versionNameLine = fileLines[versionNameLineIndex].split(' ')
    const currentVersionCode = versionCodeLine.pop()
    const currentVersionName = versionNameLine.pop().replace(new RegExp('"', 'g'), '')
    const nextVersionCode = parseInt(versionCode || currentVersionCode) + 1
    const nextVersionName = bumpedVersion(currentVersionName, bumpType)

    fileLines[versionCodeLineIndex] = `${versionCodeLine.join(' ')} ${nextVersionCode}`
    fileLines[versionNameLineIndex] = `${versionNameLine.join(' ')} "${nextVersionName}"`

    writeFile(gradlePath, fileLines.join("\n"), function (err) {
      if (err) throw err;
      setOutput(Output.AndroidVersion, nextVersionName)
      setOutput(Output.AndroidVersionCode, nextVersionCode)
    });
  })
}

