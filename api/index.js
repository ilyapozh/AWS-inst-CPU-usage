const { CloudWatchClient, GetMetricDataCommand } = require("@aws-sdk/client-cloudwatch");
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const { PORT = 3005 } = process.env;

const config = {
    region: 'us-east-1',
};

const input = {
    MetricDataQueries: [
            {
                Id: "myRequest",
                MetricStat: {
                    Metric: {
                        Namespace: "AWS/EC2",
                        MetricName: "CPUUtilization",
                        Dimensions: [
                            {
                                "Name": "InstanceId",
                                "Value": "i-0a86544205999b1cf"
                            }
                        ]
                    },
                    Period: 3600,
                    Stat: "Average",
                    Unit: "Percent"
                },
                Label: "myRequestLabel",
                ReturnData: true
            }
        ],
    StartTime: new Date("2021-12-14T00:00:00"),
    EndTime: new Date("2021-12-15T12:00:00"),
};

const aplyQueryToInput = (query) => {
    const curDate = new Date;
    const daysAmount = query.chart/24;
    
    const EndTime = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate(),
        curDate.getHours()
    );

    const StartTime = new Date(
        curDate.getFullYear(),
        curDate.getMonth(),
        curDate.getDate() - daysAmount,
        curDate.getHours()
    );

    input.MetricDataQueries[0].MetricStat.Period = query.interval;
    input.StartTime = StartTime;
    input.EndTime = EndTime; 
    
    return input
} 

async function sendCommandToAWS(query) {
    const modInput = aplyQueryToInput(query);
    const command = new GetMetricDataCommand(input);
    const client = new CloudWatchClient(config);

    const response = await client.send(command);
    return response;
};

const reqHandler = (req,response) => {
    sendCommandToAWS(req.query)
        .then(res => {
            if (res) return res.MetricDataResults;
            return 'Some problem with fetching data from aws'
        })
        .then(res => {
            response.send(res)
        })
        .catch(err => console.log(err))
};

app.get('/', reqHandler);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});
