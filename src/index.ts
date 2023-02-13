import { setFailed, getInput } from "@actions/core"
import { bumpAndroidVersion, bumpVersionCode } from "./android"
import { bumpBuildNumber, bumpIosVersion } from "./ios"
import { Input } from "./types"

const run = () => {
  const androidPath = getInput(Input.AndroidProjectPath)
  const iosPath = getInput(Input.IosProjectPath)
  const bumpType = getInput(Input.BumpType)
  const versionCode = getInput(Input.VersionCode)
  const buildNumber = getInput(Input.BuildNumber)

  if (iosPath) {
    bumpBuildNumber(iosPath, parseInt(buildNumber))
    if (bumpType) bumpIosVersion(iosPath, bumpType)
  }

  if (androidPath) {
    bumpVersionCode(androidPath, parseInt(versionCode))
    if (bumpType) bumpAndroidVersion(androidPath, bumpType)
  }
}

try {
  run()
} catch (error) {
  setFailed(error.message)
}
