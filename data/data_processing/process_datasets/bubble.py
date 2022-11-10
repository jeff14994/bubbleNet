import pyspark.sql.functions as F
from pyspark.sql import DataFrame
from pyspark.sql.types import StructType

from data_processing.utils.util import get_source_data, get_target_data

attacks_to = StructType([])


def get_bubbles(df: DataFrame, geo_ip_df: DataFrame) -> DataFrame:
    df = df.withColumn("Category", F.col("Category").getItem(0))
    df = df.withColumn("ProtocolType", F.col("Source.Proto").getItem(0).getItem(0))
    # assume for now that we only want the source country
    geo_enriched_data_src = get_source_data(
        df, geo_ip_df, include_long_lat=True, include_region=True
    )
    geo_enriched_data_tgt = get_target_data(
        df, geo_ip_df, include_long_lat=True, include_region=True
    )
    # let's pair down the data to what we need, otherwise the driver/executor will run out of memory
    geo_enriched_data_tgt = geo_enriched_data_tgt.select(
        "ID",
        "EventTime",
        "TargetCountry",
        "TargetCountry",
        "TargetLatitude",
        "TargetLongitude",
        "TargetRegion",
    )
    geo_enriched_data_src = geo_enriched_data_src.select(
        "ID",
        "SourceCountry",
        "SourceLongitude",
        "SourceLatitude",
        "SourceRegion",
        "Category",
        "ProtocolType",
        "ConnCount"
    )
    # let's join the two dataframes
    geo_enriched_data = geo_enriched_data_src.join(
        geo_enriched_data_tgt, on="ID", how="inner"
    )

    return geo_enriched_data.select(
        "ID",
        "EventTime",
        "SourceCountry",
        "SourceLatitude",
        "SourceLongitude",
        "SourceRegion",
        "TargetCountry",
        "TargetLatitude",
        "TargetLongitude",
        "TargetRegion",
        "Category",
        "ConnCount",
    )
