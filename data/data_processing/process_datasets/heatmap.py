import pyspark.sql.functions as F
from pyspark.sql import DataFrame


def get_heatmap(df: DataFrame) -> DataFrame:
    return (
        df.withColumn("Date", F.date_format(F.col("EventTime"), "yyyy-MM-dd"))
        .withColumn("Time", F.date_format(F.col("EventTime"), "HH:mm"))
        .groupBy("Date", "Time")
        .count()
    )
