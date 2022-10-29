This project requires python 3.10 and Pyspark

I HIGHLY recommend avoiding windows for this (use WSL if you're on windows). You can get it to work, but it involves installing spark manually and is a pain.
https://cwiki.apache.org/confluence/display/HADOOP2/WindowsProblems


Easiest way to install is to use conda (this'll work on windows, but it'll error out when writing if you don't install spark/hadoop seperately)
```
conda create -n data_processing python=3.10 pyspark
conda activate data_processing
python main.py
```

Main has args, see: 
```
python main.py --help
```

Afterwards, your data will be folders under output. You want the actual csv file, will be be something like 
```
part-00000-<some hash>.csv
```


Depending on your system configuration, you might need to install Java. 

The unzipped contents of the dataset should be put in ./src_data
In the end, src_data should contain the following files:
```
Aux_1A_Geolocation.csv
Aux_1B_GIS_data
Aux_2_PassiveDNS
Aux_3_Enrichment
dataset.idea ( the uncompressed folder )
```
