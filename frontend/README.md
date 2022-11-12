# File management

```
frontend
|-- data
|-- js
| |-- components
| | |-- put your component here
| |-- utils
| | |-- put your util here
| |-- index.js: main js for event listener
|-- index.html
```

Remeber to include your component in index.html like this:<br>

```html
<!-- import component -->
<script src="js/components/bubble.js"></script>
<!-- import util -->
<script src="js/utils/timeFilter.js"></script>
```

Data format (note that `time` is an Array with 24 time slots):<br>
```
<ISO 3166-1 alpha-2 country>: {
    "sourceLatitude": "42.5",
    "sourceLongitude": "1.5167",
    "date": {
        "Sun Mar 10 2019": {
            "numberOfAlerts": 4,
            "detail": [
                {
                    "ID": "f93b855c-debf-4117-8a68-8aea13d7a87a",
                    "Category": "Recon.Scanning",
                    "ConnCount": "66",
                    "ProtocolType": "tcp"
                },...
            ],
            "target": [
                "49.6167,15.5833"
            ],
            "time": [
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 1,
                    "detail": [
                        {
                            "ID": "920fc4c5-2a27-4a2f-8fcc-338de86bd17b",
                            "Category": "Recon.Scanning",
                            "ConnCount": "2",
                            "ProtocolType": "tcp"
                        }
                    ],
                    "target": [
                        "49.6167,15.5833"
                    ]
                },
                {
                    "numberOfAlerts": 2,
                    "detail": [
                        {
                            "ID": "f93b855c-debf-4117-8a68-8aea13d7a87a",
                            "Category": "Recon.Scanning",
                            "ConnCount": "66",
                            "ProtocolType": "tcp"
                        },
                        {
                            "ID": "0625f1d8-6743-44d3-a983-fa3c0400c206",
                            "Category": "Recon.Scanning",
                            "ConnCount": "65",
                            "ProtocolType": "tcp"
                        }
                    ],
                    "target": [
                        "49.6167,15.5833"
                    ]
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                },
                {
                    "numberOfAlerts": 1,
                    "detail": [
                        {
                            "ID": "1941b3d0-5d53-40a3-96e2-93cb7ce9f9df",
                            "Category": "Recon.Scanning",
                            "ConnCount": "50",
                            "ProtocolType": "tcp"
                        }
                    ],
                    "target": [
                        "49.6167,15.5833"
                    ]
                },
                {
                    "numberOfAlerts": 0,
                    "detail": [],
                    "target": []
                }
            ]
        }, ...
    }
}
```