export const forms = {
    currencyBalanceForm: {
        formId: 'currencyBalanceForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'currency',
                action: 'balance',
                version: '1.0.0',
                title: 'Balance',
                success: '/balance'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'address'
            ],
            title: 'Currency Balance',
            properties: {
                address: {
                    title: 'Address',
                    type: 'string'
                }
            }
        },
        form: [
            '*'
        ]
    },
    currencyTransactionForm: {
        formId: 'currencyTransactionForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'currency',
                action: 'transaction',
                version: '1.0.0',
                title: 'Transaction',
                success: '/currencyTransaction'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'address',
                'currency'
            ],
            title: 'Currency Transaction',
            properties: {
                address: {
                    title: 'Address',
                    type: 'string'
                },
                currency: {
                    title: 'Currency',
                    type: 'string',
                    enum: ['taiji']
                }
            }
        },
        form: [
            '*'
        ]
    },
    currencySendForm: {
        formId: 'currencySendForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'currency',
                action: 'send',
                version: '1.0.0',
                title: 'Balance',
                success: '/currencySent'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'currency',
                'address',
                'password',
                'toAddress',
                'amount',
                'unit'
            ],
            title: 'Currency Send',
            properties: {
                currency: {
                    title: 'Currency',
                    type: 'string',
                    enum: ['taiji']
                },
                address: {
                    title: 'Address',
                    type: 'string'
                },
                password: {
                    title: 'Password',
                    type: 'string'
                },
                toAddress: {
                    title: 'To Address',
                    type: 'string'
                },
                amount: {
                    title: 'Amount',
                    type: 'string',
                },
                unit: {
                    title: 'Unit',
                    type: 'string',
                    enum: ['SHELL', 'KSHELL', 'MSHELL', 'TAIJI', 'KTAIJI', 'MTAIJI']
                }
            }
        },
        form: [
            'currency',
            'address',
            {
                key: 'password',
                type: 'password'
            },
            'toAddress',
            'amount',
            'unit'
        ]
    },
    walletCreateForm: {
        formId: 'walletCreateForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'wallet',
                action: 'create',
                version: '1.0.0',
                title: 'Wallet',
                success: '/wallet'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'password',
                'passwordConfirm',
                'region'
            ],
            title: 'Create Wallet',
            properties: {
                password: {
                    title: 'Password',
                    type: 'string'
                },
                passwordConfirm: {
                    title: 'Password Confirmation',
                    type: 'string'
                },
                region: {
                    title: 'Region',
                    type: 'string',
                    enum: [
                        "0000", "0001", "0002"
                    ]
                }
            }
        },
        form: [
            {
                key: 'password',
                type: 'password'
            },
            {
                key: 'passwordConfirm',
                type: 'password'
            },
            {
                key: 'region',
                type: 'select',
                titleMap: [
                    {
                        value: '0000',
                        name: 'Americas'
                    },
                    {
                        value: '0001',
                        name: 'Asia, Oceania'
                    },
                    {
                        value: '0002',
                        name: 'Europe, Africa'
                    }
                ]
            }
        ]
    },
    tokenCreateForm: {
        formId: 'tokenCreateForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'token',
                action: 'create',
                version: '1.0.0',
                title: 'Token',
                success: '/token'
            }
        ],
        schema: {
            type: 'object',
            required: [
                "currency",
                "address",
                "password",
                "name",
                "symbol",
                "totalSupply",
                "decimals"
            ],
            title: 'Create Token',
            properties: {
                "currency": {
                    title: 'Currency',
                    type: 'string',
                    enum: ['taiji']
                },
                "address": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "symbol": {
                    "type": "string"
                },
                "totalSupply": {
                    "type": "string"
                },
                "decimals": {
                    "type": "string"
                }
            }
        },
        form: [
            "*"
        ]
    },
    tokenTransferForm: {
        formId: 'tokenTransferForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'token',
                action: 'transfer',
                version: '1.0.0',
                title: 'Token',
                success: '/transfer'
            }
        ],
        schema: {
            type: 'object',
            required: [
                "address",
                "password",
                "tokenAddressOrSymbol",
                "toAddress",
                "amount"
            ],
            title: 'Transfer Token',
            properties: {
                "address": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "tokenAddressOrSymbol": {
                    "type": "string"
                },
                "toAddress": {
                    "type": "string"
                },
                "amount": {
                    "type": "string"
                }
            }
        },
        form: [
            "address",
            {
                key: 'password',
                type: 'password'
            },
            "tokenAddressOrSymbol",
            "toAddress",
            "amount"
        ]
    },
    tokenApproveForm: {
        formId: 'tokenApproveForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'token',
                action: 'approve',
                version: '1.0.0',
                title: 'Token',
                success: '/approve'
            }
        ],
        schema: {
            type: 'object',
            required: [
                "address",
                "password",
                "tokenAddressOrSymbol",
                "toAddress",
                "amount"
            ],
            title: 'Approve Token',
            properties: {
                "address": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "tokenAddressOrSymbol": {
                    "type": "string"
                },
                "toAddress": {
                    "type": "string"
                },
                "amount": {
                    "type": "string"
                }
            }
        },
        form: [
            "address",
            {
                key: 'password',
                type: 'password'
            },
            "tokenAddressOrSymbol",
            "toAddress",
            "amount"
        ]
    },
    tokenWithdrawForm: {
        formId: 'tokenWithdrawForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'token',
                action: 'withdraw',
                version: '1.0.0',
                title: 'Token',
                success: '/withdraw'
            }
        ],
        schema: {
            type: 'object',
            required: [
                "address",
                "password",
                "tokenAddressOrSymbol",
                "fromAddress",
                "amount"
            ],
            title: 'Withdraw Token',
            properties: {
                "address": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "tokenAddressOrSymbol": {
                    "type": "string"
                },
                "fromAddress": {
                    "type": "string"
                },
                "amount": {
                    "type": "string"
                }
            }
        },
        form: [
            "address",
            {
                key: 'password',
                type: 'password'
            },
            "tokenAddressOrSymbol",
            "fromAddress",
            "amount"
        ]
    },
    tokenInfoForm: {
        formId: 'tokenInfoForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'token',
                action: 'info',
                version: '1.0.0',
                title: 'Token',
                success: '/tokenInfo'
            }
        ],
        schema: {
            type: 'object',
            title: 'Token Info',
            properties: {
                "tokenAddressOrSymbol": {
                    "type": "string"
                }
            }
        },
        form: [
            "*"
        ]
    },
    tokenAccountForm: {
        formId: 'tokenAccountForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'token',
                action: 'account',
                version: '1.0.0',
                title: 'Token',
                success: '/tokenAccount'
            }
        ],
        schema: {
            type: 'object',
            title: 'Token Info',
            properties: {
                "address": {
                    "type": "string"
                },
                "symbol": {
                    "type": "string"
                }
            },
            "required": [
                "address"
            ]
        },
        form: [
            "*"
        ]
    },
    tokenTransactionForm: {
        formId: 'tokenTransactionForm',
        actions: [
            {
                host: 'taiji.io',
                service: 'token',
                action: 'transaction',
                version: '1.0.0',
                title: 'Token',
                success: '/tokenTransaction'
            }
        ],
        schema: {
            type: 'object',
            title: 'Token Info',
            properties: {
                "address": {
                    "type": "string"
                },
                "symbol": {
                    "type": "string"
                }
            },
            "required": [
                "address"
            ]
        },
        form: [
            "*"
        ]
    },

};

