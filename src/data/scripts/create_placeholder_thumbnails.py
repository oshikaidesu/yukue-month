#!/usr/bin/env python3
"""
プレースホルダーサムネイル画像を作成するスクリプト
"""

import json
import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import textwrap

def create_placeholder_thumbnail(video_id, title, artist, output_dir):
    """プレースホルダーサムネイル画像を作成"""
    
    # 出力ファイル名
    output_file = output_dir / f"{video_id}.jpg"
    
    # 既に存在する場合はスキップ
    if output_file.exists():
        print(f"Already exists: {output_file}")
        return str(output_file)
    
    # 画像サイズ（16:9のアスペクト比）
    width, height = 320, 180
    
    # 背景色（グラデーション）
    img = Image.new('RGB', (width, height), color='#1a1a1a')
    draw = ImageDraw.Draw(img)
    
    # グラデーション背景
    for y in range(height):
        r = int(26 + (y / height) * 30)  # 26-56
        g = int(26 + (y / height) * 30)  # 26-56
        b = int(26 + (y / height) * 50)  # 26-76
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    
    try:
        # フォント（システムフォントを使用）
        font_large = ImageFont.truetype("/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc", 16)
        font_small = ImageFont.truetype("/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc", 12)
    except:
        # フォールバック
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # タイトルを描画
    title_lines = textwrap.wrap(title, width=25)
    title_y = 40
    
    for line in title_lines:
        # テキストの境界を取得
        bbox = draw.textbbox((0, 0), line, font=font_large)
        text_width = bbox[2] - bbox[0]
        text_x = (width - text_width) // 2
        
        # 影を描画
        draw.text((text_x + 1, title_y + 1), line, font=font_large, fill='#000000')
        # テキストを描画
        draw.text((text_x, title_y), line, font=font_large, fill='#ffffff')
        title_y += 20
    
    # アーティスト名を描画
    if artist:
        artist_y = title_y + 10
        artist_text = f"by {artist}"
        
        # テキストの境界を取得
        bbox = draw.textbbox((0, 0), artist_text, font=font_small)
        text_width = bbox[2] - bbox[0]
        text_x = (width - text_width) // 2
        
        # 影を描画
        draw.text((text_x + 1, artist_y + 1), artist_text, font=font_small, fill='#000000')
        # テキストを描画
        draw.text((text_x, artist_y), artist_text, font=font_small, fill='#cccccc')
    
    # 動画IDを描画
    id_y = height - 30
    id_text = video_id
    
    # テキストの境界を取得
    bbox = draw.textbbox((0, 0), id_text, font=font_small)
    text_width = bbox[2] - bbox[0]
    text_x = (width - text_width) // 2
    
    # 影を描画
    draw.text((text_x + 1, id_y + 1), id_text, font=font_small, fill='#000000')
    # テキストを描画
    draw.text((text_x, id_y), id_text, font=font_small, fill='#888888')
    
    # 再生ボタンのアイコンを描画
    play_x = width // 2 - 15
    play_y = height // 2 - 15
    
    # 円形の背景
    draw.ellipse([play_x - 20, play_y - 20, play_x + 20, play_y + 20], 
                 fill='#ff0000', outline='#ffffff', width=2)
    
    # 再生ボタン（三角形）
    draw.polygon([(play_x - 5, play_y - 10), (play_x - 5, play_y + 10), (play_x + 15, play_y)], 
                 fill='#ffffff')
    
    # 画像を保存
    img.save(output_file, 'JPEG', quality=85)
    print(f"Created: {output_file}")
    return str(output_file)

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
                
                # 各動画のプレースホルダーサムネイルを作成
                for video in videos:
                    video_id = video.get('id')
                    title = video.get('title', '')
                    artist = video.get('artist', '')
                    
                    if video_id:
                        thumbnail_path = create_placeholder_thumbnail(video_id, title, artist, output_dir)
                        if thumbnail_path:
                            # データにサムネイルパスを追加
                            video['thumbnail'] = f"/thumbnails/{video_id}.jpg"
                
                # 更新されたデータを保存
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(videos, f, ensure_ascii=False, indent=2)
                
                print(f"Updated {json_file}")
                
            except Exception as e:
                print(f"Error processing {json_file}: {e}")

if __name__ == "__main__":
    process_video_files() 