import pyspark.sql.functions as F

from data_processing.utils.util import get_source_data


def get_alert_timer(dataset, geo_ip):
    """
    This function returns a dataframe with the following columns:
    - numberOfAlerts
    - date
    - time
    - country
    """

    # Basic aggregation -- we can add in filters for categories if we want to
    # Time is going to the `EventTime` column
    # granularity on time is going to be a minute
    dataset = get_source_data(dataset, geo_ip)
    alerts = dataset.withColumn(
        "Time", F.date_format(F.col("EventTime"), "HH:mm")
    ).withColumn("Date", F.date_format(F.col("EventTime"), "yyyy-MM-dd"))
    return (
        alerts.groupBy("Time", "Date", "SourceCountry")
        .count()
        .withColumn("numberOfAlerts", F.col("count"))
        .drop("count")
    )
