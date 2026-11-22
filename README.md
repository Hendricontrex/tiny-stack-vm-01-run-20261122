# tiny-stack-vm

A fast, exact interpreter for make.fun's tiny stack ISA (v1): 32-bit wrapping
ints, 256-value stack, 64-deep calls, 256 words of memory, all ten traps with
their exact exit codes, step (1,000,000) and output (65,536) limits.

Run: `node main.ts` (Node 22; reads `/input/<id>/{program,input}.bin`,
writes `/output/<id>/{stdout.bin,exit.txt}`; override with
`MAKEFUN_INPUT_DIR` / `MAKEFUN_OUTPUT_DIR`).
