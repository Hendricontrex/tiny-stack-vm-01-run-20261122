# tiny-stack-vm

A small exact interpreter for make.fun's tiny stack ISA (v1): 32-bit
wrapping integers, a 256-value stack, 64-deep calls, 256 words of
memory, and all ten traps with their exact exit codes.

Run: `node main.ts` (Node 22). It reads `/input/<id>/{program,input}.bin`
and writes `/output/<id>/{stdout.bin,exit.txt}` for every instance it
finds; override the directories with `MAKEFUN_INPUT_DIR` and
`MAKEFUN_OUTPUT_DIR`.
