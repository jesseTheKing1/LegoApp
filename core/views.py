from django.http import HttpResponse

def home(request):
    html = """
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hi Sarah</title>
  <style>
    body{
      margin:0;
      min-height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#0f172a;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color:#e2e8f0;
    }
    .card{
      width:min(92vw, 420px);
      padding:28px 22px;
      border-radius:18px;
      background:rgba(255,255,255,0.08);
      border:1px solid rgba(255,255,255,0.12);
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
      text-align:center;
    }
    h1{
      margin:0;
      font-size: clamp(32px, 8vw, 44px);
      letter-spacing:-0.02em;
    }
    p{
      margin:10px 0 0;
      font-size: 16px;
      opacity:0.85;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hi Sarah</h1>
    <p>Hope you’re having a good day 💛</p>
  </div>
</body>
</html>
"""
    return HttpResponse(html)
