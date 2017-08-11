/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-08 18:55:00 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-10 20:08:55
 */

'use strict';
import Promise from 'bluebird'
import CLogger from '../helpers/CustomLogger'
import consts from '../config/Constants'
let cLogger = new CLogger();

var DynamoDBModel = {};

DynamoDBModel.FeedTable = {
    AttributeDefinitions: [
        {
            AttributeName: 'Recipient',
            AttributeType: 'S'
        },
        {
            AttributeName: 'Actor',
            AttributeType: 'S'
        }, 
        {
            AttributeName: 'Action',
            AttributeType: 'S'
        },
        {
            AttributeName: 'Target',
            AttributeType: 'S'
        },
        {
            AttributeName: 'ActionTime',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: "Recipient", 
            KeyType: "HASH"
        }, 
        {
            AttributeName: 'ActionTime',
            KeyType: 'RANGE'
        }
    ],
    GlobalSecondaryIndexes: [
        {
            IndexName: 'Feed_GSI_on_Actor',
            KeySchema: [
                {
                    AttributeName: 'Recipient',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'Actor',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                // NonKeyAttributes: ['Actor', 'Recipient', 'ActionTime'],
                ProjectionType: 'KEYS_ONLY'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        },
        {
            IndexName: 'Feed_GSI_on_Target',
            // AttributeDefinitions: [
            //     {
            //         AttributeName: 'Action',
            //         AttributeType: 'S'
            //     },
            //     {
            //         AttributeName: 'Target',
            //         AttributeType: 'S'
            //     },
            // ],
            KeySchema: [
                {
                    AttributeName: 'Target',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'Action',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                // NonKeyAttributes: ['Actor', 'Action', 'Target', 'ActionTime'],
                ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'Feed'
};

DynamoDBModel.HotPostTable = {
    AttributeDefinitions: [
        {
            AttributeName: 'HotType',
            AttributeType: 'S'
        },
        // {
        //     AttributeName: 'Actor',
        //     AttributeType: 'S'
        // },
        // {
        //     AttributeName: 'Target',
        //     AttributeType: 'S'
        // },
        {
            AttributeName: 'ActionTime',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: "HotType", 
            KeyType: "HASH"
        },
        {
            AttributeName: 'ActionTime',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'HotPost'
};

DynamoDBModel.ActivityTable = {
    AttributeDefinitions: [
        {
            AttributeName: 'Actor',
            AttributeType: 'S'
        },
        // {
        //     AttributeName: 'Action',
        //     AttributeType: 'S'
        // },
        // {
        //     AttributeName: 'Target',
        //     AttributeType: 'S'
        // },
        {
            AttributeName: 'ActionTime',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: "Actor", 
            KeyType: "HASH"
        },
        {
            AttributeName: 'ActionTime',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'Activity'
};

DynamoDBModel.PendingMarkTable = {
    AttributeDefinitions: [
        {
            AttributeName: 'Recipient',
            AttributeType: 'S'
        },
        {
            AttributeName: 'Actor',
            AttributeType: 'S'
        }
    ],
    KeySchema: [
        {
            AttributeName: "Recipient", 
            KeyType: "HASH"
        },
        {
            AttributeName: 'Actor',
            KeyType: 'RANGE'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    TableName: 'PendingMark'
}

module.exports = DynamoDBModel;