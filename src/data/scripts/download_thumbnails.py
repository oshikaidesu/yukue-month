#!/usr/bin/env python3
"""
サムネイル画像をダウンロードするスクリプト
"""

import json
import os
import requests
import time
from pathlib import Path
from urllib.parse import urlparse

def download_thumbnail(video_id, video_url, output_dir):
    """サムネイル画像をダウンロード"""
    
    # プラットフォーム判定
    if 'youtube.com' in video_url or 'youtu.be' in video_url:
        # YouTube動画
        if 'youtu.be' in video_url:
            video_id = video_url.split('/')[-1].split('?')[0]
        elif 'youtube.com/watch' in video_url:
            video_id = video_url.split('v=')[1].split('&')[0]
        
        thumbnail_url = f"https://img.youtube.com/vi/{video_id}/hqdefault.jpg"
        platform = "youtube"
    elif 'nicovideo.jp' in video_url:
        # ニコニコ動画 - 正しいURL形式
        # 動画IDから数値部分を抽出（例：sm44500976 → 44500976）
        numeric_id = video_id.replace('sm', '').replace('nm', '')
        thumbnail_url = f"https://nicovideo.cdn.nimg.jp/thumbnails/{numeric_id}/{video_id}.L"
        platform = "nicovideo"
    else:
        print(f"Unknown platform for {video_url}")
        return None
    
    # 出力ファイル名
    output_file = output_dir / f"{video_id}.jpg"
    
    # 既に存在する場合はスキップ
    if output_file.exists():
        print(f"Already exists: {output_file}")
        return str(output_file)
    
    try:
        print(f"Downloading {thumbnail_url} -> {output_file}")
        response = requests.get(thumbnail_url, timeout=10)
        response.raise_for_status()
        
        with open(output_file, 'wb') as f:
            f.write(response.content)
        
        print(f"Downloaded: {output_file}")
        return str(output_file)
        
    except Exception as e:
        print(f"Failed to download {thumbnail_url}: {e}")
        return None

def process_video_files():
    """すべての動画ファイルを処理"""
    
    # データディレクトリ
    data_dir = Path(__file__).parent.parent
    output_dir = Path(__file__).parent.parent.parent.parent / "public" / "thumbnails"
    
    # 出力ディレクトリを作成
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # すべてのJSONファイルを処理
    for year_dir in data_dir.glob("20*"):
        if not year_dir.is_dir():
            continue
            
        print(f"Processing {year_dir}")
        
        for json_file in year_dir.glob("videos_*.json"):
            print(f"Processing {json_file}")
            
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    videos = json.load(f)
                
                # 各動画のサムネイルをダウンロード
                for video in videos:
                    video_id = video.get('id')
                    video_url = video.get('url')
                    
                    if video_id and video_url:
                        thumbnail_path = download_thumbnail(video_id, video_url, output_dir)
                        if thumbnail_path:
                            # データにサムネイルパスを追加
                            video['thumbnail'] = f"/thumbnails/{video_id}.jpg"
                        
                        # レート制限を避けるため少し待機
                        time.sleep(0.5)
                
                # 更新されたデータを保存
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(videos, f, ensure_ascii=False, indent=2)
                
                print(f"Updated {json_file}")
                
            except Exception as e:
                print(f"Error processing {json_file}: {e}")

if __name__ == "__main__":
    process_video_files() 