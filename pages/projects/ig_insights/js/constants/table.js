export const TABLE_COLUMNS = [
    "ID", "Media Type",
    "Likes", "Comments", "Saved", "Shares", "Total Interactions",
    // NOTE: video_views was deprecated after v21.0
    // "Video Views", "Replays", "Plays", "Total Plays", "Total Watch-time (Hours)",
    "Replays", "Plays", "Total Plays", "Total Watch-time (Hours)",
    "Follows", "Impressions", "Profile Activity", "Profile Visits",
    "Owner", "Timestamp", "Permalink", "Errors"
]
export const TABLE_MAP = {
    "MEDIA": ["ID", "Media Type", "Owner", "Timestamp", "Permalink"],
    "GENERAL": ["Likes", "Comments", "Saved", "Shares", "Total Interactions"],
    // NOTE: video_views was deprecated after v21.0
    // "VIDEO": ["Video Views", "Replays", "Plays", "Total Plays", "Total Watch-time (Hours)"],
    "VIDEO": ["Replays", "Plays", "Total Plays", "Total Watch-time (Hours)"],
    "POST": ["Follows", "Impressions", "Profile Activity", "Profile Visits"],
    "ERROR": ["Errors"]
}

export const CSV_KEY = "csvContent";
