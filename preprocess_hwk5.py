import pandas as pd
from pathlib import Path

data_path = Path("data/Teen_Mental_Health_Dataset.csv")
output_path = Path("data/hwk5_summary.csv")

df = pd.read_csv(data_path)

df["daily_social_media_hours"] = pd.to_numeric(df["daily_social_media_hours"], errors="coerce")
df["sleep_hours"] = pd.to_numeric(df["sleep_hours"], errors="coerce")
df["depression_label"] = pd.to_numeric(df["depression_label"], errors="coerce")

df = df.dropna(subset=["daily_social_media_hours", "sleep_hours", "depression_label"])

df["social_media_group"] = df["daily_social_media_hours"].apply(
    lambda x: "6h or more" if x >= 6 else "Less than 6h"
)

df["sleep_group"] = df["sleep_hours"].apply(
    lambda x: "Under 6h" if x < 6 else "6h or more"
)

summary = (
    df.groupby(["social_media_group", "sleep_group"])
    .agg(
        total_teens=("depression_label", "size"),
        depression_labeled=("depression_label", "sum"),
        depression_rate_percent=("depression_label", lambda x: round(x.mean() * 100, 1))
    )
    .reset_index()
)

summary.to_csv(output_path, index=False)

print(summary)
print("Saved:", output_path)