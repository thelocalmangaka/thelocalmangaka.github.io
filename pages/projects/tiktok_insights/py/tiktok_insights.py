import asyncio
import csv
import time
from datetime import datetime
from TikTokApi import TikTokApi

CSV_FILE = "tiktok_insights.csv"

DEFAULT_MAX_VIDEOS = 1000
DEFAULT_WATCH_MULTIPLIER = 0.5
BATCH_SIZE = 50
BATCH_PAUSE = 2.0
MAX_RETRIES = 3

def _to_int_safe(x):
    """Convert TikTok stats to int safely (handles '1.2K', strings, None)."""
    try:
        if x is None:
            return 0
        if isinstance(x, (int, float)):
            return int(x)
        s = str(x).strip().replace(",", "").replace(" ", "")
        if s == "":
            return 0
        if "." in s:
            return int(float(s))
        lower = s.lower()
        if lower.endswith("k"):
            return int(float(lower[:-1]) * 1000)
        if lower.endswith("m"):
            return int(float(lower[:-1]) * 1_000_000)
        return int(s)
    except Exception:
        return 0


async def fetch_user_videos_to_csv(username: str, watch_multiplier: float = DEFAULT_WATCH_MULTIPLIER, max_videos: int = DEFAULT_MAX_VIDEOS):
    try:
        with open("ms_token.txt", "r") as f:
            ms_token = f.read().strip()
    except FileNotFoundError:
        print("❌ ms_token.txt not found. Please create it and paste your TikTok ms_token inside.")
        return

    print(f"▶️ Fetching videos for user: {username}, up to {max_videos} videos")
    print(f"   Using watch multiplier: {watch_multiplier}")

    videos_data = []
    video_ids_seen = set()
    total_watch_time = 0

    try:
        async with TikTokApi() as api:
            await api.create_sessions(ms_tokens=[ms_token], num_sessions=1, browser="chromium", headless=True)

            user = api.user(username=username)

            count = 0
            retries = 0
            cursor = 0

            while count < max_videos and retries < MAX_RETRIES:
                try:
                    async for video in user.videos(count=max_videos, cursor=cursor):
                        if video.id in video_ids_seen:
                            continue
                        video_ids_seen.add(video.id)

                        stats = video.stats or {}
                        views = _to_int_safe(stats.get("playCount"))
                        likes = _to_int_safe(stats.get("diggCount"))
                        shares = _to_int_safe(stats.get("shareCount"))
                        comments = _to_int_safe(stats.get("commentCount"))

                        duration_sec = _to_int_safe(video.as_dict.get("video", {}).get("duration"))
                        duration_ms = duration_sec * 1000

                        create_time = getattr(video, "create_time", None)
                        created_at = create_time.strftime("%Y-%m-%d %H:%M:%S") if create_time else ""

                        est_watch_time_ms = round(duration_ms * watch_multiplier)
                        total_est_watch_time = est_watch_time_ms * views
                        total_watch_time += total_est_watch_time

                        videos_data.append({
                            "id": video.id,
                            "views": views,
                            "likes": likes,
                            "comments": comments,
                            "shares": shares,
                            "created_at": created_at,
                            "total_est_watch_time": total_est_watch_time,
                        })

                        count += 1
                        if count % 10 == 0:
                            print(f"   ✅ Fetched {count}/{max_videos}")

                        if count % BATCH_SIZE == 0:
                            print(f"   ⏸️  Batch pause: sleeping {BATCH_PAUSE}s...")
                            time.sleep(BATCH_PAUSE)

                    break
                except Exception as e:
                    retries += 1
                    print(f"⚠️ Error on attempt {retries}: {repr(e)}")
                    if retries < MAX_RETRIES:
                        print("   Retrying after short pause...")
                        await asyncio.sleep(3)
                    else:
                        print("   ❌ Max retries reached. Writing partial results...")

    finally:
        fieldnames = [
            "id",
            "views",
            "likes",
            "comments",
            "shares",
            "created_at",
            "total_est_watch_time",
        ]
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(videos_data)

            # Append totals row
            totals = {
                "id": "TOTALS",
                "views": sum(v["views"] for v in videos_data),
                "likes": sum(v["likes"] for v in videos_data),
                "comments": sum(v["comments"] for v in videos_data),
                "shares": sum(v["shares"] for v in videos_data),
                "created_at": "",
                "total_est_watch_time": total_watch_time,
            }
            writer.writerow(totals)

        print(f"\n✅ Done. Wrote {len(videos_data)} rows to {CSV_FILE}")
        print("Totals:", totals)


if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python tiktok_insights.py <username> [watch_multiplier] [max_videos]")
    else:
        username = sys.argv[1]
        watch_multiplier = float(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_WATCH_MULTIPLIER
        max_videos = int(sys.argv[3]) if len(sys.argv) > 3 else DEFAULT_MAX_VIDEOS
        asyncio.run(fetch_user_videos_to_csv(username, watch_multiplier, max_videos))
