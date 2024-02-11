import random from "random";
import { spawn } from "child_process";

const OFFSET = 0.025;
const start_END = 1 * 60 + 34;
const start_FILE = "02 Start.mp3";
const PATH = "C:\\Users\\Tyson\\Music\\iTunes\\iTunes Media\\Music\\Douglas Holmquist\\Smash Hit OST";

const parts = {
    1: {
        end: 2 * 60 + 8,
        file: "03 Part 1.mp3"
    },
    2: {
        end: 3 * 60 + 12,
        file: "04 Part 2.mp3"
    },
    3: {
        end: 3 * 60 + 12,
        file: "05 Part 3.mp3"
    },
    4: {
        end: 2 * 60 + 8,
        file: "06 Part 4.mp3"
    },
    5: {
        end: 2 * 60 + 40,
        file: "07 Part 5.mp3"
    },
    6: {
        end: 2 * 60 + 24,
        file: "08 Part 6.mp3"
    },
    7: {
        end: 2 * 60 + 8,
        file: "09 Part 7.mp3"
    },
    8: {
        end: 2 * 60 + 8,
        file: "10 Part 8.mp3"
    },
    9: {
        end: 2 * 60 + 8,
        file: "11 Part 9.mp3"
    },
    10: {
        end: 3 * 60 + 12,
        file: "12 Part 10.mp3"
    },
    11: {
        end: 3 * 60 + 12,
        file: "13 Part 11.mp3"
    },
}

const toMix: Array<keyof typeof parts> = [];
for (let i = 0; i < 100; ++i) {
    toMix.push(random.int(1, 11) as keyof typeof parts);
}

console.log(toMix);

let delay = start_END;
const inputs: string[] = [`-i "${start_FILE}"`];
const delayFilters: string[] = [];
const delayFilterOutputs: string[] = [];
for (let i = 0; i < toMix.length; i++) {
    const fileIndex = i + 1;
    const { end, file } = parts[toMix[i]];
    inputs.push(`-i "${file}"`);
    const delayFilterOutput = `[${fileIndex}a]`;
    delayFilters.push(`[${fileIndex}]adelay=${delay}s|${delay}s${delayFilterOutput}`);
    delayFilterOutputs.push(delayFilterOutput);
    delay += end;
}

const command = `cd ${PATH} && ffmpeg ${inputs.join(" ")} -filter_complex "${delayFilters.join("; ")}; [0:a]${delayFilterOutputs.join("")}amix=${delayFilterOutputs.length + 1}:normalize=false[a]" -map "[a]" -q:a 0 "C:\\Users\\Tyson\\Downloads\\asdf.mp3"`;
const proc = spawn(command, { shell: true, stdio: "inherit" });
(async () => {
    await new Promise((resolve) => {
        proc.on("close", resolve);
    });
    console.log("done");
})();