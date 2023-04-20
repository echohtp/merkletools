import { Menu, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { NextPage } from 'next'
import Head from 'next/head'
import { Fragment, useState } from 'react'
import CreateTreeModal from '@/components/CreateTreeModal'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

const statuses = {
    offline: 'text-gray-500 bg-gray-100/10',
    online: 'text-green-400 bg-green-400/10',
    error: 'text-rose-400 bg-rose-400/10',
}
const environments = {
    Preview: 'text-gray-400 bg-gray-600/30 ring-gray-700',
    Production: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
}
const deployments = [
    {
        id: 1,
        href: '#',
        projectName: 'ios-app',
        teamName: 'Planetaria',
        status: 'offline',
        statusText: 'Initiated 1m 32s ago',
        description: 'Deploys from GitHub',
        environment: 'Preview',
    },
    // More deployments...
]

const CreateAirdrop: NextPage = () => {
    const [open, setOpen] = useState(false)

    return (
        <div>
            <Head>
                <title></title>
                <meta name='description' content='' />
                <link rel='icon' href='/favicon.ico' />
            </Head>

            <CreateTreeModal open={open} setOpen={setOpen} />

            <header className="flex items-center justify-between border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
                <h1 className="text-base font-semibold leading-7 text-white">Create Airdrop</h1>

                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                        setOpen(true)

                    }}
                >
                    Create Airdrop
                </button>


            </header>

            {/* Deployment list */}
            <ul role="list" className="divide-y divide-white/5">
                {deployments.map((deployment) => (
                    <li key={deployment.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
                        <div className="min-w-0 flex-auto">
                            <div className="flex items-center gap-x-3">
                                <div className={classNames(statuses[deployment.status], 'flex-none rounded-full p-1')}>
                                    <div className="h-2 w-2 rounded-full bg-current" />
                                </div>
                                <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                                    <a href={deployment.href} className="flex gap-x-2">
                                        <span className="truncate">{deployment.teamName}</span>
                                        <span className="text-gray-400">/</span>
                                        <span className="whitespace-nowrap">{deployment.projectName}</span>
                                        <span className="absolute inset-0" />
                                    </a>
                                </h2>
                            </div>
                            <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                                <p className="truncate">{deployment.description}</p>
                                <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-gray-300">
                                    <circle cx={1} cy={1} r={1} />
                                </svg>
                                <p className="whitespace-nowrap">{deployment.statusText}</p>
                            </div>
                        </div>
                        <div
                            className={classNames(
                                environments[deployment.environment],
                                'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset'
                            )}
                        >
                            {deployment.environment}
                        </div>
                        <ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                    </li>
                ))}
            </ul>


        </div>
    )
}


export default CreateAirdrop