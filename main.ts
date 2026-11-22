import{mkdirSync,readdirSync,readFileSync,writeFileSync}from'node:fs';
import{join}from'node:path';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
function run(p,q){
 const D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536);
 let s=0,c=0,pc=0,st=0,ip=0,ol=0;
 const T=x=>({o:o.slice(0,ol),c:x});
 for(;;){
  if(st===1e6)return T(10);
  if(pc<0||pc>=p.length)return T(9);
  const op=p[pc];
  if(!(op<8||op>=16&&op<31||op>=32&&op<35||op>=48&&op<53||op>=64&&op<66||op>=80&&op<84))return T(5);
  const im=op===1?1:op===2?4:op>=48&&op<52?2:0;
  if(pc+im>=p.length)return T(9);
  st++;pc+=1+im;
  if((op>=16&&op<31||op>=32&&op<35)&&op!==23&&op!==27){
   if(s<2)return T(2);
   const b=D[s-1],a=D[s-2];let r;
   switch(op){
    case 16:r=a+b|0;break;
    case 17:r=a-b|0;break;
    case 18:r=Math.imul(a,b);break;
    case 19:if(!b)return T(4);r=a/b|0;break;
    case 20:if(!b)return T(4);r=a%b|0;break;
    case 21:if(!b)return T(4);r=Math.floor((a>>>0)/(b>>>0))|0;break;
    case 22:if(!b)return T(4);r=(a>>>0)%(b>>>0)|0;break;
    case 24:r=a&b;break;
    case 25:r=a|b;break;
    case 26:r=a^b;break;
    case 28:r=a<<(b&31);break;
    case 29:r=a>>(b&31);break;
    case 30:r=a>>>(b&31)|0;break;
    case 32:r=a===b?1:0;break;
    case 33:r=a<b?1:0;break;
    case 34:r=(a>>>0)<(b>>>0)?1:0;break;
   }
   D[s-2]=r;s--;continue;
  }
  switch(op){
   case 0:return T(0);
   case 1:if(s>255)return T(3);D[s++]=(p[pc-1]<<24)>>24;break;
   case 2:if(s>255)return T(3);D[s++]=p[pc-4]|p[pc-3]<<8|p[pc-2]<<16|p[pc-1]<<24;break;
   case 3:if(s<1)return T(2);s--;break;
   case 4:if(s<1)return T(2);if(s>255)return T(3);D[s]=D[s-1];s++;break;
   case 5:if(s<2)return T(2);{const t=D[s-1];D[s-1]=D[s-2];D[s-2]=t;}break;
   case 6:if(s<2)return T(2);if(s>255)return T(3);D[s]=D[s-2];s++;break;
   case 7:if(s<3)return T(2);{const a=D[s-3];D[s-3]=D[s-2];D[s-2]=D[s-1];D[s-1]=a;}break;
   case 23:if(s<1)return T(2);D[s-1]=-D[s-1]|0;break;
   case 27:if(s<1)return T(2);D[s-1]=~D[s-1];break;
   case 48:pc+=((p[pc-2]|p[pc-1]<<8)<<16)>>16;break;
   case 49:case 50:{if(s<1)return T(2);const v=D[--s];if((op===49)===(v===0))pc+=((p[pc-2]|p[pc-1]<<8)<<16)>>16;}break;
   case 51:if(c===64)return T(7);C[c++]=pc;pc=p[pc-2]|p[pc-1]<<8;break;
   case 52:if(!c)return T(8);pc=C[--c];break;
   case 64:if(s<1)return T(2);{const a=D[s-1];if(a<0||a>255)return T(6);D[s-1]=M[a];}break;
   case 65:if(s<2)return T(2);{const a=D[s-1];if(a<0||a>255)return T(6);M[a]=D[s-2];s-=2;}break;
   case 80:{if(s<1)return T(2);let v=D[--s],u=v,g=0,n=1,t;if(v<0){g=1;u=-v;}t=u;while(t>=10){t=(t/10)|0;n++;}const L=n+g;if(ol+L>65536)return T(11);let y=ol+L;t=u;do{o[--y]=48+t%10;t=(t/10)|0;}while(t>0);if(g)o[ol]=45;ol+=L;}break;
   case 81:if(s<1)return T(2);if(ol>65535)return T(11);o[ol++]=D[--s]&255;break;
   case 82:if(s>255)return T(3);D[s++]=ip<q.length?q[ip++]:-1;break;
   case 83:if(s<1)return T(2);return T(D[--s]&255);
  }
 }
}
for(const id of readdirSync(I).sort()){
 const r=run(new Uint8Array(readFileSync(join(I,id,'program.bin'))),new Uint8Array(readFileSync(join(I,id,'input.bin'))));
 mkdirSync(join(O,id),{recursive:true});
 writeFileSync(join(O,id,'stdout.bin'),r.o);
 writeFileSync(join(O,id,'exit.txt'),r.c+'\n');
}
