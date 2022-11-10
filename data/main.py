import datetime
import os
import shutil
from typing import List, Tuple

from pandas import DataFrame
from pyspark.sql import DataFrame
import argparse

from data_processing.utils.util import get_spark_session, write_to_single_csv, pre_process_dataset

spark = get_spark_session()
data_dir = "data_processing/src_data"


def load_datasets() -> tuple[DataFrame, DataFrame, DataFrame]:
    geo_ip = (
        spark.read.option("header", "true")
        .option("delimiter", ";")
        .csv(f"{data_dir}/Aux_1A_Geolocation.csv")
    )
    # Don't actually need passive_dns, but spark is lazily evaluated, so it's fine and might be useful later
    passive_dns = spark.read.csv(
        f"{data_dir}/Aux_2_PassiveDNS.csv", header=True, inferSchema=True
    )

    dataset = spark.read.json(f"{data_dir}/dataset.idea/dataset.idea")
    dataset = pre_process_dataset(dataset)
    return geo_ip, passive_dns, dataset


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--dataset",
        "-ds",
        type=str,
        default="all",
        choices=["all", "alert_timer", "bullet_chart", "table", "bubble", "heatmap"],
    )
    parser.add_argument("--output_dir", "-o", type=str, default="./output")
    parser.add_argument(
        "--sample",
        "-s",
        type=int,
        default=None,
        help="Number of rows to deterministically sample from the dataset, if None, then the entire dataset is used",
    )
    parser.add_argument(
        '--min-date',
        type=datetime.datetime.fromisoformat,
        default=None,
        help='The minimum date to include in the dataset, if None, then the entire dataset is used'
    )
    parser.add_argument(
        '--max-date',
        type=datetime.datetime.fromisoformat,
        default=None,
        help='The maximum date to include in the dataset, if None, then the entire dataset is used'
    )
    return parser.parse_args()


def main():
    args = parse_args()
    geo_ip, passive_dns, dataset = load_datasets()
    if args.sample is not None:
        dataset = dataset.sample(False, args.sample / dataset.count())

    if os.path.exists(args.output_dir):
        print(f"Do you want to delete the current data directory?: Y/N")
        res = input()
        if res.lower() in ["y", "yes"]:
            shutil.rmtree(args.output_dir)
    os.makedirs(args.output_dir, exist_ok=True)

    if args.dataset == "all":
        datasets = ["alert_timer", "bullet_chart", "table", "bubble", "heatmap"]
    else:
        datasets = [args.dataset]

    for ds in datasets:
        match ds:
            case "alert_timer":
                print("Processing alert_timer")
                from data_processing.process_datasets.alert_timer import get_alert_timer

                df = get_alert_timer(dataset, geo_ip)
                write_to_single_csv(df, f"{args.output_dir}/alert_timer")
            case "bullet_chart":
                print("Processing bullet_chart")
                from data_processing.process_datasets.bullet_chart import (
                    get_bullet_chart,
                )

                df = get_bullet_chart(dataset, geo_ip)
                write_to_single_csv(df, f"{args.output_dir}/bullet_chart")
            case "table":
                print("Processing table")
                from data_processing.process_datasets.table import get_table

                df = get_table(dataset, geo_ip)
                write_to_single_csv(df, f"{args.output_dir}/table")
            case "bubble":
                print("Processing bubble")
                from data_processing.process_datasets.bubble import get_bubbles

                df = get_bubbles(dataset, geo_ip)
                write_to_single_csv(df, f"{args.output_dir}/bubble")
            case "heatmap":
                print("Processing heatmap")
                from data_processing.process_datasets.heatmap import get_heatmap

                df = get_heatmap(dataset)
                write_to_single_csv(df, f"{args.output_dir}/heatmap")


if __name__ == "__main__":
    main()
