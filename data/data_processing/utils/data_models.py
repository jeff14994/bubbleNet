from pyspark.sql.types import StructType, StringType, ArrayType, StructField

node_fields = [
    "AggrWin",
    "SW",
    "Type",
    "Name",
]

node_struct = StructType(
    [
        StructField("AggrWin", StringType(), True),
        StructField("SW", StringType(), True),
        StructField("Type", ArrayType(StringType()), True),
        StructField("Name", StringType(), True),
    ]
)


target_fields = [
    "Anonymised",
    "Port",
    "IP4",
    "Proto",
]

target_struct = StructType(
    [
        StructField("Anonymised", StringType(), True),
        StructField("Port", StringType(), True),
        StructField("IP4", StringType(), True),
        StructField("Proto", StringType(), True),
    ]
)


source_fields = [
    "Port",
    "IP4",
    "Proto",
]

source_struct = StructType(
    [
        StructField("Port", StringType(), True),
        StructField("IP4", StringType(), True),
        StructField("Proto", StringType(), True),
    ]
)
