export const TABLE_COLUMNS = [
    "ID", "Media Type",
    "Likes", "Comments", "Saved", "Shares", "Total Interactions",
    // NOTE: video_views was deprecated after v21.0
    // "Video Views", "Replays", "Plays", "Total Plays", "Total Watch-time (Hours)",
    // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
    // "Replays", "Plays", "Total Plays", "Total Watch-time (Hours)",
    "Views", "Total Watch-time (Hours)",
    "Follows", "Impressions", "Profile Activity", "Profile Visits",
    "Owner", "Timestamp", "Permalink", "Errors"
]
export const TABLE_MAP = {
    "MEDIA": ["ID", "Media Type", "Owner", "Timestamp", "Permalink"],
    "GENERAL": ["Likes", "Comments", "Saved", "Shares", "Total Interactions"],
    // NOTE: video_views was deprecated after v21.0
    // "VIDEO": ["Video Views", "Replays", "Plays", "Total Plays", "Total Watch-time (Hours)"],
    // NOTE: clips_replays_count, plays, ig_reels_aggregated_all_plays_count deprecated after v22.0
    // "VIDEO": ["Replays", "Plays", "Total Plays", "Total Watch-time (Hours)"],
    "VIDEO": ["Views", "Total Watch-time (Hours)"],
    "POST": ["Follows", "Impressions", "Profile Activity", "Profile Visits"],
    "ERROR": ["Errors"]
}

export const CSV_KEY = "csvContent";
