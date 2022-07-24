/**
 * Aliases to the node api provided by preload.ts.
 * Much easier than typing out window.node.[..] everytime.
 *
 * Typing set in global.d.ts may show all node functions
 * but many of them haven't been added in the preload.ts file,
 * only the ones being used have. If something doesn't work,
 * make sure it is defined in the preload.ts file.
 */

export const FS = window.node.fs;
export const Path = window.node.path;
export const OS = window.node.os;
export const Process = window.node.process;
export const ChildProcess = window.node.childProcess;
export const HTTPS = window.node.https;
