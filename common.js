const SB_URL='https://rqtiuaiimyzuayctgrwk.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdGl1YWlpbXl6dWF5Y3RncndrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk3ODA1NjUsImV4cCI6MjEwNTM1NjU2NX0.26zCCI0Og1Gv4qK18I_Jq8VGHE2hRhXiuWnGEe5h4uA';
const HW_IMG='https://upload.wikimedia.org/wikipedia/commons/7/7a/AI-generated_deepfake_hoax_image_of_the_Hollywood_sign_during_the_2025_California_wildfires.jpg';
const SIG={rush:'เร่งให้รีบ ส่งต่อด่วน',exag:'อ้างผลเกินจริง',nosrc:'ไม่มีแหล่งที่มา',shot:'ภาพหน้าจอ ตรวจที่มาไม่ได้',personal:'ขอข้อมูลส่วนตัวหรือเงิน',ai:'ภาพหรือคลิปจาก AI',nomedia:'ไม่มีสื่อหลักรายงาน',emotion:'ปลุกให้ตกใจหรือกลัว'};
const TYPES={mis:'ข้อมูลผิดพลาด',dis:'ข้อมูลบิดเบือน',mal:'ข้อมูลที่มุ่งร้าย'};
const PLAT={web:'เว็บไซต์ข่าว',facebook:'เฟซบุ๊ก',tiktok:'ติ๊กต็อก',line:'ไลน์',sms:'ข้อความสั้น (SMS)'};
/* ---------- news items ---------- */
const Q=[
 {id:1,a:true,p:'web',outlet:'กรุงเทพธุรกิจ',cat:'เทคโนโลยี / AI',date:'14 ก.ค. 2569 เวลา 16:30 น.',
  h:'แคสเปอร์สกี้เตือน ดีปเฟกยุค AI สมจริงขึ้น ต้นทุนเริ่มราว 1,000 บาท',
  lead:'บริษัทด้านความปลอดภัยไซเบอร์ระบุว่า เสียงปลอมที่สร้างด้วย AI เริ่มต้นราว 30 ดอลลาร์สหรัฐ และวิดีโอปลอมเริ่มต้นราว 50 ดอลลาร์สหรัฐ มิจฉาชีพนำใบหน้านักร้องและนักแสดงมาทำคลิปชวนเล่นพนันออนไลน์',
  why:'ข่าวจริง กรุงเทพธุรกิจรายงานเมื่อ 14 ก.ค. 2569 ระบุแหล่งข้อมูลชัดเจน',good:['ระบุสำนักข่าว','ระบุวันที่','ระบุแหล่งข้อมูล'],kw:'แคสเปอร์สกี้ ดีปเฟก ต้นทุน 1,000 บาท'},
 {id:2,a:false,p:'facebook',page:'สุขภาพดีทุกวัน',av:'#16A34A',time:'2 ชม. สาธารณะ',
  h:'ดื่มน้ำมะนาวผสมโซดาร้อนทุกเช้า ฆ่าเซลล์มะเร็งได้หมดภายใน 7 วัน',
  text:'ความลับที่โรงพยาบาลไม่อยากให้คุณรู้\nดื่มน้ำมะนาวผสมโซดาร้อนทุกเช้า ฆ่าเซลล์มะเร็งได้หมดภายใน 7 วัน\nแชร์ให้คนที่คุณรักด่วน',img:['#F59E0B','#65A30D','น้ำมะนาวโซดาร้อน\nสูตรต้านมะเร็ง'],stat:['1.2 หมื่น','3,104 ความคิดเห็น','8,412 แชร์'],
  why:'หลอก (ข้อความสมมติ) อ้างผลการรักษาเกินจริง ไม่ระบุแพทย์ งานวิจัย หรือหน่วยงานใด',sig:['exag','nosrc','emotion'],kw:'น้ำมะนาวโซดาร้อน ฆ่ามะเร็ง ข่าวปลอม',
  facts:'เพจเปิดมาได้ 3 เดือน ผู้ติดตาม 2.1 หมื่นคน โพสต์ไม่ระบุแหล่งที่มา ภาพประกอบเป็นภาพตกแต่ง'},
 {id:3,a:true,p:'fblink',page:'ข่าวสังคมออนไลน์',av:'#DB2777',time:'23 ก.ย. 2566',
  text:'ใครในบ้านชอบส่งข่าวทางไลน์บ้าง',domain:'dailynews.co.th',h:'ดีอีเผย กลุ่มที่แชร์ข่าวปลอมมากที่สุดคือผู้ที่มีอายุ 40 ปีขึ้นไป',stat:['2,450','312 ความคิดเห็น','905 แชร์'],
  why:'ข่าวจริง เดลินิวส์รายงานเมื่อ 23 ก.ย. 2566 จากข้อมูลกระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม',good:['ลิงก์ไปสำนักข่าว','ระบุหน่วยงาน'],kw:'ดีอี แชร์ข่าวปลอม อายุ 40 ปีขึ้นไป เดลินิวส์'},
 {id:4,a:false,p:'line',group:'ผู้ปกครอง ม.6 (148)',from:'คุณแม่น้องเอ',time:'22:14',
  h:'กระทรวงศึกษาธิการประกาศงดสอบปลายภาคนักเรียน ม.6 ทั่วประเทศ ปีการศึกษา 2569',
  text:'ประกาศด่วน! กระทรวงศึกษาธิการประกาศงดสอบปลายภาคนักเรียน ม.6 ทั่วประเทศ ปีการศึกษา 2569 ให้ใช้คะแนนเก็บแทน\n(ส่งต่อจากกลุ่มอื่น)',
  why:'หลอก (ข้อความสมมติ) เป็นข้อความส่งต่อ ไม่มีเลขที่ประกาศ ไม่มีลิงก์ไปเว็บไซต์ทางการของกระทรวง',sig:['shot','nosrc','nomedia'],kw:'กระทรวงศึกษาธิการ งดสอบปลายภาค ม.6',
  facts:'ข้อความถูกส่งต่อมาจากกลุ่มอื่น ไม่มีภาพประกาศ ไม่มีเลขที่หนังสือ ไม่มีลิงก์'},
 {id:5,a:true,p:'web',outlet:'THE STANDARD',cat:'ธุรกิจ',date:'10 เม.ย. 2567',
  h:'ลาบูบู้ราคาป้ายราว 550 บาท แต่สีที่หายากถูกตั้งราคาขายต่อ 12,000–20,000 บาท',
  lead:'หลังศิลปินชื่อดังโพสต์ภาพถือกล่องอาร์ตทอย แฟนคลับทั้งในไทยและต่างประเทศพากันตามหาสินค้า ราคาขายต่อเฉลี่ยเพิ่มเป็น 1,000–1,300 บาท',
  why:'ข่าวจริง THE STANDARD รายงานเมื่อ 10 เม.ย. 2567',good:['ระบุสำนักข่าว','ระบุวันที่'],kw:'ลาบูบู้ ราคาขายต่อ THE STANDARD'},
 {id:6,a:false,p:'tiktok',acc:'@ข่าวด่วนทั่วโลก',img:HW_IMG,
  h:'ภาพป้ายฮอลลีวูดถูกไฟไหม้ระหว่างไฟป่าลอสแอนเจลิส เดือนมกราคม 2568',
  text:'ป้ายฮอลลีวูดไหม้แล้ว! ไฟป่าแอลเอลุกลามหนัก #ไฟป่า #ฮอลลีวูด',stat:['1.8M','2.3 หมื่น','9.1 หมื่น'],
  why:'หลอก ภาพนี้สร้างด้วย AI ป้ายฮอลลีวูดไม่ได้ถูกไฟไหม้ สำนักข่าวต่างประเทศตรวจสอบแล้วว่าเป็นภาพปลอม',sig:['ai','nomedia','emotion'],kw:'Hollywood sign fire AI image fact check',
  facts:'ภาพถูกแชร์ช่วงไฟป่าลอสแอนเจลิส ม.ค. 2568 ภาพดูเหมือนฉากภาพยนตร์ ไฟลุกเป็นแนวสวยงามผิดธรรมชาติ'},
 {id:7,a:true,p:'web',outlet:'ไทยพีบีเอส',cat:'เศรษฐกิจ',date:'29 เม.ย. 2567',
  h:'ถอดบทเรียนลาบูบู้ ต่อยอดผลิตอาร์ตทอยไทย',
  lead:'ปี 2566 ไทยนำเข้าของเล่นรวมอาร์ตทอยมูลค่า 128.26 ล้านดอลลาร์สหรัฐ เพิ่มขึ้นร้อยละ 11.79 ขณะที่ตำบลบ้านสิงห์ จังหวัดราชบุรี ส่งออกตุ๊กตาได้ปีละกว่า 1,000 ล้านบาท',
  why:'ข่าวจริง ไทยพีบีเอสรายงานเมื่อ 29 เม.ย. 2567 พร้อมตัวเลขและแหล่งข้อมูล',good:['ระบุสำนักข่าว','มีตัวเลขที่ตรวจสอบได้'],kw:'ไทยพีบีเอส ถอดบทเรียนลาบูบู้ อาร์ตทอยไทย'},
 {id:8,a:false,p:'sms',from:'+66 9x-xxx-xxxx',time:'วันนี้ 08:02',
  h:'ด่วน! ธนาคารแจกเงินเยียวยาน้ำท่วมหาดใหญ่ คนละ 5,000 บาท กรอกเลขบัญชีที่ลิงก์นี้ภายในวันนี้',
  text:'[ธนาคาร] ด่วน! แจกเงินเยียวยาน้ำท่วมหาดใหญ่ คนละ 5,000 บาท กรอกเลขบัญชีและรหัสที่ลิงก์นี้ภายในวันนี้ หมดเขต 18:00 น.\nxxxx-help.xyz/rcv',
  why:'หลอก (ข้อความสมมติ) ส่งจากเบอร์ส่วนตัว เร่งให้รีบทำ ขอเลขบัญชีผ่านลิงก์ ธนาคารจริงไม่ส่งลิงก์ขอข้อมูลบัญชีทางข้อความสั้น',sig:['rush','personal','nosrc'],kw:'SMS แจกเงินเยียวยา หลอกลวง ธนาคาร',
  facts:'ส่งจากเบอร์โทรศัพท์ส่วนตัว ไม่ใช่ชื่อผู้ส่งของธนาคาร ลิงก์เป็นโดเมนแปลก ไม่ระบุชื่อธนาคาร'}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function rpc(fn,body){const r=await fetch(`${SB_URL}/rest/v1/rpc/${fn}`,{method:'POST',headers:{apikey:SB_KEY,Authorization:'Bearer '+SB_KEY,'Content-Type':'application/json'},body:JSON.stringify(body)});const t=await r.text();if(!r.ok)throw new Error(t);return t?JSON.parse(t):null}
const ACTS=[
 {k:'a1',t:'เกมจริงหรือหลอก',d:'ตัดสินข่าว 8 ข่าวจากหลายช่องทาง',min:8,max:8},
 {k:'a2',t:'สรุปสัญญาณเตือนและประเภทข่าวปลอม',d:'จำแนกประเภท 3 ข้อ และตอบคำถาม 3 ข้อ',min:7,max:3},
 {k:'a3',t:'ตรวจสอบข่าว 5 ขั้น',d:'ตรวจข่าว 1 ข่าวตามขั้นตอน พร้อมหลักฐาน',min:15,max:5},
 {k:'a4',t:'แต่งข่าวปลอม แล้วตรวจข่าวของเพื่อน',d:'ส่งข่าวขึ้นระบบ ระบบสุ่มข่าวของเพื่อนมาให้ตรวจ',min:12,max:3},
 {k:'a5',t:'ตอบข้อความในไลน์ครอบครัว',d:'เขียนข้อความตอบตามเกณฑ์ 4 ข้อ',min:5,max:4},
 {k:'a6',t:'สรุปท้ายคาบและส่งใบงาน',d:'บันทึกใบงานเป็นรูป ส่งใน Google Classroom',min:3,max:2}
];
const TOTAL=ACTS.reduce((s,a)=>s+a.max,0);
const CASES=[{t:'เพื่อนส่งต่อโพสต์ว่าพรุ่งนี้โรงเรียนหยุดเรียน เพราะเข้าใจว่าเป็นประกาศจริง',a:'mis'},
 {t:'บัญชีที่ตั้งชื่อเหมือนธนาคารส่งข้อความให้กดลิงก์ยืนยันตัวตน ไม่เช่นนั้นบัญชีจะถูกระงับ',a:'dis'},
 {t:'มีผู้นำที่อยู่และเบอร์โทรศัพท์จริงของเพื่อนร่วมชั้นมาโพสต์ประจานในกลุ่ม',a:'mal'}];
const A2Q=['ข่าวใดในเกมที่ตัดสินยากที่สุด เพราะอะไร','ข่าวจริงในเกมมีลักษณะอะไรที่ข่าวปลอมไม่มี (บอกอย่างน้อย 2 ลักษณะ)','สัญญาณเตือนใดที่นักเรียนพบบ่อยที่สุดในไลน์ครอบครัวหรือโซเชียลของตัวเอง ยกตัวอย่างประกอบ'];
const STEPS=[
 {t:'ดูแหล่งที่มา',how:'ใครเป็นผู้เผยแพร่ เป็นสำนักข่าวหรือหน่วยงานที่มีตัวตนจริงหรือไม่ ชื่อเพจหรือลิงก์สะกดแปลกหรือไม่ ลองค้นชื่อผู้เผยแพร่ใน Google',ph:'ผู้เผยแพร่คือ… มีตัวตนจริงหรือไม่ เพราะ…'},
 {t:'ดูวันที่',how:'ข่าวเผยแพร่เมื่อไร เป็นข่าวเก่าที่นำกลับมาแชร์ใหม่หรือไม่ ถ้าไม่มีวันที่ ให้เขียนว่าไม่มี',ph:'วันที่… / ไม่มีวันที่'},
 {t:'อ่านเนื้อหาทั้งหมด',how:'อ่านทั้งโพสต์ ไม่ตัดสินจากพาดหัว จดสิ่งที่ข่าวอ้าง และคำที่เร่งเร้าหรือปลุกอารมณ์',ph:'ข่าวอ้างว่า… มีคำเร่งเร้าหรือไม่…'},
 {t:'ตรวจสอบกับแหล่งอื่น',how:'ค้นด้วยคำค้นที่แนะนำ ดูว่าสำนักข่าวหลักหรือหน่วยงานรัฐรายงานตรงกันหรือไม่ ระบุอย่างน้อย 2 แหล่ง ถ้าไม่พบ ให้เขียนว่าไม่พบ',ph:'แหล่งที่ 1… แหล่งที่ 2…'},
 {t:'ตรวจสอบภาพ',how:'ถ้ามีภาพ ใช้ Google Lens ค้นหาด้วยภาพ ดูว่าภาพเคยเผยแพร่ที่ใดมาก่อน หรือมีจุดผิดปกติแบบภาพจาก AI หรือไม่ ถ้าไม่มีภาพ ให้เขียนว่าไม่มี',ph:'ผลการตรวจภาพ…'}
];
const RUB=[
 {t:'ขอบคุณที่หวังดี',d:'แสดงว่าเข้าใจว่าผู้ส่งตั้งใจดี เช่น มีคำว่า ขอบคุณ',re:/ขอบคุณ|ขอบใจ/},
 {t:'สุภาพ',d:'ใช้คำลงท้ายสุภาพ ไม่ตำหนิหรือประชดผู้ส่ง',re:/ครับ|ค่ะ|คะ|จ้ะ|จ้า|นะคะ|นะครับ/,bad:/โง่|บ้า|มั่ว|ไม่รู้เรื่อง|แก่แล้ว|เชื่ออะไรง่าย/},
 {t:'บอกหลักฐาน',d:'บอกว่าตรวจสอบกับใคร เช่น ศูนย์ต่อต้านข่าวปลอม สำนักข่าว หน่วยงาน หรือแนบลิงก์',re:/ศูนย์ต่อต้านข่าวปลอม|ชัวร์ก่อนแชร์|กระทรวง|สำนักข่าว|หน่วยงาน|เว็บไซต์|ประกาศ|ตรวจสอบ|ลิงก์|http|ธนาคาร|ข่าว/},
 {t:'ชวนทำสิ่งที่ถูกต้อง',d:'ชวนลบข้อความ แจ้งในกลุ่มว่าไม่จริง หรือไม่ส่งต่อ',re:/ลบ|แก้|แจ้ง|บอกในกลุ่ม|อย่าส่งต่อ|ไม่ส่งต่อ|ไม่แชร์|อย่าแชร์|ระวัง/}
];
const SRC=['ศูนย์ต่อต้านข่าวปลอมประเทศไทย','ชัวร์ก่อนแชร์','สำนักข่าวหลักหลายแห่ง','เว็บไซต์หรือเพจทางการของหน่วยงาน','การค้นหาด้วยภาพ (Google Lens)'];
const TEACHER='ครูจิตรภาณุ ศรีหวัง';
const cut=(s,n)=>{s=String(s||'');return s.length>n?s.slice(0,n)+'…':s};
const scoreSt=(st,k)=>st&&st[k]?Number(st[k].score)||0:0;
const totalSt=st=>Math.round(ACTS.reduce((t,a)=>t+scoreSt(st,a.k),0)*10)/10;
const thDate=d=>new Date(d).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'numeric'});
function stampSVG(chk,size){
 const c='#C8102E',d=chk&&chk.checked_at?thDate(chk.checked_at):'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 240 240">
 <defs><path id="tp" d="M40,120 a80,80 0 1,1 160,0"/><path id="bp" d="M28,120 a92,92 0 0,0 184,0"/></defs>
 <g fill="none" stroke="${c}"><circle cx="120" cy="120" r="112" stroke-width="7"/><circle cx="120" cy="120" r="100" stroke-width="2.5"/><circle cx="120" cy="120" r="64" stroke-width="2.5"/></g>
 <g fill="${c}" font-family="Sarabun, Tahoma, sans-serif" font-weight="700">
 <text font-size="17" letter-spacing="1"><textPath href="#tp" startOffset="50%" text-anchor="middle">โรงเรียนมหาวชิราวุธ สงขลา</textPath></text>
 <text font-size="16" letter-spacing="1"><textPath href="#bp" startOffset="50%" text-anchor="middle">${TEACHER}</textPath></text>
 <text x="120" y="122" font-size="31" text-anchor="middle">ตรวจแล้ว</text>
 <text x="120" y="146" font-size="17" text-anchor="middle">${d}</text>
 <text x="34" y="127" font-size="20" text-anchor="middle">★</text><text x="206" y="127" font-size="20" text-anchor="middle">★</text></g></svg>`;
}
function renderSheet(st,chk){
 const me=st.me||{name:'',cls:'',no:''},BL='#1D3FB8',F="font-family:Sarabun,'TH Sarabun New',sans-serif;";
 const total=totalSt(st),final=chk&&chk.score_override!=null?chk.score_override:total;
 const box=on=>`<span style="display:inline-block;width:15px;height:15px;border:1.4px solid #111;vertical-align:-2px;margin-right:4px;text-align:center;line-height:13px;font-size:13px;color:${BL};font-weight:700">${on?'✓':''}</span>`;
 const fill=t=>`<span style="color:${BL}">${esc(t||'')}</span>`;
 const line=(t,h=1)=>`<div style="color:${BL};line-height:26px;min-height:${26*h}px;background:repeating-linear-gradient(transparent 0 25px,#9CA3AF 25px 26px);padding:0 3px">${esc(t||'')}</div>`;
 const sec=(n,t,k,inst)=>`<div style="display:flex;justify-content:space-between;border-bottom:2px solid #111;margin:10px 0 4px;font-weight:700;font-size:20px"><span>ตอนที่ ${n} ${t}</span><span>คะแนน ${scoreSt(st,k)}/${ACTS.find(a=>a.k===k).max}</span></div>${inst?`<div style="margin-bottom:3px"><b>คำชี้แจง</b> ${inst}</div>`:''}`;
 const TD='border:1px solid #6B7280;padding:2px 6px;vertical-align:top;line-height:1.35',TH=TD+';background:#F3F4F6;font-weight:700;text-align:center';
 const tbl=(h,rows)=>`<table style="width:100%;border-collapse:collapse;font-size:15px"><tr>${h.map(x=>`<th style="${TH}">${x}</th>`).join('')}</tr>${rows}</table>`;
 const opts=(map,sel)=>Object.entries(map).map(([k,v])=>`${box(sel===k)}${v}`).join('&nbsp;&nbsp;&nbsp;');
 const sigs=sel=>`<div style="display:grid;grid-template-columns:repeat(4,auto);gap:0 12px;font-size:14.5px;margin-left:10px">${Object.entries(SIG).map(([k,v])=>`<div>${box(sel&&sel.includes(k))}${v}</div>`).join('')}</div>`;
 const r1=st.a1?st.a1.res:[];
 const c1=sec(1,'เกมจริงหรือหลอก','a1','ตัดสินว่าข่าวแต่ละข่าวเป็นข่าวจริงหรือข่าวหลอก')+tbl(['ที่','พาดหัวข่าว','ช่องทาง','จริง','หลอก','ผล'],
  Q.map(q=>{const r=r1.find(x=>x.id===q.id);return `<tr><td style="${TD};text-align:center">${q.id}</td><td style="${TD}">${esc(cut(q.h,52))}</td><td style="${TD}">${PLAT[q.p==='fblink'?'facebook':q.p].replace(' (SMS)','')}</td><td style="${TD};text-align:center">${box(r&&r.v===true)}</td><td style="${TD};text-align:center">${box(r&&r.v===false)}</td><td style="${TD};text-align:center;color:${r?(r.ok?'#15803D':'#B91C1C'):'#666'}">${r?(r.ok?'ถูก':'ผิด'):''}</td></tr>`}).join(''));
 const r2=st.a2;
 const c2=sec(2,'สัญญาณเตือนและประเภทข่าวปลอม','a2','2.1 เลือกประเภทของข่าวปลอม 2.2 ตอบคำถาม')+
  CASES.map((c,i)=>`<div>${i+1}) ${c.t}<br><span style="margin-left:14px">${opts(TYPES,r2&&r2.ch[i])}</span></div>`).join('')+
  A2Q.map((q,i)=>`<div style="margin-top:2px">${i+1}. ${q}</div>${line(r2?cut(r2.w[i],110):'')}`).join('');
 const r3=st.a3,q3=r3?Q.find(q=>q.id===r3.id):null;
 const c3=sec(3,'ตรวจสอบข่าว 5 ขั้น','a3','ตรวจสอบข่าวที่จับสลากได้ แล้วสรุปผลพร้อมเหตุผล')+
  `<div>ข่าวที่ ${fill(r3?r3.id:'')} ${fill(q3?cut(q3.h,70):'')}</div>`+
  tbl(['ขั้นการตรวจสอบ','ผลการตรวจสอบ'],STEPS.map((s,i)=>`<tr><td style="${TD};width:170px">${i+1}. ${s.t}</td><td style="${TD};color:${BL}">${r3?esc(cut(r3.st[i],80)):''}</td></tr>`).join(''))+
  `<div style="margin-top:3px">ข้อสรุป ${opts({real:'ข่าวจริง',fake:'ข่าวปลอม',unsure:'ยังสรุปไม่ได้'},r3&&r3.v)}</div><div>เหตุผล</div>${line(r3?cut(r3.rs,110):'')}`;
 const A=st.a4||{},m=A.mine,c=A.check;
 const c4=sec(4,'แต่งข่าวปลอมและตรวจข่าวของเพื่อน','a4','4.1 แต่งข่าวปลอมโดยซ่อนสัญญาณเตือน 4.2 ตรวจข่าวของเพื่อนที่ระบบสุ่มให้')+
  `<div><b>4.1</b> ช่องทาง ${fill(m?PLAT[m.platform]:'')} ผู้เผยแพร่ ${fill(m?cut(m.sender,30):'')}</div><div>พาดหัว ${fill(m?cut(m.headline,90):'')}</div><div>รายละเอียด ${fill(m?cut(m.body,120):'')}</div>
  <div>สัญญาณเตือนที่ซ่อนไว้</div>${sigs(m&&m.signals)}<div>ประเภท ${opts(TYPES,m&&m.type)}</div>
  <div style="margin-top:4px"><b>4.2</b> พาดหัวข่าวของเพื่อน ${fill(c?cut(c.post.headline,80):'')}</div><div>สัญญาณเตือนที่พบ</div>${sigs(c&&c.mySig)}<div>ประเภท ${opts(TYPES,c&&c.myType)}</div>
  ${c?`<div style="font-size:15px;color:#444">ตรงกับผู้แต่ง ${c.key.hits} จาก ${c.key.signals.length} สัญญาณ ประเภทที่ผู้แต่งตั้งใจ ${TYPES[c.key.type]}</div>`:''}`;
 const r5=st.a5,fk=m?m.headline:Q[7].h;
 const c5=sec(5,'ตอบข้อความในไลน์ครอบครัว','a5','เขียนข้อความตอบป้าที่ส่งข่าวปลอมเข้ากลุ่มไลน์ครอบครัว')+
  `<div style="background:#F3F4F6;padding:2px 8px;border-left:3px solid #9CA3AF">ป้า: “${esc(cut(fk,90))}”</div>${line(r5?cut(r5.text,300):'',2)}`+
  tbl(['เกณฑ์','ผ่าน','ไม่ผ่าน'],RUB.map((x,i)=>`<tr><td style="${TD}">${i+1}. ${x.t}</td><td style="${TD};text-align:center;width:60px">${box(r5&&r5.ck[i])}</td><td style="${TD};text-align:center;width:60px">${box(r5&&!r5.ck[i])}</td></tr>`).join(''));
 const r6=st.a6;
 const c6=sec(6,'สรุปท้ายคาบ','a6')+`<div>1. สัญญาณเตือนที่จำได้ 3 แบบ</div>${line(r6?r6.sg.map(x=>SIG[x]).join(', '):'')}<div>2. แหล่งตรวจสอบข่าวที่จะใช้</div>${line(r6?r6.so:'')}<div>3. ครั้งหน้าเมื่อเห็นข่าวน่าสงสัย ฉันจะ</div>${line(r6?cut(r6.w,110):'')}`;
 const foot=`<table style="width:100%;border-collapse:collapse;font-size:16px;margin-top:10px"><tr>${ACTS.map((a,i)=>`<th style="${TH}">ตอนที่ ${i+1}</th>`).join('')}<th style="${TH}">รวม</th></tr><tr>${ACTS.map(a=>`<td style="${TD};text-align:center;color:${BL}">${scoreSt(st,a.k)}/${a.max}</td>`).join('')}<td style="${TD};text-align:center;color:${BL};font-weight:700">${total}/${TOTAL}</td></tr></table>
  <div style="margin-top:6px">ความคิดเห็นของครู <span style="color:#C8102E">${chk&&chk.comment?esc(chk.comment):''}</span></div>${chk&&chk.comment?'':line('')}
  <div style="text-align:right;margin-top:4px">${chk&&chk.checked_at?`<span class="stamp" style="display:inline-block;transform:rotate(-5deg);text-align:center"><span style="display:block;font-weight:700;font-size:58px;line-height:1;color:#D7141A;letter-spacing:3px;text-shadow:0 0 1px #D7141A">ตรวจแล้ว</span><span style="display:block;font-size:14px;color:#D7141A">${thDate(chk.checked_at)}</span></span>`:'ผู้ตรวจ ...............................'}</div>`;
 return `<div class="pg" style="${F}font-size:16.5px;line-height:1.45;color:#111;width:1754px;height:1240px;background:#fff;padding:34px 44px;box-sizing:border-box;position:relative;overflow:hidden">
 <div style="display:flex;align-items:center;gap:18px;border-bottom:3px double #111;padding-bottom:8px">
  <img src="emblem.png" style="width:78px;height:auto">
  <div style="flex:1"><div style="font-size:32px;font-weight:700;line-height:1.1">ใบงาน กิจกรรมตรวจข่าวก่อนแชร์</div>
  <div>รายวิชาเหตุการณ์ปัจจุบัน 2 รหัสวิชา ส33265 ชั้นมัธยมศึกษาปีที่ 6 สัปดาห์ที่ 1 ข่าวจริง ข่าวปลอม และภาพหรือคลิปจาก AI</div>
  <div>โรงเรียนมหาวชิราวุธ จังหวัดสงขลา ภาคเรียนที่ 2 ปีการศึกษา 2569</div></div>
  <div style="border:2px solid #111;padding:4px 16px;text-align:center;min-width:150px"><div style="font-weight:700">คะแนนรวม</div><div style="font-size:34px;font-weight:700;color:${chk&&chk.score_override!=null?'#C8102E':BL};line-height:1.1">${final}</div><div>เต็ม ${TOTAL}</div></div></div>
 <div style="display:flex;gap:30px;margin:6px 0 0;font-size:19px"><div><b>ชื่อ-สกุล</b> ${fill(me.name)}</div><div><b>ชั้น</b> ${fill(me.cls)}</div><div><b>เลขที่</b> ${fill(me.no)}</div><div><b>วันที่ส่ง</b> ${fill(st.a6?st.a6.at:'')}</div></div>
 <div style="display:grid;grid-template-columns:1fr 1fr;gap:34px">
  <div>${c1}${c2}${c3}</div><div>${c4}${c5}${c6}${foot}</div></div>
 </div>`;
}
