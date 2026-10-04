// 离线缓存：有网时总是取最新页面，没网时用上次缓存的版本
const CACHE = "trip-v3";

function rewriteHtml(html){
  const replacements = [
    [
      '10.3 其他几家取消：L\'Atypic、Boutary、Traboule；Les Antiquaires 改到 10.5。',
      '10.3 其他几家取消：L\'Atypic、Boutary、Traboule；Les Antiquaires 已改约到 10.4 17:30。'
    ],
    [
      'theme:"卢浮宫讲解，中午碰运气买 Cédric Grolet，奥赛免费日，晚上蒙马特日落或游船"',
      'theme:"卢浮宫讲解，LV Cafe 午饭，奥赛免费日，17:30 Les Antiquaires"'
    ],
    [
      'alert:"中午两个方案：Cédric Grolet 排队不长就买了在杜乐丽吃，赶 13:30 进奥赛；排队太长就去 LV 咖啡馆吃午饭（要付定金，没提前订，到了看能不能直接进），15:30 进奥赛。晚上看天气：晴天蒙马特日落，阴天或下雨坐游船。"',
      'alert:"中午不再现场排 Cédric Grolet，卢浮宫结束后直接去 LV Cafe。奥赛用 15:30 时段，17:30 已约 Les Antiquaires，看完奥赛直接过去。"'
    ],
    [
      '{t:"12:10",p:"meurice",ttl:"Cédric Grolet 看排队，不多就买",tag:"tbd",note:"从卢浮宫沿里沃利街往西走约 10 分钟，12:00 开门。周日营业出发前确认。大概 20 分钟内能买到就排，太长就放弃，走下面的方案 B。"},\n   {t:"12:35",p:"tuileries",ttl:"杜乐丽花园吃甜品，再随便吃点",note:"花园里有小餐车和咖啡亭，买个三明治垫一下。"},\n   {t:"13:10",ttl:"穿过杜乐丽，走步行桥过河",note:"Léopold-Sédar-Senghor 步行桥对面就是奥赛，约 15 分钟。"},\n   {t:"13:30",p:"orsay",ttl:"奥赛博物馆（免费日）",tag:"booked",note:"用 13:30 这个时段。约 17:30 开始清场，进门先去五楼印象派。"},\n   {slot:"方案 B",p:"lvcafe",ttl:"排队太长：LV 咖啡馆午饭 → 15:30 进奥赛",tag:"tbd",note:"没提前订（要付定金），到了看能不能直接进，不行就在附近随便吃。从 Castiglione 街走过去约 15 分钟，面朝塞纳河，每天 11:00–20:00。吃完可以逛楼下的 LV Dream 展览（免费但要预约），再沿河走到奥赛约 15 分钟。"},\n   {slot:"晚上 A",ttl:"晴天：蒙马特看日落，在蒙马特吃晚饭",tag:"tbd",note:"17:45 从奥赛门口的 Solférino 坐地铁 12 号线直达 Abbesses，约 20 分钟。爬上圣心堂台阶，日落约 19:20。周日人多，看好包。回住处坐 12 号线到 Concorde 换 1 号线，或打车约 20 分钟。"},\n   {slot:"晚上 B",ttl:"阴天：圣日耳曼晚饭 + 塞纳河游船",tag:"tbd",note:"晚饭在奥赛附近随便找一家，吃完走到新桥下的 Vedettes du Pont Neuf 码头坐夜船，坐完走回住处约 15 分钟。周日很多餐厅休息，先确认营业。"}',
      '{t:"12:20",p:"lvcafe",ttl:"LV Cafe 午饭",note:"卢浮宫结束后直接过去，不再现场排 Cédric Grolet。吃完如果有时间可以顺便看楼下 LV Dream。"},\n   {t:"14:45",ttl:"沿塞纳河往奥赛走",note:"从 LV Dream 一带沿河过去约 20 分钟，给 15:30 入场留出余量。"},\n   {t:"15:30",p:"orsay",ttl:"奥赛博物馆（免费日）",tag:"booked",note:"用 15:30 这个时段。重点先看五楼印象派，17:10 左右离开去晚饭。"},\n   {t:"17:30",p:"antiquaires",ttl:"Les Antiquaires",tag:"booked",note:"已约 17:30。从奥赛走过去约 10 分钟，看完博物馆直接去。"}'
    ],
    [
      'theme:"西岱岛和拉丁区，一路往西走到圣日耳曼，17:00 情侣摄影，晚上 Les Antiquaires"',
      'theme:"西岱岛和拉丁区，一路往西走到圣日耳曼，17:00 情侣摄影"'
    ],
    [
      '{t:"20:00",p:"antiquaires",ttl:"Les Antiquaires 晚饭",tag:"book",note:"7 区 rue du Bac 的小酒馆，从铁塔一带打车约 10 分钟，从住处过河约 15 分钟。拍照结束时间不好说就订晚一点。"}',
      '{slot:"晚上",ttl:"摄影结束后按状态决定晚饭",note:"Les Antiquaires 已改到 10.4 17:30。今天拍完照后在附近简单吃或回住处休息。"}'
    ],

    // 10.6：12:15 Pantagruel，饭后再逛春天/老佛爷，然后直接去歌剧院
    [
      'theme:"春天和老佛爷购物，Pantagruel 午饭，下午接着买，17:00 加尼叶歌剧院参观加看演出"',
      'theme:"Pantagruel 12:15 午饭，饭后逛春天和老佛爷，然后直接去加尼叶歌剧院"'
    ],
    [
      '{t:"10:30",p:"printemps",ttl:"春天百货（Printemps Haussmann）",note:"10 点开门，上午人少。屋顶露台也能看铁塔。春天和老佛爷是两家公司，退税单分开开，各自同一天满 100.01€。"},\n   {t:"11:15",p:"lafayette",ttl:"老佛爷百货，上屋顶看全景（免费）",note:"就在春天隔壁。同一天在老佛爷买的东西可以合成一张退税单（退 12%），上午下午分开买也行，最后一起去退税柜台开。12:00 出发去吃饭。"},\n   {t:"12:15",p:"pantagruel",ttl:"Pantagruel 午饭（米其林一星）",tag:"book",note:"沿歌剧院大道往南走约 10–15 分钟。午餐套餐比晚餐便宜很多，吃下来约 2 小时。周末休息。"},\n   {t:"14:30",p:"lafayette",ttl:"回老佛爷和春天接着买",note:"从 Pantagruel 走回去约 10 分钟。"},\n   {t:"16:00",p:"sthonore",ttl:"走回住处放购物袋、休息、换衣服",note:"约 15 分钟。"},\n   {t:"16:45",ttl:"走去歌剧院",note:"沿歌剧院大道直走约 15 分钟。"}',
      '{t:"11:00",ttl:"旺多姆广场和歌剧院大道附近随便逛逛",note:"午饭前不进百货，把购物集中放到 Pantagruel 之后。"},\n   {t:"12:15",p:"pantagruel",ttl:"Pantagruel 午饭（米其林一星）",tag:"booked",note:"已约 12:15。午餐大约留 2 小时，吃完直接去春天和老佛爷。"},\n   {t:"14:20",p:"printemps",ttl:"春天百货（Printemps Haussmann）",note:"从 Pantagruel 过去约 10–15 分钟。春天和老佛爷是两家公司，退税单分开开。"},\n   {t:"15:10",p:"lafayette",ttl:"老佛爷百货，上屋顶看全景（免费）",note:"就在春天隔壁。买完不回住处，直接去歌剧院。"},\n   {t:"16:40",ttl:"从老佛爷直接去歌剧院",note:"步行几分钟即可到加尼叶歌剧院。"}'
    ],

    // 10.8：不再安排 Cédric Grolet
    [
      'theme:"荣军院和罗丹，La Jacobine 午饭，杜乐丽吃 Cédric Grolet，海军府，蒙马特看日落，晚上 Le Villaret"',
      'theme:"荣军院和罗丹，La Jacobine 午饭，海军府，蒙马特看日落，晚上 Le Villaret"'
    ],
    [
      'alert:"Cédric Grolet 提前 2–3 天在官网下单，选 14:00–15:00 取货，取了马上吃。10.4 如果已经去了蒙马特，海军府之后改逛乐蓬马歇，傍晚回酒店，晚上直接去 Le Villaret。"',
      'alert:"10.4 如果已经去了蒙马特，海军府之后改逛乐蓬马歇，傍晚回酒店，晚上直接去 Le Villaret。"'
    ],
    [
      '{t:"12:30",p:"jacobine",ttl:"La Jacobine 午饭",tag:"booked",note:"甜点可以省了，下午还有 Cédric Grolet。"},\n   {t:"14:00",ttl:"步行去 Castiglione 街",note:"过艺术桥、穿过卢浮宫的拿破仑庭院到里沃利街，约 20 分钟，正好消消食。"},\n   {t:"14:20",p:"meurice",ttl:"La Pâtisserie du Meurice par Cédric Grolet 取甜品",tag:"book",note:"门店 12:00–18:00。水果造型的招牌尝一两个就好。"},\n   {t:"14:30",p:"tuileries",ttl:"杜乐丽花园，坐下吃甜品",note:"过里沃利街就是花园，找水池边的绿椅子。"},\n   {t:"15:00",p:"marine",ttl:"海军府",tag:"book",note:"从 10.6 挪过来。穿过杜乐丽走到协和广场约 10 分钟，参观约 1 小时。"},\n   {t:"16:00",p:"concorde",ttl:"协和广场坐地铁 12 号线",note:"直达蒙马特的 Abbesses 站，约 20 分钟。"},\n   {t:"16:30",p:"jetaime",ttl:"蒙马特：爱墙",note:"就在 Abbesses 站旁边。"},\n   {t:"17:15",p:"tertre",ttl:"小丘广场"},\n   {t:"18:00",p:"rose",ttl:"粉红之家"}',
      '{t:"12:30",p:"jacobine",ttl:"La Jacobine 午饭",tag:"booked"},\n   {t:"13:45",ttl:"从圣日耳曼前往海军府",note:"午饭后直接往协和广场方向走或打车。"},\n   {t:"14:15",p:"marine",ttl:"海军府",tag:"book",note:"从 10.6 挪过来，参观约 1 小时。"},\n   {t:"15:30",p:"concorde",ttl:"协和广场坐地铁 12 号线",note:"直达蒙马特的 Abbesses 站，约 20 分钟。"},\n   {t:"16:00",p:"jetaime",ttl:"蒙马特：爱墙",note:"就在 Abbesses 站旁边。"},\n   {t:"16:45",p:"tertre",ttl:"小丘广场"},\n   {t:"17:30",p:"rose",ttl:"粉红之家"}'
    ],

    // 未订餐列表同步
    [
      '{d:"2026-10-04",t:"午饭：Cédric Grolet + 杜乐丽小餐车，或 LV 咖啡馆",w:"LV 咖啡馆是备选，要定金所以没订，到了碰运气"},\n  {d:"2026-10-04",t:"晚饭：蒙马特或圣日耳曼",w:"看天气决定去哪边，周日很多餐厅休息，当天现找就行"},\n  {d:"2026-10-05",u:1,t:"晚饭：Les Antiquaires 20:00",w:"还没订，随时能约"},\n  {d:"2026-10-06",u:1,t:"午饭：Pantagruel 12:15",w:"还没订。周末休息，只能订工作日"},',
      '{d:"2026-10-04",t:"午饭：LV Cafe",w:"卢浮宫结束后直接去，不再现场排 Cédric Grolet"},\n  {d:"2026-10-05",t:"晚饭：摄影结束后简单吃",w:"Les Antiquaires 已改约到 10.4 17:30"},'
    ],

    // 待办同步：删掉 Cédric Grolet 10.8 pickup 和 Pantagruel 订位提醒
    [
      '  {u:1,t:"巴黎春天 / 老佛爷：提前网上找返现公司并注册",w:"出发前先完成，现场购物时按返现要求操作"},\n  {u:1,t:"La Pâtisserie du Meurice par Cédric Grolet：10.8 取货，提前 2–3 天网上下单",w:"选 14:00–15:00 的取货时段。10.4 中午现场买到了的话，10.8 就不用再订"}',
      '  {u:1,t:"巴黎春天 / 老佛爷：提前网上找返现公司并注册",w:"出发前先完成，现场购物时按返现要求操作"}'
    ],
    [
      '  {u:1,t:"新订：Pantagruel 10.6 12:15 午饭",w:"周末休息，午餐比晚餐便宜"},\n  {u:1,t:"新订：Les Antiquaires 10.5 20:00 晚饭",w:"拍照结束时间不确定就订晚一点"},\n',
      ''
    ],
    [
      '10.3 Les Antiquaires、L\'Atypic、Boutary、Traboule；10.4 Café Marly、Breizh；',
      '10.3 L\'Atypic、Boutary、Traboule；10.4 Café Marly、Breizh；'
    ],

    // 内部已订数据同步
    [
      '{d:"2026-10-04",t:"12:45",ttl:"Breizh Café 午饭",sub:"两位，可能取消",p:"breizh"},\n {d:"2026-10-04",t:"15:30",ttl:"奥赛博物馆免费日预约",sub:"约了 13:30 和 15:30 两个时段，先争取 13:30",p:"orsay",addr:"Esplanade Valéry Giscard d\'Estaing, 75007 Paris"},',
      '{d:"2026-10-04",t:"15:30",ttl:"奥赛博物馆免费日预约",sub:"用 15:30 时段",p:"orsay",addr:"Esplanade Valéry Giscard d\'Estaing, 75007 Paris"},\n {d:"2026-10-04",t:"17:30",ttl:"Les Antiquaires",sub:"已约 17:30",p:"antiquaires",addr:"13 Rue du Bac, Paris"},'
    ],
    [
      '{d:"2026-10-05",t:"17:00",ttl:"情侣摄影",sub:"17:00 集合"},',
      '{d:"2026-10-05",t:"17:00",ttl:"情侣摄影",sub:"17:00 集合"},\n {d:"2026-10-06",t:"12:15",ttl:"Pantagruel",sub:"午饭已约 12:15",p:"pantagruel",addr:"10 Rue de Richelieu, Paris"},'
    ]
  ];
  for (const [from,to] of replacements) html = html.replace(from,to);
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
