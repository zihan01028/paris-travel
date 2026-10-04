// 离线缓存：有网时总是取最新页面，没网时用上次缓存的版本
const CACHE = "trip-v4";

function replaceDay(html, date, nextDate, block){
  const re = new RegExp(` \\{d:\"${date}\"[\\s\\S]*?(?=\\n \\{d:\"${nextDate}\")`);
  return html.replace(re, block);
}

function rewriteHtml(html){
  // 10.3 的旧备注同步
  html = html.replace(
    "10.3 其他几家取消：L'Atypic、Boutary、Traboule；Les Antiquaires 改到 10.5。",
    "10.3 其他几家取消：L'Atypic、Boutary、Traboule；Les Antiquaires 已改约到 10.4 17:30。"
  );

  // 10.4：LV Cafe → 奥赛 15:30 → Les Antiquaires 17:30
  html = replaceDay(html,"2026-10-04","2026-10-05",` {d:"2026-10-04",city:"巴黎",c:"#DD8A2A",stay:"sthonore",theme:"卢浮宫讲解，LV Cafe 午饭，奥赛免费日，17:30 Les Antiquaires",
  alert:"中午不再现场排 Cédric Grolet，卢浮宫结束后直接去 LV Cafe。奥赛用 15:30 时段，17:30 已约 Les Antiquaires，看完奥赛直接过去。",
  items:[
   {slot:"每天",ttl:"约爱马仕",tag:"book",note:"抽签制，每天都约一次试试。"},
   {t:"09:00",end:"12:00",p:"louvre",ttl:"卢浮宫讲解",tag:"booked",note:"讲解结束后直接出来吃午饭。"},
   {t:"12:20",p:"lvcafe",ttl:"LV Cafe 午饭",note:"卢浮宫结束后直接过去，不再现场排 Cédric Grolet。吃完如果有时间可以顺便看楼下 LV Dream。"},
   {t:"14:45",ttl:"沿塞纳河往奥赛走",note:"从 LV Dream 一带沿河过去约 20 分钟，给 15:30 入场留出余量。"},
   {t:"15:30",p:"orsay",ttl:"奥赛博物馆（免费日）",tag:"booked",note:"重点先看五楼印象派，17:10 左右离开去晚饭。"},
   {t:"17:30",p:"antiquaires",ttl:"Les Antiquaires",tag:"booked",note:"已约 17:30。从奥赛走过去约 10 分钟。"}
  ]},`);

  // 10.5：Stohrer → Carrefour City → 卢浮宫外拍 → LV Dream → 逛街 → 16:30 摄影 → 塞纳河游船
  html = replaceDay(html,"2026-10-05","2026-10-06",` {d:"2026-10-05",city:"巴黎",c:"#C49B1E",stay:"sthonore",theme:"Stohrer、卢浮宫清晨拍照、LV Dream，下午逛街，16:30 情侣摄影，晚上塞纳河游船",
  alert:"情侣摄影改到 16:30。City Pharma 不再固定塞进白天行程，药妆店开到晚上 21:00，哪天晚上有空再去。",
  items:[
   {slot:"每天",ttl:"约爱马仕",tag:"book",note:"抽签制，每天都约一次试试。"},
   {t:"07:30",p:"stohrer",ttl:"Stohrer 早餐：可颂和 flan",note:"10.4 没去，今天早上补上。买完边走边吃。"},
   {t:"07:55",ttl:"Carrefour City 逛逛",note:"顺路看看法国超市零食、饮料和日用品，不用停太久。"},
   {t:"08:25",p:"louvre",ttl:"卢浮宫外面拍照",note:"8 点多游客通常比白天少，主要拍玻璃金字塔、拿破仑庭院和长廊外景。"},
   {t:"09:15",p:"palaisroyal",ttl:"皇家宫殿 / 住处附近慢慢逛",note:"拍完照后时间比较松，可以回住处休息一下。"},
   {t:"12:00",p:"lvcafe",ttl:"LV Dream 吃点东西",note:"中午在 LV Dream / LV Cafe 吃点，行程不用排太满。"},
   {t:"13:30",ttl:"Saint-Honoré、旺多姆一带逛街",note:"摄影前留一段购物时间；不要买太重，拍照前还要整理一下。"},
   {t:"15:30",p:"sthonore",ttl:"回住处放东西、补妆换衣服",note:"给 16:30 摄影留足准备和交通时间。"},
   {t:"16:30",ttl:"情侣摄影集合",tag:"booked",note:"今天日落约 19:20。按摄影师给的集合地点过去。"},
   {t:"20:30",p:"pontneuf",ttl:"塞纳河夜游",note:"摄影结束后简单吃点，再去坐夜船。想看亮灯夜景可以选天黑后的班次。"}
  ]},`);

  // 10.6：12:15 Pantagruel，饭后再逛春天/老佛爷，然后直接去歌剧院
  html = replaceDay(html,"2026-10-06","2026-10-07",` {d:"2026-10-06",city:"巴黎",c:"#3F9556",stay:"sthonore",theme:"Pantagruel 12:15 午饭，饭后逛春天和老佛爷，然后直接去加尼叶歌剧院",
  alert:"海军府挪到 10.8。午饭后再集中购物，买完直接走去歌剧院，不回住处。",
  items:[
   {slot:"每天",ttl:"约爱马仕",tag:"book",note:"抽签制，每天都约一次试试。"},
   {t:"09:50",p:"goyard",ttl:"Goyard（可选）",note:"经常排队，开门前后到最好；排太久就放弃。"},
   {t:"10:30",p:"vendome",ttl:"旺多姆广场、和平街、歌剧院大道附近随便逛逛",note:"午饭前不进百货，把购物集中放到 Pantagruel 之后。"},
   {t:"12:15",p:"pantagruel",ttl:"Pantagruel 午饭（米其林一星）",tag:"booked",note:"已约 12:15。午餐大约留 2 小时。"},
   {t:"14:20",p:"printemps",ttl:"春天百货（Printemps Haussmann）",note:"从 Pantagruel 过去约 10–15 分钟。"},
   {t:"15:10",p:"lafayette",ttl:"老佛爷百货，上屋顶看全景（免费）",note:"就在春天隔壁。买完不回住处，直接去歌剧院。"},
   {t:"16:40",ttl:"从老佛爷直接去歌剧院",note:"步行几分钟即可到加尼叶歌剧院。"},
   {t:"17:00",p:"opera",ttl:"加尼叶歌剧院：参观 + 看演出",tag:"book",note:"大楼梯和大休息厅是重头戏。中午吃得多，晚饭按演出时间简单吃。"}
  ]},`);

  // 10.8：不安排 Cédric Grolet
  html = replaceDay(html,"2026-10-08","2026-10-09",` {d:"2026-10-08",city:"巴黎",c:"#3867C8",stay:"republique",theme:"荣军院和罗丹，La Jacobine 午饭，海军府，蒙马特看日落，晚上 Le Villaret",
  alert:"10.4 如果已经去了蒙马特，海军府之后可改逛乐蓬马歇，傍晚回酒店，晚上直接去 Le Villaret。",
  items:[
   {slot:"每天",ttl:"约爱马仕",tag:"book",note:"抽签制，每天都约一次试试。"},
   {t:"10:00",p:"invalides",ttl:"荣军院，拿破仑墓和军事博物馆",tag:"book"},
   {t:"11:15",p:"rodin",ttl:"罗丹美术馆和花园",tag:"book"},
   {t:"12:30",p:"jacobine",ttl:"La Jacobine 午饭",tag:"booked"},
   {t:"13:45",ttl:"从圣日耳曼前往海军府",note:"午饭后直接往协和广场方向走或打车。"},
   {t:"14:15",p:"marine",ttl:"海军府",tag:"book",note:"从 10.6 挪过来，参观约 1 小时。"},
   {t:"15:30",p:"concorde",ttl:"协和广场坐地铁 12 号线",note:"直达蒙马特的 Abbesses 站，约 20 分钟。"},
   {t:"16:00",p:"jetaime",ttl:"蒙马特：爱墙"},
   {t:"16:45",p:"tertre",ttl:"小丘广场"},
   {t:"17:30",p:"rose",ttl:"粉红之家"},
   {t:"19:00",p:"sacre",ttl:"圣心堂台阶看日落",note:"日落约 19:15。"},
   {slot:"备选下午",ttl:"乐蓬马歇百货 Le Bon Marché",note:"如果 10.4 已经去过蒙马特，海军府之后用这个备选。"},
   {t:"20:00",p:"villaret",ttl:"Le Villaret 晚饭",tag:"book",note:"离 Crowne Plaza 走路约 10 分钟。"}
  ]},`);

  // “没订的饭”同步
  html = html.replace(
    '{d:"2026-10-04",t:"午饭：Cédric Grolet + 杜乐丽小餐车，或 LV 咖啡馆",w:"LV 咖啡馆是备选，要定金所以没订，到了碰运气"},',
    '{d:"2026-10-04",t:"午饭：LV Cafe",w:"卢浮宫结束后直接去"},'
  );
  html = html.replace(/\n  \{d:"2026-10-04",t:"晚饭：蒙马特或圣日耳曼"[^\n]*/,"");
  html = html.replace(/\n  \{d:"2026-10-05",u:1,t:"晚饭：Les Antiquaires 20:00"[^\n]*/, '\n  {d:"2026-10-05",t:"晚饭：摄影后简单吃",w:"之后 20:30 左右去塞纳河游船"},');
  html = html.replace(/\n  \{d:"2026-10-06",u:1,t:"午饭：Pantagruel 12:15"[^\n]*/,"");

  // 待办：删 Cédric Grolet pickup，City Pharma 改为晚上灵活去
  html = html.replace(/\n  \{u:1,t:"La Pâtisserie du Meurice par Cédric Grolet：10\.8 取货[^\n]*/,"");
  html = html.replace(
    ' {h:"尽快订",items:[',
    ' {h:"晚上有空就做",items:[\n  {t:"City Pharma 买药妆",w:"开到晚上 21:00，不固定哪一天；哪天晚上没安排或早点结束就去"}\n ]},\n {h:"尽快订",items:['
  );
  html = html.replace(/\n  \{u:1,t:"新订：Pantagruel 10\.6 12:15 午饭"[^\n]*/,"");
  html = html.replace(/\n  \{u:1,t:"新订：Les Antiquaires 10\.5 20:00 晚饭"[^\n]*/,"");

  // 内部订位数据同步
  html = html.replace('{d:"2026-10-05",t:"17:00",ttl:"情侣摄影",sub:"17:00 集合"},','{d:"2026-10-05",t:"16:30",ttl:"情侣摄影",sub:"16:30 集合"},');
  if (!html.includes('ttl:"Pantagruel",sub:"午饭已约 12:15"')) {
    html = html.replace('{d:"2026-10-05",t:"16:30",ttl:"情侣摄影",sub:"16:30 集合"},','{d:"2026-10-05",t:"16:30",ttl:"情侣摄影",sub:"16:30 集合"},\n {d:"2026-10-06",t:"12:15",ttl:"Pantagruel",sub:"午饭已约 12:15",p:"pantagruel",addr:"10 Rue de Richelieu, Paris"},');
  }
  if (!html.includes('ttl:"Les Antiquaires",sub:"已约 17:30"')) {
    html = html.replace('{d:"2026-10-04",t:"15:30",ttl:"奥赛博物馆免费日预约",sub:"约了 13:30 和 15:30 两个时段，先争取 13:30",p:"orsay",addr:"Esplanade Valéry Giscard d\'Estaing, 75007 Paris"},','{d:"2026-10-04",t:"15:30",ttl:"奥赛博物馆免费日预约",sub:"用 15:30 时段",p:"orsay",addr:"Esplanade Valéry Giscard d\'Estaing, 75007 Paris"},\n {d:"2026-10-04",t:"17:30",ttl:"Les Antiquaires",sub:"已约 17:30",p:"antiquaires",addr:"13 Rue du Bac, Paris"},');
  }

  return html;
}

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE));
});

self.addEventListener("activate", e => e.waitUntil((async () => {
  const keys = await caches.keys();
  await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
  await self.clients.claim();
  const clients = await self.clients.matchAll({type:"window"});
  for (const client of clients) client.navigate(client.url);
})()));

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    try {
      const res = await fetch(req);
      let out = res;
      if (req.mode === "navigate" && (res.headers.get("content-type") || "").includes("text/html")) {
        const html = rewriteHtml(await res.text());
        const headers = new Headers(res.headers);
        headers.delete("content-length");
        out = new Response(html,{status:res.status,statusText:res.statusText,headers});
      }
      const copy = out.clone();
      caches.open(CACHE).then(c => c.put(req.mode === "navigate" ? "/" : req, copy));
      return out;
    } catch (err) {
      return caches.match(req.mode === "navigate" ? "/" : req);
    }
  })());
});