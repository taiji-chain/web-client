import CurrencyReducer from "../reducers/CurrencyReducer";

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
    }
};

