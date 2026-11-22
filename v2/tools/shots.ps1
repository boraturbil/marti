$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edge)) {
  $edge = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}
$base = "file:///D:/mart%C4%B1/v2/index.html"
$out  = "D:\martı\v2\shots"
New-Item -ItemType Directory -Force $out | Out-Null
$ud   = Join-Path $env:TEMP "marti_edge_shot_profile"

$list = @(
  'zirve:0','zirve:1','zirve:2','zirve:3','zirve:4','zirve:5',
  'dip:1','dip:2','dip:3','dip:4',
  'orta:0','orta:1','orta:2','orta:3','orta:4','orta:5',
  'menu','question','result:zirve:0','cine:zirve','end:zirve'
)

foreach ($s in $list) {
  $name = ($s -replace ':', '_') + '.png'
  $tmp  = Join-Path $env:TEMP ("marti_shot_" + $name)
  $dest = Join-Path $out $name
  $args = @(
    '--headless=new',
    "--user-data-dir=$ud",
    '--disable-gpu',
    '--hide-scrollbars',
    '--window-size=1920,1080',
    '--virtual-time-budget=4000',
    "--screenshot=$tmp",
    "$base`?shot=$s"
  )
  Start-Process -FilePath $edge -ArgumentList $args -Wait -NoNewWindow
  if (Test-Path $tmp) {
    Move-Item -Force $tmp $dest
  }
}
