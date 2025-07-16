import requests
from bs4 import BeautifulSoup
import json

# HTMLファイルを読み込む
with open('src/data/scripts/kiite_import.html', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser')

# プレイリストの各曲を取得
playlist = soup.select('ol.col-playlist > li.media-info')

result = []
for li in playlist:
    video_id = li.get('data-video-id')
    h3 = li.select_one('h3')
    title = li.get('data-song-title') or (h3.text.strip() if h3 else "")
    url = f"https://www.nicovideo.jp/watch/{video_id}"
    creator = li.select_one('.playlist-creator')
    artist = li.get('data-creator-name') or (creator.text.strip() if creator else "")
    obj = {
        "id": video_id,
        "title": title,
        "url": url,
        "artist": artist
    }
    result.append(obj)

with open('src/data/scripts/kiite_playlist.json', 'w', encoding='utf-8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
