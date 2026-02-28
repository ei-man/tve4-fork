const assert = require("assert");
const fs = require("fs-extra");
const path = require("path");
const { getAddonName, getDotaPath } = require("./utils");

const resolveRealPath = filePath => {
    try {
        return fs.realpathSync(filePath);
    } catch (_) {
        return undefined;
    }
};

(async () => {
    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log("No Dota 2 installation found. Addon linking is skipped.");
        return;
    }

    const addonName = getAddonName();
    for (const directoryName of ["game", "content"]) {
        const sourceRoot = path.resolve(__dirname, "..", directoryName);
        const nestedSourcePath = path.join(sourceRoot, addonName);
        const sourcePath = fs.existsSync(nestedSourcePath) ? nestedSourcePath : sourceRoot;
        assert(fs.existsSync(sourcePath), `Could not find '${sourcePath}'`);

        const targetRoot = path.join(dotaPath, directoryName, "dota_addons");
        assert(fs.existsSync(targetRoot), `Could not find '${targetRoot}'`);

        const targetPath = path.join(targetRoot, addonName);
        if (fs.existsSync(targetPath)) {
            const sourceRealPath = resolveRealPath(sourcePath);
            const targetRealPath = resolveRealPath(targetPath);
            const isCorrect = sourceRealPath !== undefined && sourceRealPath === targetRealPath;
            if (isCorrect) {
                console.log(`Skipping '${targetPath}' since it already points to '${sourcePath}'`);
                continue;
            } else {
                throw new Error(`'${targetPath}' is already linked to another directory`);
            }
        }

        fs.symlinkSync(sourcePath, targetPath, "junction");
        console.log(`Linked ${targetPath} -> ${sourcePath}`);
    }
})().catch(error => {
    console.error(error);
    process.exit(1);
});
