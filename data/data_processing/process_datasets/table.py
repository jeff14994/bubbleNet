# Should probably have a better name for this then 'table'

import pyspark.sql.functions as F
from pyspark.sql import DataFrame

from data_processing.utils.util import get_source_data


def get_table(df: DataFrame, geo_ip_df: DataFrame) -> DataFrame:
    # assume for now that we only want the source country
    df = get_source_data(df, geo_ip_df)
    return (
        df.withColumnRenamed("SourceCountry", "country")
        .withColumn("Category", F.col("Category").getItem(0))
        .select("Category", "ConnCount", "ID")
    )
