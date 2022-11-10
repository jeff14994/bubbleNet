import datetime

from pyspark.sql import DataFrame, SparkSession
import pyspark.sql.functions as F

RANDOM_SEED = 42


def get_spark_session() -> SparkSession:
    """
    This function returns a spark session
    """
    return SparkSession.builder.appName("data_processing").getOrCreate()


def sample_dataset(dataset: DataFrame, sample_size: int = 1000) -> DataFrame:
    """
    This function returns a sample of the dataset
    """
    return dataset.sample(False, sample_size / dataset.count(), seed=RANDOM_SEED)


def get_source_data(
    df: DataFrame, geo_ip_df: DataFrame, include_long_lat=False, include_region=False
) -> DataFrame:
    added_cols = ["SourceCountry"]
    enriched_df = df.join(
        geo_ip_df, df.Source.IP4.getItem(0).getItem(0) == geo_ip_df.ANIP, how="left"
    ).withColumnRenamed("Country", "SourceCountry")
    if include_long_lat:
        enriched_df = enriched_df.withColumnRenamed(
            "Lon", "SourceLongitude"
        ).withColumnRenamed("Lat", "SourceLatitude")
        added_cols.append("SourceLongitude")
        added_cols.append("SourceLatitude")
    if include_region:
        enriched_df = enriched_df.withColumnRenamed("Region", "SourceRegion")
        added_cols.append("SourceRegion")

    return enriched_df.select(*df.columns, *added_cols)


def get_target_data(
    df: DataFrame, geo_ip_df: DataFrame, include_long_lat=False, include_region=False
) -> DataFrame:
    added_cols = ["TargetCountry"]
    enriched_df = df.join(
        geo_ip_df, df.Target.IP4.getItem(0).getItem(0) == geo_ip_df.ANIP, how="left"
    ).withColumnRenamed("Country", "TargetCountry")
    if include_long_lat:
        enriched_df = enriched_df.withColumnRenamed(
            "Lon", "TargetLongitude"
        ).withColumnRenamed("Lat", "TargetLatitude")
        added_cols.append("TargetLongitude")
        added_cols.append("TargetLatitude")
    if include_region:
        enriched_df = enriched_df.withColumnRenamed("Region", "TargetRegion")
        added_cols.append("TargetRegion")

    return enriched_df.select(*df.columns, *added_cols)


def pre_process_dataset(df: DataFrame, min_date: datetime.datetime = None, max_date: datetime.datetime = None) -> DataFrame:
    """
    This function takes the raw dataset and returns a processed dataset
    """
    # Filter to the simpler data where we only have a single source, target, and node. ( Still leaves us with ~5m rows
    df = (
        df.filter(F.size(F.col("Source")) == 1)
        .filter(F.size(F.col("Target")) == 1)
        .filter(F.size(F.col("Node")) == 1)
    )
    if min_date:
        df = df.filter(F.col("EventTime") >= min_date)
    if max_date:
        df = df.filter(F.col("EventTime") <= max_date)
    # Convert the DetectTime column to a timestamp
    df = df.withColumn("EventTime", F.to_timestamp("EventTime")).filter(
        F.col("EventTime").isNotNull()
    )
    return df


def write_to_single_csv(df: DataFrame, path: str) -> None:
    """
    This function writes a dataframe to a single csv file
    """
    df.coalesce(1).write.format("csv").option("header", "true").save(path)
