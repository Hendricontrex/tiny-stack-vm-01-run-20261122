// Tiny stack VM, ISA v1 — exact interpreter. Node 22 stdlib only.
// /input/<id>/{program,input}.bin ($MAKEFUN_INPUT_DIR) in,
// /output/<id>/{stdout.bin,exit.txt} ($MAKEFUN_OUTPUT_DIR) out.
import {mkdirSync,readdirSync,readFileSync,writeFileSync} from "node:fs";
import {join} from "node:path";
const ID=process.env.MAKEFUN_INPUT_DIR||"/input";
const OD=process.env.MAKEFUN_OUTPUT_DIR||"/output";
function run(p,bin){
 const s=[],r=[],m=new Int32Array(256),o=[];
 let pc=0,ip=0,n=0;
 const T=c=>{throw c};
 const need=k=>{if(s.length<k)T(2)};
 const push=v=>{s.push(v|0);if(s.length>256)T(3)};
 const put=b=>{if(o.length>=65536)T(11);o.push(b)};
 const prt=t=>{if(o.length+t.length>65536)T(11);for(let i=0;i<t.length;i++)o.push(t.charCodeAt(i))};
 const g=s=>{if(pc+2>=p.length)T(9);const v=p[pc+1]|p[pc+2]<<8;return s?v<<16>>16:v};
 try{for(;;){
  if(n>=1e6)T(10);
  if(pc<0||pc>=p.length)T(9);
  const op=p[pc];let a,b;
  n++;
  switch(op){
   case 0:return[0,o];
   case 1:if(pc+1>=p.length)T(9);push((p[pc+1]<<24)>>24);pc+=2;break;
   case 2:if(pc+4>=p.length)T(9);push(p[pc+1]|p[pc+2]<<8|p[pc+3]<<16|p[pc+4]<<24);pc+=5;break;
   case 3:need(1);s.pop();pc++;break;
   case 4:need(1);push(s[s.length-1]);pc++;break;
   case 5:need(2);a=s.pop();b=s.pop();s.push(a,b);pc++;break;
   case 6:need(2);push(s[s.length-2]);pc++;break;
   case 7:need(3);a=s.pop();b=s.pop();s.push(b,a,s.pop());pc++;break;
   case 0x10:need(2);b=s.pop();a=s.pop();push(a+b);pc++;break;
   case 0x11:need(2);b=s.pop();a=s.pop();push(a-b);pc++;break;
   case 0x12:need(2);b=s.pop();a=s.pop();push(Math.imul(a,b));pc++;break;
   case 0x13:need(2);b=s.pop();a=s.pop();if(!b)T(4);push(Math.trunc(a/b));pc++;break;
   case 0x14:need(2);b=s.pop();a=s.pop();if(!b)T(4);push(a%b);pc++;break;
   case 0x15:need(2);b=s.pop();a=s.pop();if(!b)T(4);push(Math.trunc((a>>>0)/(b>>>0)));pc++;break;
   case 0x16:need(2);b=s.pop();a=s.pop();if(!b)T(4);push((a>>>0)%(b>>>0));pc++;break;
   case 0x17:need(1);push(-s.pop());pc++;break;
   case 0x18:need(2);b=s.pop();a=s.pop();push(a&b);pc++;break;
   case 0x19:need(2);b=s.pop();a=s.pop();push(a|b);pc++;break;
   case 0x1a:need(2);b=s.pop();a=s.pop();push(a^b);pc++;break;
   case 0x1b:need(1);push(~s.pop());pc++;break;
   case 0x1c:need(2);b=s.pop();a=s.pop();push(a<<(b&31));pc++;break;
   case 0x1d:need(2);b=s.pop();a=s.pop();push(a>>(b&31));pc++;break;
   case 0x1e:need(2);b=s.pop();a=s.pop();push(a>>>(b&31));pc++;break;
   case 0x20:need(2);b=s.pop();a=s.pop();push(a===b?1:0);pc++;break;
   case 0x21:need(2);b=s.pop();a=s.pop();push(a<b?1:0);pc++;break;
   case 0x22:need(2);b=s.pop();a=s.pop();push((a>>>0)<(b>>>0)?1:0);pc++;break;
   case 0x30:pc=pc+3+g(1);break;
   case 0x31:a=g(1);need(1);pc=s.pop()===0?pc+3+a:pc+3;break;
   case 0x32:a=g(1);need(1);pc=s.pop()!==0?pc+3+a:pc+3;break;
   case 0x33:a=g(0);if(r.length>=64)T(7);r.push(pc+3);pc=a;break;
   case 0x34:if(!r.length)T(8);pc=r.pop();break;
   case 0x40:need(1);a=s.pop();if(a<0||a>255)T(6);push(m[a]);pc++;break;
   case 0x41:need(2);a=s.pop();b=s.pop();if(a<0||a>255)T(6);m[a]=b;pc++;break;
   case 0x50:need(1);prt(String(s.pop()));pc++;break;
   case 0x51:need(1);put(s.pop()&255);pc++;break;
   case 0x52:push(ip<bin.length?bin[ip++]:-1);pc++;break;
   case 0x53:need(1);return[s.pop()&255,o];
   default:T(5);
  }
 }}catch(e){return[typeof e==="number"?e:1,o]}
}
for(const id of readdirSync(ID).sort()){
 const d=join(ID,id);
 const [code,out]=run(readFileSync(join(d,"program.bin")),readFileSync(join(d,"input.bin")));
 const od=join(OD,id);mkdirSync(od,{recursive:true});
 writeFileSync(join(od,"stdout.bin"),Buffer.from(out));
 writeFileSync(join(od,"exit.txt"),String(code));
}
