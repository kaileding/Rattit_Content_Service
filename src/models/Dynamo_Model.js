/*
 * @Author: Kaile Ding 
 * @Date: 2017-08-08 18:55:00 
 * @Last Modified by: Kaile Ding
 * @Last Modified time: 2017-08-12 00:28:12
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

DynamoDBModel.NotificationTable = {
    AttributeDefinitions: [
        {
            AttributeName: 'Recipient',
            AttributeType: 'S'
        },
        {
            AttributeName: 'ActionTime',
            AttributeType: 'S'
        },
        {
            AttributeName: 'ReadOrNot',
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
            IndexName: 'Notification_GSI_on_ReadOrNot',
            KeySchema: [
                {
                    AttributeName: 'Recipient',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'ReadOrNot',
                    KeyType: 'RANGE'
                }
            ],
            Projection: {
                // NonKeyAttributes: ['Actor', 'Recipient', 'ActionTime'],
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
    TableName: 'Notification'
}

module.exports = DynamoDBModel;