# ニコニコ動画プレイリスト解析スクリプト

このスクリプトは、ニコニコ動画のプレイリストから動画情報を取得し、JSONファイルを生成します。

## セットアップ

1. Python 3.7以上をインストール
2. 依存関係をインストール：

```bash
cd scripts
pip install -r requirements.txt
```

## 使用方法

### 基本的な使用方法

```bash
python generate_videos_json.py "プレイリストURL"
```

### 出力ファイルを指定する場合

```bash
python generate_videos_json.py "プレイリストURL" --output "custom_output.json"
```

### 例

```bash
# プレイリストからJSONファイルを生成
python generate_videos_json.py "https://www.nicovideo.jp/mylist/12345678"

# カスタム出力ファイル名で生成
python generate_videos_json.py "https://www.nicovideo.jp/mylist/12345678" -o "my_videos.json"
```

## 機能

- プレイリストから動画IDを自動抽出
- 各動画の詳細情報を取得（タイトル、説明、投稿者、再生回数、いいね数、タグなど）
- VOCALOID動画の自動判定
- 生成されたJSONファイルは `src/data/videos.json` の形式に準拠

## 注意事項

- ニコニコ動画のAPI制限を考慮して、動画情報取得時に1秒の待機時間を設けています
- 大量の動画があるプレイリストの場合、処理に時間がかかる可能性があります
- プレイリストが非公開の場合は情報を取得できません

## 生成されるJSONの形式

```json
[
  {
    "id": "sm12345678",
    "title": "動画タイトル",
    "description": "動画の説明",
    "url": "https://www.nicovideo.jp/watch/sm12345678",
    "platform": "nicovideo",
    "category": "VOCALOID",
    "dateAdded": "2024-01-15",
    "rank": null,
    "views": 15000,
    "likes": 1200,
    "tags": ["VOCALOID", "初音ミク"],
    "artist": "投稿者名",
    "vocaloid": "初音ミク"
  }
]
``` 