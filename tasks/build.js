const concurrently = require("concurrently");
const path = require("path");
const logger = require("../logger.js");
const runTask = require("./run");
const fs = require("fs");

function createBuildCommand(packageManager, name, pathName) {
  const pmRun =
    packageManager === "npm" ? `${packageManager} run` : packageManager;
  const command = `${packageManager} install && ${pmRun} build`;
  return { command, name, cwd: path.resolve(__dirname, `${pathName}`) };
}

runTask((packageManager) => {
  fs.rmSync(path.resolve(__dirname, "../build"), {
    recursive: true,
    force: true,
  });
  logger.info(`*******Run with ${packageManager}********`);

  const commands = [
    createBuildCommand(packageManager, "solid-shell", "../solid-shell"),
    createBuildCommand(packageManager, "solid-about", "../solid-about"),
    createBuildCommand(packageManager, "angular-contact", "../angular-contact"),
    createBuildCommand(packageManager, "react-home", "../react-home"),
    createBuildCommand(packageManager, "svelte-product", "../svelte-product"),
    createBuildCommand(packageManager, "vue-cart", "../vue-cart"),
  ];

  const { result } = concurrently(commands, {
    successCondition: "all",
    hide: true,
  });
  result.then(
    () => {
      logger.success("******* Build all projects successed *******");
      const commonBuildPath = path.resolve(__dirname, "../build");
      fs.mkdirSync(commonBuildPath, { recursive: true });

      // List each micro frontend's build folder (assumed under "dist")
      const projects = [
        { name: "solid-shell", dir: "../solid-shell/dist" },
        { name: "solid-about", dir: "../solid-about/dist" },
        { name: "angular-contact", dir: "../angular-contact/dist" },
        { name: "react-home", dir: "../react-home/dist" },
        { name: "svelte-product", dir: "../svelte-product/dist" },
        { name: "vue-cart", dir: "../vue-cart/dist" },
      ];

      // Copy each project's build folder into a subfolder of the common build folder
      projects.forEach((project) => {
        const srcPath = path.resolve(__dirname, project.dir);
        const destPath = path.resolve(commonBuildPath, project.name);
        if (fs.existsSync(srcPath)) {
          fs.cpSync(srcPath, destPath, { recursive: true });
          logger.success(`Copied ${project.name} build to ${destPath}`);
        } else {
          logger.error(
            `Build directory not found for ${project.name} at ${srcPath}`
          );
        }
      });
    },
    (err) => console.error(err)
  );
});
