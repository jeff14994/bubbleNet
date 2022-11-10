/**
 *  CSE 578 Project
 *  Author: Yu-Hsien Tu
 *  Email: yuhsien1@asu.edu
 *  ASUID: 1222290303
 */

/**
 *  Function to filter data with given time period.
 */
const dateFilter = (data, startTime, endTime) => {
    let regionTable = {};
    data.forEach(value => {
        const sourceTime = new Date(value['EventTime']);
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (sourceTime >= start && sourceTime <= end) {
            if (regionTable.hasOwnProperty(value['SourceCountry'])){
                const dateKey = new Date(value['EventTime']).toDateString('en-US');
                if (regionTable[value['SourceCountry']].date.hasOwnProperty(dateKey)){
                    regionTable[value['SourceCountry']].date[dateKey].numberOfAlerts += 1;
                    if (!regionTable[value['SourceCountry']].date[dateKey].target.includes([value['TargetLatitude'], value['TargetLongitude']])){
                        regionTable[value['SourceCountry']].date[dateKey].target.push([value['TargetLatitude'], value['TargetLongitude']]);
                    }
                } else {
                    regionTable[value['SourceCountry']].date[dateKey] = {
                        numberOfAlerts: 1,
                        target: [[value['TargetLatitude'], value['TargetLongitude']]]
                    }
                }
            } else {
                const dateKey = new Date(value['EventTime']).toDateString('en-US');
                regionTable[value['SourceCountry']] = {
                    sourceLatitude: value['SourceLatitude'], 
                    sourceLongitude: value['SourceLongitude'],
                    date: {}
                };
                regionTable[value['SourceCountry']].date[dateKey] = {numberOfAlerts: 1, target: [[value['TargetLatitude'], value['TargetLongitude']]]};
            }
        }
    });
    return regionTable;
}

const dayFilter = (regionTable, date) => {
    const result = []
    const targetDate = new Date(date).toDateString('en-US');
    Object.entries(regionTable).forEach(([key,value]) => {
        if (value.date.hasOwnProperty(targetDate)){
            result.push({
                numberOfAlerts: value.date[targetDate].numberOfAlerts,
                date: targetDate,
                sourceCountry: key,
                sourceLatitude: value.sourceLatitude,   
                sourceLongitude: value.sourceLongitude,
                target: value.date[targetDate].target,
            });
        }
    });
    return result;
}