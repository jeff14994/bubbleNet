/**
 *  CSE 578 Project
 *  Author: Yu-Hsien Tu
 *  Email: yuhsien1@asu.edu
 *  ASUID: 1222290303
 */

/**
 *  Function to preProcess the data_with_detail before rendering.
 *  Data Format:
 *  {
 *      US: {
 *              latitude: number,
 *              longitude: number,
 *              date: {
 *                      2019-03-10: {
 *                                      numberOfAlerts: number,
 *                                      detail: [
 *                                                  {ID:string, Category: string ,ConnCount: number, ProtocolType: string},
 *                                      ],
 *                                      target: [TargetCountry: string],
 *       0-index array with 24 items -> time: [
 *                                                  {       
 *                                                          numberOfAlerts: number,
 *                                                          target: [string],
 *                                                          detail: [
 *                                                                      {ID:string, Category: string ,ConnCount: number, ProtocolType: string},
 *                                                          ],
 *                                                  },
 *                                                  ......
 *                                                 {...},
 *                                      ],
 *                      },
 *                      ......
 *                      2019-03-16: {...},
 *             },
 *     },
 *  }
 */
const preProcess = (rawData) => {
    let regionTable = {};
    rawData.forEach(record => {
        if (!regionTable.hasOwnProperty(record['SourceCountry'])){
            const dateRange = ['Sun Mar 10 2019', 'Mon Mar 11 2019', 'Tue Mar 12 2019', 'Wed Mar 13 2019', 'Thu Mar 14 2019', 'Fri Mar 15 2019', 'Sat Mar 16 2019'];
            const dateObject = {};
            dateRange.map(v => {
                dateObject[v] = dateObjectGenerator();
            });
            regionTable[record['SourceCountry']] = {
                sourceLatitude: record['SourceLatitude'], 
                sourceLongitude: record['SourceLongitude'],
                date: dateObject,
            };
        }
        const dateKey = new Date(record['EventTime']).toDateString('en-US');
        const timeKey = new Date(record['EventTime']).getHours();
        regionTable[record['SourceCountry']].date[dateKey].numberOfAlerts += 1;
        regionTable[record['SourceCountry']].date[dateKey].detail.push({ID: record['ID'], Category: record['Category'], ConnCount: record['ConnCount'], ProtocolType: record['ProtocolType']});
        regionTable[record['SourceCountry']].date[dateKey].time[timeKey].numberOfAlerts += 1;
        regionTable[record['SourceCountry']].date[dateKey].time[timeKey].detail.push({ID: record['ID'], Category: record['Category'], ConnCount: record['ConnCount'], ProtocolType: record['ProtocolType']});
        if (!regionTable[record['SourceCountry']].date[dateKey].target.includes(record['TargetCountry'])) {
            regionTable[record['SourceCountry']].date[dateKey].target.push(record['TargetCountry']);
        }
        if (!regionTable[record['SourceCountry']].date[dateKey].time[timeKey].target.includes(record['TargetCountry'])) {
            regionTable[record['SourceCountry']].date[dateKey].time[timeKey].target.push(record['TargetCountry']);
        }
    });    
    return regionTable;
}

/**
 *  Helper function for date object.
 */
const dateObjectGenerator = () => {
    const timeObject = timeObjectGenerator();
    return {
        numberOfAlerts: 0,
        detail: [],
        target: [],
        time: timeObject,
    };
}

/**
 *  Helper function for time object.
 */
const timeObjectGenerator = () => {
    const result = [];
    const iterator = [...Array(24).keys()];
    iterator.map(_ => {
        result.push({
            numberOfAlerts: 0, 
            detail: [], 
            target: []
        });
    })
    return result;
}