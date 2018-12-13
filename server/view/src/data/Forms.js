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
                success: '/currencyBalance'
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
                type: 'help',
                description: 'Please be aware that it takes up to 3 minutes to get the wallet generated.',
                variant: 'h6',
                color: 'secondary'
            },
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
                success: '/tokenCreated'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'currency',
                'address',
                'password',
                'name',
                'symbol',
                'totalSupply',
                'decimals'
            ],
            title: 'Create Token',
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
                name: {
                    title: 'Token Name',
                    type: 'string'
                },
                symbol: {
                    title: 'Symbol',
                    type: 'string'
                },
                totalSupply: {
                    title: 'Total Supply',
                    type: 'string'
                },
                decimals: {
                    title: 'Decimals',
                    type: 'string'
                }
            }
        },
        form: [
            {
                type: 'help',
                description: 'Please be aware that it takes up to 3 minutes to get the token generated.',
                variant: 'h6',
                color: 'secondary'
            },
            'currency',
            'address',
            {
                key: 'password',
                type: 'password'
            },
            'name',
            'symbol',
            'totalSupply',
            'decimals'
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
                success: '/tokenTransferred'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'address',
                'password',
                'tokenAddressOrSymbol',
                'toAddress',
                'amount'
            ],
            title: 'Transfer Token',
            properties: {
                address: {
                    title: 'Address',
                    type: 'string'
                },
                password: {
                    title: 'Password',
                    type: 'string'
                },
                tokenAddressOrSymbol: {
                    title: 'Token Address or Symbol',
                    type: 'string'
                },
                toAddress: {
                    title: 'To Address',
                    type: 'string'
                },
                amount: {
                    title: 'Amount',
                    type: 'string'
                }
            }
        },
        form: [
            'address',
            {
                key: 'password',
                type: 'password'
            },
            'tokenAddressOrSymbol',
            'toAddress',
            'amount'
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
                success: '/tokenApproved'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'address',
                'password',
                'tokenAddressOrSymbol',
                'toAddress',
                'amount'
            ],
            title: 'Approve Token',
            properties: {
                address: {
                    title: 'Address',
                    type: 'string'
                },
                password: {
                    title: 'Password',
                    type: 'string'
                },
                tokenAddressOrSymbol: {
                    title: 'Token Address or Symbol',
                    type: 'string'
                },
                toAddress: {
                    title: 'To Address',
                    type: 'string'
                },
                amount: {
                    title: 'Amount',
                    type: 'string'
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
                success: '/tokenWithdrawn'
            }
        ],
        schema: {
            type: 'object',
            required: [
                'address',
                'password',
                'tokenAddressOrSymbol',
                'fromAddress',
                'amount'
            ],
            title: 'Withdraw Token',
            properties: {
                address: {
                    title: 'Address',
                    type: 'string'
                },
                password: {
                    title: 'Password',
                    type: 'string'
                },
                tokenAddressOrSymbol: {
                    title: 'Token Address or Symbol',
                    type: 'string'
                },
                fromAddress: {
                    title: 'From Address',
                    type: 'string'
                },
                amount: {
                    title: 'Amount',
                    type: 'string'
                }
            }
        },
        form: [
            'address',
            {
                key: 'password',
                type: 'password'
            },
            'tokenAddressOrSymbol',
            'fromAddress',
            'amount'
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
                tokenAddressOrSymbol: {
                    title: 'Token Address or Symbol',
                    type: 'string'
                }
            }
        },
        form: [
            '*'
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
            title: 'Token Account',
            properties: {
                address: {
                    title: 'Address',
                    type: 'string'
                },
                symbol: {
                    title: 'Symbol',
                    type: 'string'
                }
            },
            required: [
                'address'
            ]
        },
        form: [
            '*'
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
            title: 'Token Transaction',
            properties: {
                address: {
                    title: 'Address',
                    type: 'string'
                },
                symbol: {
                    title: 'Symbol',
                    type: 'string'
                }
            },
            required: [
                'address'
            ]
        },
        form: [
            '*'
        ]
    },

};

