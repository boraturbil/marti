/* PUSULLA v3 — Edge headless sahne ekran görüntüsü ve DOM hata kontrol aracı.
 * Kullanım:
 *   node v3/tools/shot_scenes.js --ids misir,antik,uzay,metropol
 *   node v3/tools/shot_scenes.js --grid misir,antik,uzay,metropol [--out v3/shots/bg/grid.png]
 *   node v3/tools/shot_scenes.js --worker a [--check]
 *   node v3/tools/shot_scenes.js --all [--check]
 */
'use strict';

var fs = require('fs');
var path = require('path');
var os = require('os');
var url = require('url');
var cp = require('child_process');

var SCENES_DIR = path.resolve(__dirname, '..', 'scenes');
var SHOTS_DIR = path.resolve(__dirname, '..', 'shots', 'bg');
var PREVIEW_HTML = path.resolve(__dirname, 'scene_preview.html');

function findEdge() {
  var candidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  for (var i = 0; i < candidates.length; i++) {
    if (fs.existsSync(candidates[i])) return candidates[i];
  }
  throw new Error('Microsoft Edge bulunamadi');
}

var args = process.argv.slice(2);
var worker = null;
var idsArg = null;
var gridArg = null;
var outArg = null;
var allMode = false;
var checkMode = false;
var filesArg = null;
var vw = 1920;
var vh = 1080;
var tVal = '2.0';
var panel = '1';
var road = '1';

for (var i = 0; i < args.length; i++) {
  var a = args[i];
  if (a === '--worker' && i + 1 < args.length) worker = args[++i].toLowerCase();
  else if (a === '--ids' && i + 1 < args.length) idsArg = args[++i].split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  else if (a === '--grid' && i + 1 < args.length) gridArg = args[++i].split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  else if (a === '--out' && i + 1 < args.length) outArg = args[++i];
  else if (a === '--files' && i + 1 < args.length) filesArg = args[++i];
  else if (a === '--vw' && i + 1 < args.length) vw = parseInt(args[++i], 10);
  else if (a === '--vh' && i + 1 < args.length) vh = parseInt(args[++i], 10);
  else if (a === '--t' && i + 1 < args.length) tVal = args[++i];
  else if (a === '--panel' && i + 1 < args.length) panel = args[++i];
  else if (a === '--road' && i + 1 < args.length) road = args[++i];
  else if (a === '--all') allMode = true;
  else if (a === '--check') checkMode = true;
}

function extractIdsFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  var src = fs.readFileSync(filePath, 'utf8');
  var re = /(?:S|PUSULLA\.scene)\.register\(\s*['"]([a-z0-9_]+)['"]/g;
  var out = [];
  var m;
  while ((m = re.exec(src)) !== null) {
    if (out.indexOf(m[1]) === -1) out.push(m[1]);
  }
  return out;
}

function readPickOrderFromCore() {
  var corePath = path.join(SCENES_DIR, 'core.js');
  if (!fs.existsSync(corePath)) return null;
  var src = fs.readFileSync(corePath, 'utf8');
  var m = /var\s+PICK_BY_YEAR\s*=\s*(\[[\s\S]*?\]);/.exec(src);
  if (!m) return null;
  var ids = [];
  var re = /\[\s*(?:-?\d+|Infinity)\s*,\s*['"]([a-z0-9_]+)['"]\s*\]/g;
  var rm;
  while ((rm = re.exec(m[1])) !== null) {
    if (ids.indexOf(rm[1]) === -1) ids.push(rm[1]);
  }
  return ids.length ? ids : null;
}

function buildJobs() {
  var jobs = [];
  var baseUrl = url.pathToFileURL(PREVIEW_HTML).href;
  var common = '&vw=' + vw + '&vh=' + vh + '&t=' + encodeURIComponent(tVal) + '&panel=' + panel + '&road=' + road + (filesArg ? '&files=' + encodeURIComponent(filesArg) : '');

  if (worker) {
    var wf = path.join(SCENES_DIR, 'bg_' + worker + '.js');
    var wids = extractIdsFromFile(wf);
    if (!wids.length) throw new Error('Isci dosyasinda sahne bulunamadi: ' + wf);
    var wFiles = filesArg || ('bg_' + worker + '.js');
    for (var k = 0; k < wids.length; k += 4) {
      var chunk = wids.slice(k, k + 4);
      var idx = Math.floor(k / 4) + 1;
      jobs.push({
        label: worker + '_' + idx,
        out: path.join(SHOTS_DIR, worker + '_' + idx + '.png'),
        url: baseUrl + '?grid=' + encodeURIComponent(chunk.join(',')) + '&files=' + encodeURIComponent(wFiles) + '&vw=' + vw + '&vh=' + vh + '&t=' + encodeURIComponent(tVal) + '&panel=' + panel + '&road=' + road
      });
    }
  } else if (gridArg) {
    var gout = outArg ? path.resolve(outArg) : path.join(SHOTS_DIR, 'grid.png');
    jobs.push({
      label: path.basename(gout),
      out: gout,
      url: baseUrl + '?grid=' + encodeURIComponent(gridArg.join(',')) + common
    });
  } else if (idsArg) {
    for (var j = 0; j < idsArg.length; j++) {
      var id = idsArg[j];
      jobs.push({
        label: id,
        out: path.join(SHOTS_DIR, id + '.png'),
        url: baseUrl + '?scene=' + encodeURIComponent(id) + common
      });
    }
  } else if (allMode) {
    var order = readPickOrderFromCore();
    var allIds = [];
    if (order) {
      allIds = order.concat(['bogaz']);
    } else {
      var fileList = ['bosphorus.js', 'themes.js', 'bg_a.js', 'bg_b.js', 'bg_c.js', 'bg_d.js', 'bg_e.js', 'bg_f.js'];
      for (var fi = 0; fi < fileList.length; fi++) {
        var fids = extractIdsFromFile(path.join(SCENES_DIR, fileList[fi]));
        for (var ii = 0; ii < fids.length; ii++) {
          if (allIds.indexOf(fids[ii]) === -1) allIds.push(fids[ii]);
        }
      }
    }
    for (var s = 0; s < allIds.length; s += 4) {
      var grp = allIds.slice(s, s + 4);
      var num = String(Math.floor(s / 4) + 1);
      if (num.length < 2) num = '0' + num;
      jobs.push({
        label: 'sheet_' + num,
        out: path.join(SHOTS_DIR, 'sheet_' + num + '.png'),
        url: baseUrl + '?grid=' + encodeURIComponent(grp.join(',')) + common
      });
    }
  } else {
    throw new Error('Mod belirtin: --worker <x>, --ids a,b, --grid a,b,c,d veya --all');
  }
  return jobs;
}

var edge = findEdge();
var profileDir = path.join(os.tmpdir(), 'pusulla_shot' + (worker ? '_' + worker : ''));
var jobs = buildJobs();

if (!checkMode) {
  fs.mkdirSync(SHOTS_DIR, { recursive: true });
}

var failCount = 0;

for (var ji = 0; ji < jobs.length; ji++) {
  var job = jobs[ji];
  if (!checkMode) {
    fs.mkdirSync(path.dirname(job.out), { recursive: true });
    var res = cp.spawnSync(edge, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--user-data-dir=' + profileDir,
      '--window-size=' + vw + ',' + vh,
      '--virtual-time-budget=3000',
      '--screenshot=' + job.out,
      job.url
    ], { encoding: 'utf8' });
    if (res.status !== 0 || !fs.existsSync(job.out)) {
      console.error('FAIL shot ' + job.label + ' (code=' + res.status + ')');
      if (res.stderr) console.error(res.stderr.trim());
      failCount++;
    } else {
      console.log('SHOT ' + job.out);
    }
  } else {
    var chk = cp.spawnSync(edge, [
      '--headless=new',
      '--disable-gpu',
      '--user-data-dir=' + profileDir,
      '--window-size=' + vw + ',' + vh,
      '--virtual-time-budget=3000',
      '--dump-dom',
      job.url
    ], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    var dom = chk.stdout || '';
    var errMatch = /<pre\s+id=["']err["'][^>]*>([\s\S]*?)<\/pre>/i.exec(dom);
    var errText = errMatch ? errMatch[1].trim() : '';
    var titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(dom);
    var titleTxt = titleMatch ? titleMatch[1].trim() : '';
    if (chk.status !== 0 || errText || titleTxt === 'ERR') {
      console.error('CHECK FAIL ' + job.label + ': ' + (errText || ('title=' + titleTxt + ' code=' + chk.status)));
      failCount++;
    } else {
      console.log('CHECK OK ' + job.label);
    }
  }
}

if (failCount > 0) process.exit(1);
