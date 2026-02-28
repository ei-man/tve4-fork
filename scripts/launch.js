const { spawn } = require("child_process");
const path = require("path");
const { getAddonName, getDotaPath } = require("./utils");

(async () => {
    const dotaPath = await getDotaPath();
    const win64 = path.join(dotaPath, "game", "bin", "win64");

    // You can add any arguments there
    // For example `+dota_launch_custom_game ${getAddonName()} dota` would automatically load "dota" map
    const args = ["-novid", "-tools", "-addon", getAddonName()];
    const dota = spawn(path.join(win64, "dota2.exe"), args, {
        cwd: win64,
        stdio: "ignore",
    });

    let devProcess = null;

    const killProcessTree = (child) => {
        if (!child || child.exitCode !== null) {
            return;
        }
        if (process.platform === "win32") {
            spawn("taskkill", ["/PID", String(child.pid), "/T", "/F"]);
        } else {
            try {
                process.kill(-child.pid, "SIGTERM");
            } catch (_) {
                try {
                    child.kill("SIGTERM");
                } catch (_) {}
            }
        }
    };

    const startDev = () => {
        if (devProcess) {
            return;
        }
        const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
        devProcess = spawn(npmCmd, ["run", "dev"], {
            stdio: "inherit",
            detached: process.platform !== "win32",
        });
    };

    dota.once("spawn", startDev);
    dota.once("exit", () => {
        killProcessTree(devProcess);
    });

    process.on("SIGINT", () => {
        killProcessTree(devProcess);
        try {
            dota.kill("SIGTERM");
        } catch (_) {}
        process.exit(0);
    });

    process.on("SIGTERM", () => {
        killProcessTree(devProcess);
        try {
            dota.kill("SIGTERM");
        } catch (_) {}
        process.exit(0);
    });
})().catch(error => {
    console.error(error);
    process.exit(1);
});
