#!/usr/bin/env python3
"""
ニコニコ動画のプレイリストからJSONファイルを生成するスクリプト
"""

import json
import requests
import re
from datetime import datetime
from typing import List, Dict, Any, Optional
import argparse
from urllib.parse import urlparse, parse_qs
import time
import xml.etree.ElementTree as ET

class NicovideoPlaylistParser:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

    def extract_video_id_from_url(self, url: str) -> Optional[str]:
        """URLから動画IDを抽出"""
        # sm12345678 形式のIDを抽出
        match = re.search(r'sm\d+', url)
        if match:
            return match.group()
        
        # URLパラメータから抽出
        parsed = urlparse(url)
        if 'nicovideo.jp' in parsed.netloc:
            path_parts = parsed.path.split('/')
            for part in path_parts:
                if part.startswith('sm'):
                    return part
        return None

    def get_video_info(self, video_id: str) -> Optional[Dict[str, Any]]:
        """動画IDから動画情報を取得"""
        try:
            # ニコニコ動画のAPIを使用して動画情報を取得
            api_url = f"https://ext.nicovideo.jp/api/getthumbinfo/{video_id}"
            response = self.session.get(api_url)
            response.raise_for_status()
            
            # XMLレスポンスをパース（簡易版）
            content = response.text
            
            # タイトルを抽出
            title_match = re.search(r'<title>(.*?)</title>', content)
            title = title_match.group(1) if title_match else f"動画 {video_id}"
            
            # 説明を抽出
            description_match = re.search(r'<description>(.*?)</description>', content)
            description = description_match.group(1) if description_match else ""
            
            # 投稿者を抽出
            user_match = re.search(r'<user_nickname>(.*?)</user_nickname>', content)
            artist = user_match.group(1) if user_match else "不明"
            
            # 再生回数を抽出
            view_count_match = re.search(r'<view_counter>(\d+)</view_counter>', content)
            views = int(view_count_match.group(1)) if view_count_match else 0
            
            # いいね数を抽出
            like_count_match = re.search(r'<like_counter>(\d+)</like_counter>', content)
            likes = int(like_count_match.group(1)) if like_count_match else 0
            
            # タグを抽出
            tags_match = re.search(r'<tags>(.*?)</tags>', content)
            tags = []
            if tags_match:
                tags_text = tags_match.group(1)
                # タグを分割（簡易版）
                tags = [tag.strip() for tag in tags_text.split() if tag.strip()]
            
            # VOCALOID判定
            vocaloid = None
            if any(tag in title or tag in description for tag in ['初音ミク', '鏡音リン', '鏡音レン', '巡音ルカ', 'MEIKO', 'KAITO']):
                vocaloid = '初音ミク'  # 簡易判定
            
            return {
                "id": video_id,
                "title": title,
                "description": description,
                "url": f"https://www.nicovideo.jp/watch/{video_id}",
                "platform": "nicovideo",
                "category": "VOCALOID" if vocaloid else "その他",
                "dateAdded": datetime.now().strftime("%Y-%m-%d"),
                "rank": None,
                "views": views,
                "likes": likes,
                "tags": tags,
                "artist": artist,
                "vocaloid": vocaloid
            }
            
        except Exception as e:
            print(f"動画 {video_id} の情報取得に失敗: {e}")
            return None

    def parse_playlist_url(self, playlist_url: str) -> List[str]:
        """プレイリストURLから動画IDのリストを取得（RSSフィード利用）"""
        try:
            # マイリストIDを抽出
            m = re.search(r'mylist/(\d+)', playlist_url)
            if not m:
                print("マイリストIDが抽出できませんでした")
                return []
            mylist_id = m.group(1)
            rss_url = f"https://www.nicovideo.jp/mylist/{mylist_id}?rss=2.0"
            response = self.session.get(rss_url)
            response.raise_for_status()
            root = ET.fromstring(response.content)
            video_ids = []
            for item in root.findall(".//item"):
                link = item.find("link").text
                vid_match = re.search(r'sm\d+', link)
                if vid_match:
                    video_ids.append(vid_match.group())
            unique_video_ids = sorted(list(set(video_ids)))
            print(f"RSSから見つかった動画ID: {unique_video_ids}")
            return unique_video_ids
        except Exception as e:
            print(f"RSSの解析に失敗: {e}")
            return []

    def generate_json_from_playlist(self, playlist_url: str, output_file: str = "../src/data/videos.json"):
        """プレイリストからJSONファイルを生成"""
        print(f"プレイリストを解析中: {playlist_url}")
        
        # 動画IDを取得
        video_ids = self.parse_playlist_url(playlist_url)
        print(f"見つかった動画数: {len(video_ids)}")
        
        if not video_ids:
            print("動画が見つかりませんでした。プレイリストが非公開または存在しない可能性があります。")
            # 空のJSONファイルを作成
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump([], f, ensure_ascii=False, indent=2)
            print(f"空のJSONファイルを作成しました: {output_file}")
            return
        
        videos = []
        for i, video_id in enumerate(video_ids, 1):
            print(f"動画情報を取得中 ({i}/{len(video_ids)}): {video_id}")
            
            video_info = self.get_video_info(video_id)
            if video_info:
                videos.append(video_info)
            
            # API制限を避けるため少し待機
            time.sleep(1)
        
        # JSONファイルに保存
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(videos, f, ensure_ascii=False, indent=2)
        
        print(f"JSONファイルを生成しました: {output_file}")
        print(f"生成された動画数: {len(videos)}")

def main():
    parser = argparse.ArgumentParser(description='ニコニコ動画のプレイリストからJSONファイルを生成')
    parser.add_argument('playlist_url', help='ニコニコ動画のプレイリストURL')
    parser.add_argument('--output', '-o', default='../src/data/videos.json', 
                       help='出力ファイルのパス (デフォルト: ../src/data/videos.json)')
    
    args = parser.parse_args()
    
    parser = NicovideoPlaylistParser()
    parser.generate_json_from_playlist(args.playlist_url, args.output)

if __name__ == "__main__":
    main() 