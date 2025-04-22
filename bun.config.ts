
const build = await Bun.build({
    entrypoints: ["./src/server.ts"], // Adjust based on your project's entry file
    outdir: "./dist",
    format: "esm", // Change to "cjs" if you need CommonJS output
    minify: true, // Enables minification
    sourcemap: "none",
    target: "node",
    splitting: true,
    plugins: [],
});

if (!build.success) {
    console.error("Build failed", build.logs);
} else {
    console.log("Build successful!");
}
