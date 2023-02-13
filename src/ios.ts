import { setOutput } from "@actions/core"
import { getExecOutput } from "@actions/exec"
import { bumpedVersion } from "./helpers"
import { Output } from "./types"

export async function bumpIosVersion(path: string, bumpType: string) {
  const options = { cwd: path }
  const { stdout: currentIosVersion } = await getExecOutput("agvtool", ["what-marketing-version"], options)
  const version = bumpedVersion(currentIosVersion.toString().trim(), bumpType)

  const { stdout: iosVersion } = await getExecOutput("agvtool", ["new-marketing-version", version], options)
  setOutput(Output.IosVersion, iosVersion.toString().trim())
}

export async function bumpBuildNumber(path: string, buildNumber?: number) {
  const command = buildNumber ? "new-version" : "next-version"
  const { stdout: iosBuildNumber } = await getExecOutput("agvtool", [command, buildNumber?.toString()], { cwd: path })

  setOutput(Output.IosBuildNumber, iosBuildNumber.toString().trim())
}
