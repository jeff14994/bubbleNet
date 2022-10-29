import pyspark.sql.functions as F
from pyspark.sql import DataFrame

from data_processing.utils.util import get_source_data


def get_bullet_chart(df: DataFrame, geo_ip_df: DataFrame) -> DataFrame:
    # assume for now that we only want the source country
    df = get_source_data(df, geo_ip_df)
    return (
        df.withColumn("Date", F.date_format(F.col("EventTime"), "yyyy-MM-dd"))
        .withColumn("ProtocolType", F.col("Source.Proto").getItem(0).getItem(0))
        .withColumnRenamed("SourceCountry", "country")
        .withColumn("Category", F.col("Category").getItem(0))
        .select("ID", "Date", "Country", "Category", "ProtocolType")
    )
